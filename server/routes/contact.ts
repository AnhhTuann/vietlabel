import { Router, Request, Response } from 'express';
import { sendEmail } from '../services/emailService';
import { leadService } from '../services/leadService';
import crypto from 'crypto';

export const contactRouter = Router();

contactRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { name, company, email, phone, description, type, quantity } = req.body;
    
    // Create lead
    const { lead } = await leadService.createOrUpdateFromChat({
      sessionId: 'sess_' + Date.now(),
      source: 'web',
      fullName: name,
      company,
      contact: phone || email,
      email,
      productType: type || 'Yêu cầu báo giá',
      quantity: quantity || 'Chưa xác định',
      needHuman: true,
      brief: { name, company, email, phone, description, type, quantity },
      notes: `Form website: ${type || 'Yêu cầu báo giá'} - ${description || ''}`,
    });

    // Send confirmation email to customer
    if (email) {
      await sendEmail(
        email, 
        'Vietlabel - Xác nhận yêu cầu liên hệ / Báo giá',
        `<p>Chào ${name || 'Quý khách'},</p><p>Vietlabel đã nhận được yêu cầu báo giá của bạn. Chuyên viên dự toán kỹ thuật của chúng tôi sẽ liên hệ lại trong thời gian sớm nhất qua số điện thoại ${phone || 'đã cung cấp'}.</p><p>Mã hồ sơ theo dõi: <strong>${lead.code}</strong></p><p>Trân trọng,<br/>Đội ngũ Vietlabel</p>`
      ).catch(() => {});
    }
    
    res.json({ success: true, leadId: lead.id, trackingId: lead.code });
  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
});
