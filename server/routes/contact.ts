import { Router, Request, Response } from 'express';
import { sendEmail } from '../services/emailService';
import { leadService } from '../services/leadService';
import crypto from 'crypto';

export const contactRouter = Router();

contactRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { name, company, email, phone, description, type } = req.body;
    
    // Create lead
    const { lead } = await leadService.createOrUpdateFromChat({
      sessionId: 'sess_' + Date.now(),
      source: 'web',
      brief: { name, company, email, phone, description, type },
      notes: `Form liên hệ: ${type || 'Chung'}`
    });

    // Send confirmation email to customer
    if (email) {
      await sendEmail(
        email, 
        'Vietlabel - Xác nhận yêu cầu liên hệ',
        `<p>Chào ${name},</p><p>Vietlabel đã nhận được yêu cầu của bạn. Chuyên viên của chúng tôi sẽ liên hệ lại trong thời gian sớm nhất qua số điện thoại ${phone}.</p><p>Trân trọng,<br/>Đội ngũ Vietlabel</p>`
      );
    }
    
    res.json({ success: true, leadId: lead.id });
  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});
