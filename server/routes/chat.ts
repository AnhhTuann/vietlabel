import { Router, Request, Response } from 'express';
import { generateAdvisorResponse, ChatMessage } from '../lib/llm';
import { db } from '../db/store';
import { leadService } from '../services/leadService';
import { conversationService } from '../services/conversationService';

export const chatRouter = Router();

// In-memory rate limiting map: ip -> timestamps
const ipRequests = new Map<string, number[]>();

function checkRateLimit(ip: string, limit = 40, windowMs = 60 * 1000): boolean {
  const now = Date.now();
  const timestamps = (ipRequests.get(ip) || []).filter(t => now - t < windowMs);
  if (timestamps.length >= limit) {
    return false;
  }
  timestamps.push(now);
  ipRequests.set(ip, timestamps);
  return true;
}

chatRouter.post('/', async (req: Request, res: Response) => {
  const clientIp = req.ip || req.socket.remoteAddress || '127.0.0.1';

  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      error: 'Quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút.',
    });
  }

  const { sessionId = 'default-session', messages, attachments, stream } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Danh sách tin nhắn không hợp lệ.' });
  }

  const latestUserMsg = [...messages].reverse().find(m => m.role === 'user');
  const latestText = latestUserMsg?.content || '';

  try {
    // 1. Ensure Lead and Conversation exist in Database via shared leadService
    const { lead } = await leadService.createOrUpdateFromChat({
      sessionId,
      source: 'web',
      notes: latestText,
    });

    const conversation = db.conversations.findBySessionId(sessionId);

    if (conversation && latestUserMsg) {
      // Append customer message to database
      conversationService.appendMessage({
        conversationId: conversation.id,
        sender: 'CUSTOMER',
        text: latestText,
        attachments,
      });

      // 2. CHECK IF CONVERSATION IS TAKEN OVER BY HUMAN AGENT
      if (conversation.mode === 'HUMAN') {
        const staffUser = conversation.humanAgentId ? db.users.findById(conversation.humanAgentId) : null;
        const staffName = staffUser?.name || 'Chuyên viên tư vấn';

        const humanWaitReply = `Dạ ${staffName} đang tiếp quản và đọc tin nhắn của anh/chị. Nhân viên sẽ phản hồi trực tiếp ngay tại đây ạ!`;

        if (stream) {
          res.setHeader('Content-Type', 'text/event-stream');
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('Connection', 'keep-alive');
          res.write(`data: ${JSON.stringify({ chunk: humanWaitReply })}\n\n`);
          res.write(`data: ${JSON.stringify({ done: true, metadata: { mode: 'HUMAN', staffName } })}\n\n`);
          return res.end();
        }

        return res.json({
          sessionId,
          reply: humanWaitReply,
          mode: 'HUMAN',
          staffName,
          extractedFields: lead.brief || {},
          missingFields: lead.missingFields || [],
          leadScore: lead.score,
          needHuman: true,
          briefReady: false,
        });
      }
    }

    // 3. BOT MODE: Generate AI Response
    const analysis = await generateAdvisorResponse(messages as ChatMessage[], attachments);

    // Save bot reply to database
    if (conversation) {
      conversationService.appendMessage({
        conversationId: conversation.id,
        sender: 'BOT',
        text: analysis.replyText,
      });

      // Update lead with newly extracted brief data
      await leadService.createOrUpdateFromChat({
        sessionId,
        brief: analysis.extractedFields,
        missingFields: analysis.missingFields,
        needHuman: analysis.needHuman,
      });
    }

    // 4. Return response (streaming SSE or JSON)
    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const words = analysis.replyText.split(/(\s+)/);
      for (const word of words) {
        res.write(`data: ${JSON.stringify({ chunk: word })}\n\n`);
        await new Promise(r => setTimeout(r, 20));
      }

      res.write(`data: ${JSON.stringify({ done: true, metadata: analysis })}\n\n`);
      return res.end();
    }

    return res.json({
      sessionId,
      reply: analysis.replyText,
      extractedFields: analysis.extractedFields,
      missingFields: analysis.missingFields,
      leadScore: analysis.leadScore,
      needHuman: analysis.needHuman,
      briefReady: analysis.briefReady,
      sources: analysis.sources,
    });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    return res.status(500).json({
      error: 'Hệ thống đang bận. Vui lòng kết nối trực tiếp qua Hotline 086 896 8089.',
    });
  }
});
