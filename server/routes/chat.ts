import { Router, Request, Response } from 'express';
import { generateAdvisorResponse, ChatMessage } from '../lib/llm.js';
import { db } from '../db/store.js';
import { leadService } from '../services/leadService.js';
import { conversationService } from '../services/conversationService.js';
import { ChatRateLimiter, validateChatRequest } from '../lib/chatProtection.js';

export const chatRouter = Router();
const chatRateLimiter = new ChatRateLimiter();

chatRouter.post('/', async (req: Request, res: Response) => {
  const clientIp = req.ip || req.socket.remoteAddress || '127.0.0.1';
  const input = validateChatRequest(req.body);
  if (!input) {
    return res.status(400).json({
      error: 'Tin nhắn không hợp lệ. Mỗi tin tối đa 2.000 ký tự, tối đa 5 file và cần gửi tin nhắn cuối cùng.',
    });
  }

  const latestClientMessage = input.messages[input.messages.length - 1];
  if (latestClientMessage.role !== 'user') {
    return res.status(400).json({ error: 'Tin nhắn cuối cùng cần là tin nhắn của khách hàng.' });
  }

  const rateLimit = chatRateLimiter.consume(clientIp, input.sessionId);
  if (!rateLimit.allowed) {
    res.setHeader('Retry-After', String(rateLimit.retryAfterSeconds));
    return res.status(429).json({
      error: 'Anh/chị đang gửi tin quá nhanh. Vui lòng đợi một chút rồi thử lại.',
      retryAfterSeconds: rateLimit.retryAfterSeconds,
    });
  }

  const { sessionId, messages, attachments, stream } = input;
  const latestUserMsg = messages[messages.length - 1];
  const latestText = latestUserMsg.content;

  try {
    // 1. Ensure Lead and Conversation exist in Database via shared leadService
    const { lead } = await leadService.createOrUpdateFromChat({
      sessionId,
      source: 'web',
      notes: latestText,
    });

    const conversation = await db.conversations.findBySessionId(sessionId);

    if (conversation && latestUserMsg) {
      // Append customer message to database
      await conversationService.appendMessage({
        conversationId: conversation.id,
        sender: 'CUSTOMER',
        text: latestText,
        attachments,
      });

      // 2. CHECK IF CONVERSATION IS TAKEN OVER BY HUMAN AGENT
      if (conversation.mode === 'HUMAN') {
        const staffUser = conversation.humanAgentId ? await db.users.findById(conversation.humanAgentId) : null;
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
      const savedReply = await conversationService.appendMessage({
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
      analysis.messageId = savedReply.id;
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
      messageId: analysis.messageId,
    });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    return res.status(500).json({
      error: 'Hệ thống đang bận. Vui lòng kết nối trực tiếp qua Hotline 086 896 8089.',
    });
  }
});

chatRouter.post('/feedback', async (req: Request, res: Response) => {
  const clientIp = req.ip || req.socket.remoteAddress || '127.0.0.1';
  const { sessionId, messageId, helpful } = req.body || {};
  if (
    typeof sessionId !== 'string'
    || !/^[a-zA-Z0-9_-]{8,100}$/.test(sessionId)
    || typeof messageId !== 'string'
    || messageId.length > 120
    || helpful !== false
  ) {
    return res.status(400).json({ error: 'Đánh giá câu trả lời không hợp lệ.' });
  }

  const rateLimit = chatRateLimiter.consume(clientIp, sessionId);
  if (!rateLimit.allowed) {
    res.setHeader('Retry-After', String(rateLimit.retryAfterSeconds));
    return res.status(429).json({ error: 'Vui lòng thử lại sau.', retryAfterSeconds: rateLimit.retryAfterSeconds });
  }

  try {
    const conversation = await db.conversations.findBySessionId(sessionId);
    if (!conversation) return res.status(404).json({ error: 'Không tìm thấy cuộc trò chuyện.' });
    const messages = await db.messages.listByConversationId(conversation.id);
    const target = messages.find(message => message.id === messageId && message.sender === 'BOT');
    if (!target) return res.status(404).json({ error: 'Không tìm thấy câu trả lời để đánh giá.' });
    if (target.isFlaggedWrong) return res.json({ success: true, alreadySubmitted: true });

    const updated = await db.messages.update(messageId, { isFlaggedWrong: true });
    if (!updated) return res.status(404).json({ error: 'Không tìm thấy câu trả lời để đánh giá.' });
    return res.json({ success: true });
  } catch (error) {
    console.error('Failed to record chat answer feedback:', error);
    return res.status(500).json({ error: 'Không thể ghi nhận đánh giá lúc này.' });
  }
});
