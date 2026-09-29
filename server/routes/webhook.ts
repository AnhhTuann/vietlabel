import { Router, Request, Response } from 'express';
import { leadsDatabase } from './lead';
import { generateAdvisorResponse } from '../lib/llm';

export const webhookRouter = Router();

// Zalo OA Webhook
webhookRouter.get('/zalo', (req: Request, res: Response) => {
  // Verification challenge
  const challenge = req.query.challenge;
  if (challenge) {
    return res.send(challenge);
  }
  return res.json({ status: 'Zalo Webhook Active' });
});

webhookRouter.post('/zalo', async (req: Request, res: Response) => {
  try {
    const event = req.body;
    console.log('[ZALO WEBHOOK RECEIVED]', event?.event_name);

    if (event?.event_name === 'user_send_text') {
      const userText = event?.message?.text || '';
      const senderId = event?.sender?.id;

      // Pipeline AI tư vấn
      const analysis = await generateAdvisorResponse([
        { role: 'user', content: userText }
      ]);

      if (analysis.extractedFields && Object.keys(analysis.extractedFields).length > 0) {
        leadsDatabase.unshift({
          id: `LEAD-ZALO-${Date.now().toString(36)}`,
          contact: senderId,
          productType: analysis.extractedFields.productType || 'Tư vấn Zalo OA',
          leadScore: analysis.leadScore || 'WARM',
          status: 'NEW',
          source: 'zalo_oa',
          ...analysis.extractedFields,
          createdAt: new Date().toISOString(),
        });
      }
    }

    return res.json({ error: 0, message: 'Success' });
  } catch (err: any) {
    console.error('Zalo webhook error:', err);
    return res.status(500).json({ error: -1, message: err.message });
  }
});

// Messenger Webhook
webhookRouter.get('/messenger', (req: Request, res: Response) => {
  const verifyToken = process.env.FB_VERIFY_TOKEN || 'vietlabel_verify_token_2026';
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === verifyToken) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

webhookRouter.post('/messenger', async (req: Request, res: Response) => {
  const body = req.body;
  if (body.object === 'page') {
    for (const entry of body.entry || []) {
      const webhookEvent = entry.messaging?.[0];
      if (webhookEvent && webhookEvent.message) {
        console.log('[MESSENGER EVENT]', webhookEvent.message.text);
      }
    }
    return res.status(200).send('EVENT_RECEIVED');
  }
  return res.sendStatus(404);
});
