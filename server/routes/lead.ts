import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { LeadRecord } from '../notifiers/types';
import { notifyStaff, telegramNotifier, isWithinWorkingHours } from '../notifiers';
import { computeLeadScore } from '../lib/scoring';

export const leadRouter = Router();

// In-memory lead store for audit and CRM export
export const leadsDatabase: LeadRecord[] = [];

// Helper to look up latest state
export function getLeadById(id: string): LeadRecord | undefined {
  return leadsDatabase.find(l => l.id === id);
}

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

    // Compute deterministic lead score by code
    const scoreResult = computeLeadScore(validatedData);

    const leadRecord: LeadRecord = {
      id: `LEAD-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      ...validatedData,
      leadScore: scoreResult.score,
      status: scoreResult.isHot ? 'NEEDS_HUMAN' : 'NEW',
      createdAt: new Date().toISOString(),
    };

    leadsDatabase.unshift(leadRecord);
    console.log(`[LEAD CREATED] ${leadRecord.id} | Score: ${leadRecord.leadScore} (${scoreResult.points} pts) | Contact: ${leadRecord.contact}`);

    // Trigger notification to staff via Telegram (primary) + Zalo (secondary)
    // Only notify when brief is completed or lead is HOT (Requirement 1)
    await notifyStaff(leadRecord, getLeadById);

    // Google Sheets / Webhook trigger
    const webhookUrl = process.env.SALES_WEBHOOK_URL;
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'lead_created', lead: leadRecord }),
      }).catch(err => console.warn('Sales webhook error:', err.message));
    }

    const isWorking = isWithinWorkingHours();
    const staffNotice = isWorking
      ? 'Chuyên viên dự toán kỹ thuật Vietlabel đã tiếp nhận và sẽ liên hệ trong vòng 2 giờ làm việc.'
      : 'Hiện tại ngoài giờ làm việc. Chuyên viên Vietlabel sẽ ưu tiên liên hệ trước 9:00 sáng mai.';

    return res.status(201).json({
      success: true,
      leadId: leadRecord.id,
      leadScore: leadRecord.leadScore,
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

    const leadRecord: LeadRecord = {
      id: `HANDOFF-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      sessionId,
      fullName: fullName || 'Khách yêu cầu gặp nhân viên',
      contact: contact || 'Đang chờ trên web',
      productType: productType || 'Tư vấn trực tiếp theo yêu cầu',
      leadScore: 'HOT',
      status: 'NEEDS_HUMAN',
      notes: notes || 'Khách bấm nút [Gặp nhân viên tư vấn] trên khung chat.',
      source: 'web_handoff_request',
      conversationHistory: conversationHistory || [],
      createdAt: new Date().toISOString(),
    };

    leadsDatabase.unshift(leadRecord);
    console.log(`[HANDOFF REQUEST] #${leadRecord.id} from customer ${leadRecord.fullName} (${leadRecord.contact})`);

    // Immediate dispatch to Telegram + Zalo
    await notifyStaff(leadRecord, getLeadById);

    const isWorking = isWithinWorkingHours();
    const notice = isWorking
      ? 'Chuyên viên dự toán kỹ thuật đang kết nối. Nếu cần hỗ trợ khẩn cấp, anh/chị có thể gọi ngay hotline 086 896 8089.'
      : 'Hiện tại ngoài giờ làm việc (08:00 - 17:30). Đội ngũ Vietlabel sẽ ưu tiên liên hệ anh/chị trước 9:00 sáng mai.';

    return res.json({
      success: true,
      leadId: leadRecord.id,
      message: notice,
      inWorkingHours: isWorking,
    });
  } catch (err: any) {
    console.error('Handoff error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Staff claims lead (Nhận xử lý)
leadRouter.post('/:id/claim', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { claimedBy } = req.body;

  const lead = leadsDatabase.find(l => l.id === id);
  if (!lead) {
    return res.status(404).json({ success: false, error: 'Không tìm thấy hồ sơ lead.' });
  }

  if (lead.status === 'CLAIMED' && lead.claimedBy && lead.claimedBy !== claimedBy) {
    return res.status(409).json({
      success: false,
      error: `Hồ sơ này đã được nhận xử lý bởi ${lead.claimedBy} vào lúc ${lead.claimedAt}.`,
      claimedBy: lead.claimedBy,
      claimedAt: lead.claimedAt,
    });
  }

  const staffName = claimedBy || 'Chuyên viên Vietlabel';
  lead.status = 'CLAIMED';
  lead.claimedBy = staffName;
  lead.claimedAt = new Date().toISOString();

  // Update message in Telegram
  await telegramNotifier.updateClaimed(lead, staffName);

  console.log(`[LEAD CLAIMED] #${lead.id} claimed by ${staffName}`);

  return res.json({
    success: true,
    message: `Đã xác nhận nhận xử lý hồ sơ #${lead.id}`,
    lead,
  });
});

// 4. Admin API: list leads with filters
leadRouter.get('/', (req: Request, res: Response) => {
  const { status, score, q } = req.query;

  let filtered = [...leadsDatabase];

  if (status && typeof status === 'string') {
    filtered = filtered.filter(l => l.status === status);
  }

  if (score && typeof score === 'string') {
    filtered = filtered.filter(l => l.leadScore === score);
  }

  if (q && typeof q === 'string') {
    const query = q.toLowerCase();
    filtered = filtered.filter(
      l =>
        l.id.toLowerCase().includes(query) ||
        (l.fullName && l.fullName.toLowerCase().includes(query)) ||
        (l.contact && l.contact.toLowerCase().includes(query)) ||
        (l.productType && l.productType.toLowerCase().includes(query))
    );
  }

  return res.json({
    total: filtered.length,
    leads: filtered,
    stats: {
      total: leadsDatabase.length,
      hot: leadsDatabase.filter(l => l.leadScore === 'HOT').length,
      warm: leadsDatabase.filter(l => l.leadScore === 'WARM').length,
      cold: leadsDatabase.filter(l => l.leadScore === 'COLD').length,
      needsHuman: leadsDatabase.filter(l => l.status === 'NEEDS_HUMAN').length,
      claimed: leadsDatabase.filter(l => l.status === 'CLAIMED').length,
    },
  });
});

// 5. Admin API: get single lead
leadRouter.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const lead = leadsDatabase.find(l => l.id === id);

  if (!lead) {
    return res.status(404).json({ success: false, error: 'Không tìm thấy hồ sơ lead.' });
  }

  return res.json({ success: true, lead });
});
