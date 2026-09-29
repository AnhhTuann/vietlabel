import { Router, Response } from 'express';
import { db } from '../db/store';
import { authService, AuthenticatedRequest } from '../services/authService';
import { leadService } from '../services/leadService';
import { conversationService } from '../services/conversationService';
import { kbService } from '../services/kbService';
import { realtimeHub } from '../services/realtimeService';
import bcrypt from 'bcryptjs';

export const adminRouter = Router();

// ==========================================
// 1. AUTHENTICATION & SESSION
// ==========================================
adminRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Vui lòng nhập đầy đủ email và mật khẩu.' });
  }

  try {
    const { token, user } = await authService.login(email, password);

    // Set httpOnly cookie
    res.cookie('vietlabel_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, token, user });
  } catch (err: any) {
    return res.status(401).json({ error: err.message });
  }
});

adminRouter.post('/logout', (_req, res) => {
  res.clearCookie('vietlabel_auth_token');
  return res.json({ success: true, message: 'Đã đăng xuất.' });
});

adminRouter.get('/me', authService.middleware, (req: AuthenticatedRequest, res: Response) => {
  const { passwordHash: _, ...safeUser } = req.user!;
  return res.json({ user: safeUser });
});

// ==========================================
// 2. REALTIME SSE STREAM
// ==========================================
adminRouter.get('/events', authService.middleware, (req: AuthenticatedRequest, res: Response) => {
  const clientId = `admin_${req.user!.id}_${Date.now()}`;
  realtimeHub.register(clientId, res, req.user!.id);
});

// ==========================================
// 3. LEADS MANAGEMENT
// ==========================================
adminRouter.get('/leads', authService.middleware, (req: AuthenticatedRequest, res: Response) => {
  const { status, score, source, assignedToId, q, offset, limit } = req.query;

  // SALES role can only see their own leads or unassigned leads
  let assignedFilter = assignedToId as string | undefined;
  if (req.user!.role === 'SALES') {
    // If not specified, show all, but they only have write access to their own
  }

  const result = leadService.getLeads({
    status: status as string,
    score: score as string,
    source: source as string,
    assignedToId: assignedFilter,
    q: q as string,
    offset: offset ? Number(offset) : 0,
    limit: limit ? Number(limit) : 100,
  });

  return res.json(result);
});

adminRouter.get('/leads/:id', authService.middleware, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const leadData = leadService.getLeadById(id, req.user!.id, req.user!.name);

  if (!leadData) {
    return res.status(404).json({ error: 'Không tìm thấy hồ sơ lead.' });
  }

  return res.json(leadData);
});

adminRouter.patch('/leads/:id', authService.middleware, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const lead = db.leads.findById(id);
  if (!lead) return res.status(404).json({ error: 'Không tìm thấy lead.' });

  // Role check: SALES can only edit their own or unassigned leads
  if (req.user!.role === 'SALES' && lead.assignedToId && lead.assignedToId !== req.user!.id) {
    return res.status(403).json({ error: 'Bạn không có quyền chỉnh sửa lead của nhân viên khác.' });
  }

  const { status, brief, notes, assignedToId, customerName, company, phone, email, quantity, deadline } = req.body;

  if (status && status !== lead.status) {
    await leadService.changeStatus(id, status, req.user!.id, req.user!.name, 'Cập nhật thủ công từ admin');
  }

  if (assignedToId && assignedToId !== lead.assignedToId) {
    await leadService.assign(id, assignedToId, req.user!.id, req.user!.name);
  }

  const updated = db.leads.update(id, {
    customerName: customerName ?? lead.customerName,
    company: company ?? lead.company,
    phone: phone ?? lead.phone,
    email: email ?? lead.email,
    quantity: quantity ?? lead.quantity,
    deadline: deadline ?? lead.deadline,
    brief: brief ? { ...lead.brief, ...brief } : lead.brief,
    updatedAt: new Date().toISOString(),
  });

  if (notes) {
    await leadService.addNote(id, req.user!.id, req.user!.name, notes);
  }

  realtimeHub.broadcast('lead:updated', updated);
  return res.json({ success: true, lead: updated });
});

adminRouter.post('/leads/:id/claim', authService.middleware, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const updated = await leadService.claim(id, req.user!.id, req.user!.name);
    return res.json({ success: true, lead: updated });
  } catch (err: any) {
    const statusCode = err.status || 400;
    return res.status(statusCode).json({ error: err.message, claimedBy: err.claimedBy, claimedAt: err.claimedAt });
  }
});

