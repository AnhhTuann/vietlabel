import { Request, Response, Router } from 'express';
import { db } from '../db/store.js';

export const feedbackRouter = Router();

export const feedbackDatabase: Array<{
  id: string;
  sessionId?: string;
  rating: number | 'like' | 'dislike';
  comment?: string;
  createdAt: string;
}> = [];

feedbackRouter.post('/', async (req: Request, res: Response) => {
  const { sessionId, rating, comment } = req.body;

  if (
    typeof sessionId !== 'string' ||
    sessionId.length < 8 ||
    sessionId.length > 100 ||
    !(
      (typeof rating === 'number' && Number.isInteger(rating) && rating >= 1 && rating <= 5) ||
      rating === 'like' ||
      rating === 'dislike'
    )
  ) {
    return res.status(400).json({ error: 'Đánh giá không hợp lệ.' });
  }

  const record = {
    id: `FB-${Date.now().toString(36)}`,
    sessionId,
    rating,
    comment: comment || '',
    createdAt: new Date().toISOString(),
  };

  feedbackDatabase.push(record);
  if (typeof rating === 'number') {
    try {
      const conversation = await db.conversations.findBySessionId(sessionId);
      if (conversation) await db.conversations.update(conversation.id, { csat: rating });
    } catch (error) {
      console.error('Failed to persist CSAT rating:', error);
      return res.status(500).json({ error: 'Không thể lưu đánh giá lúc này.' });
    }
  }
  console.log(`[CSAT FEEDBACK] Rating: ${rating} | Comment: ${comment || 'None'}`);

  return res.json({
    success: true,
    message:
      'Cảm ơn bạn đã phản hồi! Đánh giá của bạn giúp Vietlabel ngày càng hoàn thiện chất lượng dịch vụ.',
  });
});
