import { Router, Request, Response } from 'express';

export const feedbackRouter = Router();

export const feedbackDatabase: Array<{
  id: string;
  sessionId?: string;
  rating: number | 'like' | 'dislike';
  comment?: string;
  createdAt: string;
}> = [];

feedbackRouter.post('/', (req: Request, res: Response) => {
  const { sessionId, rating, comment } = req.body;

  if (rating === undefined || rating === null) {
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
  console.log(`[CSAT FEEDBACK] Rating: ${rating} | Comment: ${comment || 'None'}`);

  return res.json({
    success: true,
    message: 'Cảm ơn bạn đã phản hồi! Đánh giá của bạn giúp Vietlabel ngày càng hoàn thiện chất lượng dịch vụ.',
  });
});
