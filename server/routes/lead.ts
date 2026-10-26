import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { notifyStaff, telegramNotifier, isWithinWorkingHours } from '../notifiers';
import { computeLeadScore } from '../lib/scoring';
import { leadService } from '../services/leadService';
import { db } from '../db/store';
import { authService, AuthenticatedRequest } from '../services/authService';

export const leadRouter = Router();

const customerBriefSchema = z.object({
  sessionId: z.string().optional(),
  fullName: z.string().optional(),
  company: z.string().optional(),
  contact: z.string().min(6, 'Vui lòng cung cấp số điện thoại hoặc email liên hệ'),
  email: z.string().email().optional().or(z.literal('')),
  industry: z.string().optional(),
  productType: z.string().min(2, 'Vui lòng chọn loại sản phẩm/tem nhãn'),
  innerProductOrSurface: z.string().optional(),
  dimensions: z.string().optional(),
  quantity: z.union([z.string(), z.number()]).optional(),
  material: z.string().optional(),
  finishing: z.string().optional(),
  hasDesignFile: z.union([z.boolean(), z.string()]).optional(),
  attachments: z.array(z.object({
    name: z.string(),
    url: z.string().optional(),
    size: z.number().optional(),
  })).optional(),
  deadline: z.string().optional(),
  deliveryLocation: z.string().optional(),
  notes: z.string().optional(),
  source: z.string().default('web_ai_chat'),
  conversationHistory: z.array(z.object({
    role: z.string(),
    content: z.string(),
    timestamp: z.string().optional(),
  })).optional(),
});

// 1. Submit Customer Brief (completed by customer or AI)
leadRouter.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = customerBriefSchema.parse(req.body);

    // Compute deterministic lead score
    const scoreResult = computeLeadScore(validatedData);

    const sessionId = validatedData.sessionId || `sess_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

    // Persist to central CRM DB (single source of truth — Bug #1 fix)
    const { lead } = await leadService.createOrUpdateFromChat({
      sessionId,
      source: 'web',
      fullName: validatedData.fullName,
      company: validatedData.company,
      contact: validatedData.contact,
      email: validatedData.email,
      productType: validatedData.productType,
      quantity: validatedData.quantity,
      deadline: validatedData.deadline,
      hasDesignFile: validatedData.hasDesignFile,
      needHuman: scoreResult.isHot,
      brief: validatedData as Record<string, any>,
      notes: validatedData.notes,
    });

    console.log(`[LEAD CREATED] ${lead.id} | Score: ${lead.score} | Contact: ${validatedData.contact}`);

    // Google Sheets / Webhook trigger
    const webhookUrl = process.env.SALES_WEBHOOK_URL;
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'lead_created', lead }),
      }).catch(err => console.warn('Sales webhook error:', err.message));
    }

    const isWorking = isWithinWorkingHours();
    const staffNotice = isWorking
      ? 'Chuyên viên dự toán kỹ thuật Vietlabel đã tiếp nhận và sẽ liên hệ trong vòng 2 giờ làm việc.'
      : 'Hiện tại ngoài giờ làm việc. Chuyên viên Vietlabel sẽ ưu tiên liên hệ trước 9:00 sáng mai.';

    return res.status(201).json({
      success: true,
      leadId: lead.id,
      leadScore: lead.score,
      message: 'Thông tin yêu cầu đã được chuyển thành công tới chuyên viên dự toán kỹ thuật Vietlabel!',
      notice: staffNotice,
      inWorkingHours: isWorking,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: error.issues.map(i => i.message).join(', '),
      });
    }
    console.error('Lead submission error:', error);
    return res.status(500).json({
      success: false,
      error: 'Không thể ghi nhận thông tin. Vui lòng liên hệ trực tiếp hotline 086 896 8089.',
    });
  }
});

// 2. Customer requested human handoff (Gặp nhân viên)
leadRouter.post('/handoff', async (req: Request, res: Response) => {
  try {
    const { contact, fullName, notes, productType, sessionId, conversationHistory } = req.body;

    const sid = sessionId || `handoff_${Date.now().toString(36)}`;

    // Persist to central CRM DB (single source of truth — Bug #1 fix)
    const { lead } = await leadService.createOrUpdateFromChat({
      sessionId: sid,
      source: 'web',
      fullName: fullName || 'Khách yêu cầu gặp nhân viên',
      contact: contact,
      productType: productType || 'Tư vấn trực tiếp theo yêu cầu',
      needHuman: true,
      notes: notes || 'Khách bấm nút [Gặp nhân viên tư vấn] trên khung chat.',
    });

    console.log(`[HANDOFF REQUEST] #${lead.id} from ${lead.customerName} (${contact})`);

    const isWorking = isWithinWorkingHours();
    const notice = isWorking
      ? 'Chuyên viên dự toán kỹ thuật đang kết nối. Nếu cần hỗ trợ khẩn cấp, anh/chị có thể gọi ngay hotline 086 896 8089.'
      : 'Hiện tại ngoài giờ làm việc (08:00 - 17:30). Đội ngũ Vietlabel sẽ ưu tiên liên hệ anh/chị trước 9:00 sáng mai.';

    return res.json({
      success: true,
      leadId: lead.id,
      message: notice,
      inWorkingHours: isWorking,
    });
  } catch (err: any) {
    console.error('Handoff error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Staff claim endpoint retained for authenticated legacy clients.
leadRouter.post(
  '/:id/claim',
  authService.middleware,
  authService.requireRole(['ADMIN', 'MANAGER', 'SALES']),
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    try {
      const updated = await leadService.claim(id, req.user!.id, req.user!.name);
      return res.json({
        success: true,
        message: `Đã xác nhận nhận xử lý hồ sơ #${id}`,
        lead: updated,
      });
    } catch (err: any) {
      const statusCode = err.status || 400;
      return res.status(statusCode).json({
        success: false,
        error: err.message,
        claimedBy: err.claimedBy,
        claimedAt: err.claimedAt,
      });
    }
  }
);

// Legacy CRM endpoints remain available only to authenticated staff.
leadRouter.get(
  '/',
  authService.middleware,
  authService.requireRole(['ADMIN', 'MANAGER', 'SALES']),
  async (req: Request, res: Response) => {
    const { status, score, q } = req.query;

    const result = await leadService.getLeads({
      status: status as string,
      score: score as string,
      q: q as string,
    });

    return res.json(result);
  }
);

leadRouter.get(
  '/:id',
  authService.middleware,
  authService.requireRole(['ADMIN', 'MANAGER', 'SALES']),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const lead = await db.leads.findById(id);

    if (!lead) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy hồ sơ lead.' });
    }

    return res.json({ success: true, lead });
  }
);