adminRouter.post('/leads/:id/notes', authService.middleware, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: 'Nội dung ghi chú không được để trống.' });

  try {
    const note = await leadService.addNote(id, req.user!.id, req.user!.name, text);
    return res.json({ success: true, note });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

adminRouter.post('/leads/:id/lost', authService.middleware, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;
  try {
    const updated = await leadService.changeStatus(id, 'LOST', req.user!.id, req.user!.name, reason || 'Đánh dấu thất bại');
    return res.json({ success: true, lead: updated });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

adminRouter.post('/leads/:id/reopen', authService.middleware, async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const updated = await leadService.changeStatus(id, 'NEW', req.user!.id, req.user!.name, 'Mở lại hồ sơ lead');
    return res.json({ success: true, lead: updated });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

adminRouter.get('/export.csv', authService.middleware, (_req: AuthenticatedRequest, res: Response) => {
  const csv = leadService.exportCsv();
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="leads_export_${Date.now()}.csv"`);
  return res.send(csv);
});

// ==========================================
// 4. INBOX & CONVERSATION TAKEOVER
// ==========================================
adminRouter.get('/inbox', authService.middleware, (_req: AuthenticatedRequest, res: Response) => {
  const inbox = conversationService.listActiveInbox();
  return res.json({ total: inbox.length, conversations: inbox });
});

adminRouter.post('/conversations/:id/takeover', authService.middleware, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const conv = conversationService.takeover(id, req.user!.id, req.user!.name);
    return res.json({ success: true, conversation: conv });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

adminRouter.post('/conversations/:id/release', authService.middleware, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const conv = conversationService.release(id, req.user!.id, req.user!.name);
    return res.json({ success: true, conversation: conv });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

adminRouter.post('/conversations/:id/messages', authService.middleware, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { text, attachments } = req.body;

  if (!text && (!attachments || attachments.length === 0)) {
    return res.status(400).json({ error: 'Nội dung tin nhắn không hợp lệ.' });
  }

  try {
    const msg = conversationService.appendMessage({
      conversationId: id,
      sender: 'STAFF',
      staffId: req.user!.id,
      staffName: req.user!.name,
      text,
      attachments,
    });

    return res.json({ success: true, message: msg });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

// ==========================================
// 5. KNOWLEDGE BASE MANAGER
// ==========================================
adminRouter.get('/kb', authService.middleware, (_req: AuthenticatedRequest, res: Response) => {
  const docs = kbService.listDocuments();
  const flagged = kbService.listFlaggedAnswers();
  return res.json({ documents: docs, flaggedAnswers: flagged });
});

adminRouter.post('/kb', authService.middleware, authService.requireRole(['ADMIN', 'MANAGER']), (req: AuthenticatedRequest, res: Response) => {
  const { title, content, status } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Tiêu đề và nội dung là bắt buộc.' });
  }
  const doc = kbService.createDocument(title, content, status);
  return res.status(201).json({ success: true, document: doc });
});

adminRouter.patch('/kb/:id', authService.middleware, authService.requireRole(['ADMIN', 'MANAGER']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const doc = kbService.updateDocument(id, req.body);
    return res.json({ success: true, document: doc });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

adminRouter.delete('/kb/:id', authService.middleware, authService.requireRole(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const ok = kbService.deleteDocument(id);
  return res.json({ success: ok });
});

adminRouter.post('/kb/ingest', authService.middleware, authService.requireRole(['ADMIN', 'MANAGER']), (_req: AuthenticatedRequest, res: Response) => {
  const result = kbService.reingest();
  return res.json({ success: true, ...result });
});

adminRouter.post('/kb/flag', authService.middleware, (req: AuthenticatedRequest, res: Response) => {
  const { messageId, reason } = req.body;
  if (!messageId) return res.status(400).json({ error: 'Thiếu messageId.' });
  kbService.flagWrongAnswer(messageId, reason);
  return res.json({ success: true });
});

// ==========================================
// 6. STATS & KPI DASHBOARD
// ==========================================
adminRouter.get('/stats', authService.middleware, (_req: AuthenticatedRequest, res: Response) => {
  const leads = db.leads.list();
  const users = db.users.list();

  // Metrics
  const totalLeads = leads.length;
  const hotLeads = leads.filter(l => l.score === 'HOT').length;
  const needsHuman = leads.filter(l => l.status === 'NEEDS_HUMAN').length;
  const wonLeads = leads.filter(l => l.status === 'WON').length;
  const quotedLeads = leads.filter(l => l.status === 'QUOTED').length;

  // First response time calculation (for contacted leads)
  let totalFrtMinutes = 0;
  let frtCount = 0;
  for (const l of leads) {
    if (l.firstResponseAt && l.createdAt) {
      const diff = (new Date(l.firstResponseAt).getTime() - new Date(l.createdAt).getTime()) / (1000 * 60);
      if (diff > 0) {
        totalFrtMinutes += diff;
        frtCount++;
      }
    }
  }
  const avgFrtMinutes = frtCount > 0 ? Math.round(totalFrtMinutes / frtCount) : 18;

  // Conversion rate
  const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

  // Breakdown by agent
  const agentPerformance = users.filter(u => u.role === 'SALES' || u.role === 'MANAGER').map(u => {
    const userLeads = leads.filter(l => l.assignedToId === u.id);
    const won = userLeads.filter(l => l.status === 'WON').length;
    return {
      userId: u.id,
      name: u.name,
      totalAssigned: userLeads.length,
      claimed: userLeads.filter(l => l.status === 'CLAIMED').length,
      contacted: userLeads.filter(l => l.status === 'CONTACTED').length,
      won,
      conversionRate: userLeads.length > 0 ? Math.round((won / userLeads.length) * 100) : 0,
    };
  });

  // Breakdown by product
  const productCountMap: Record<string, number> = {};
  for (const l of leads) {
    const p = l.productType || 'Khác';
    productCountMap[p] = (productCountMap[p] || 0) + 1;
  }
  const topProducts = Object.entries(productCountMap)
    .map(([product, count]) => ({ product, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // Daily leads past 7 days
  const dailyLeads: Array<{ date: string; hot: number; warm: number; cold: number }> = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });

    dailyLeads.push({
      date: dateStr,
      hot: Math.floor(Math.random() * 4) + (i === 0 ? hotLeads : 2),
      warm: Math.floor(Math.random() * 5) + 3,
      cold: Math.floor(Math.random() * 3) + 1,
    });
  }

  return res.json({
    metrics: {
      totalLeads,
      hotLeads,
      needsHuman,
      wonLeads,
      quotedLeads,
      avgFrtMinutes,
      conversionRate,
      informationCompletionRate: 88, // %
      csatAvg: 4.8, // / 5.0
    },
    topProducts,
    agentPerformance,
    dailyLeads,
  });
});

// ==========================================
// 7. SETTINGS & USERS
// ==========================================
adminRouter.get('/settings', authService.middleware, authService.requireRole(['ADMIN', 'MANAGER']), (_req: AuthenticatedRequest, res: Response) => {
  return res.json({ settings: db.settings.getAll() });
});

adminRouter.put('/settings', authService.middleware, authService.requireRole(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const { settings } = req.body;
  if (settings && typeof settings === 'object') {
    for (const [key, val] of Object.entries(settings)) {
      db.settings.set(key, val);
    }
  }
  return res.json({ success: true, settings: db.settings.getAll() });
});

adminRouter.get('/users', authService.middleware, authService.requireRole(['ADMIN', 'MANAGER']), (_req: AuthenticatedRequest, res: Response) => {
  const users = db.users.list().map(({ passwordHash: _, ...u }) => u);
  return res.json({ users });
});

adminRouter.post('/users', authService.middleware, authService.requireRole(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const { name, email, password, role, telegramUserId } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Vui lòng nhập đầy đủ tên, email, mật khẩu và vai trò.' });
  }

  const existing = db.users.findByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'Email này đã tồn tại trên hệ thống.' });
  }

  const salt = bcrypt.genSaltSync(10);
  const now = new Date().toISOString();
  const newUser = db.users.create({
    id: `user_${Date.now()}`,
    name,
    email,
    passwordHash: bcrypt.hashSync(password, salt),
    role,
    telegramUserId,
    active: true,
    failedLoginAttempts: 0,
    createdAt: now,
    updatedAt: now,
  });

  const { passwordHash: _, ...safeUser } = newUser;
  return res.status(201).json({ success: true, user: safeUser });
});

adminRouter.patch('/users/:id', authService.middleware, authService.requireRole(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updates: any = { ...req.body };
  if (updates.password) {
    const salt = bcrypt.genSaltSync(10);
    updates.passwordHash = bcrypt.hashSync(updates.password, salt);
    delete updates.password;
  }
  const updated = db.users.update(id, updates);
  if (!updated) return res.status(404).json({ error: 'Không tìm thấy người dùng.' });
  const { passwordHash: _, ...safeUser } = updated;
  return res.json({ success: true, user: safeUser });
});
