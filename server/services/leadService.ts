import { db } from '../db/store';
import { Lead, LeadStatus, LeadScore, LeadEvent, Note } from '../db/schema';
import { computeLeadScore } from '../lib/scoring';
import { notifyService } from './notifyService';
import { realtimeHub } from './realtimeService';

export interface CreateOrUpdateChatLeadInput {
  sessionId: string;
  source?: 'web' | 'zalo' | 'messenger';
  fullName?: string;
  company?: string;
  contact?: string; // Phone / Email
  email?: string;
  productType?: string;
  quantity?: string | number;
  deadline?: string;
  hasDesignFile?: boolean | string;
  brief?: Record<string, any>;
  missingFields?: string[];
  needHuman?: boolean;
  notes?: string;
}

export const leadService = {
  async createOrUpdateFromChat(input: CreateOrUpdateChatLeadInput): Promise<{ lead: Lead; isNew: boolean }> {
    // 1. Find existing conversation by sessionId
    const existingConv = db.conversations.findBySessionId(input.sessionId);
    let lead: Lead | null = null;
    let isNew = false;

    if (existingConv) {
      lead = db.leads.findById(existingConv.leadId) || null;
    }

    // Extract phone/contact
    let phone = lead?.phone;
    let email = lead?.email || input.email;
    if (input.contact) {
      if (input.contact.includes('@')) {
        email = input.contact;
      } else {
        phone = input.contact;
      }
    }

    const mergedBrief: Record<string, any> = {
      ...(lead?.brief || {}),
      ...(input.brief || {}),
      productType: input.productType || lead?.productType || input.brief?.productType,
      quantity: input.quantity || lead?.quantity || input.brief?.quantity,
      deadline: input.deadline || lead?.deadline || input.brief?.deadline,
      notes: input.notes || lead?.brief?.notes,
    };

    // Calculate deterministic lead score by code
    const scoreResult = computeLeadScore({
      fullName: input.fullName || lead?.customerName,
      contact: phone || email,
      email,
      productType: mergedBrief.productType,
      quantity: mergedBrief.quantity,
      dimensions: mergedBrief.dimensions,
      material: mergedBrief.material,
      deadline: mergedBrief.deadline,
      hasDesignFile: input.hasDesignFile ?? lead?.hasDesignFile,
      needHuman: input.needHuman,
    });

    const now = new Date().toISOString();

    if (!lead) {
      // Create new Lead
      isNew = true;
      const leadId = `LEAD-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const code = db.leads.getNextCode();

      const initialStatus: LeadStatus = (scoreResult.isHot || input.needHuman) ? 'NEEDS_HUMAN' : 'NEW';

      lead = {
        id: leadId,
        code,
        status: initialStatus,
        score: scoreResult.score,
        source: input.source || 'web',
        customerName: input.fullName || 'Khách hàng web',
        company: input.company,
        phone,
        email,
        productType: mergedBrief.productType || 'Chưa phân loại',
        quantity: mergedBrief.quantity,
        deadline: mergedBrief.deadline,
        hasDesignFile: input.hasDesignFile,
        brief: mergedBrief,
        missingFields: input.missingFields || [],
        createdAt: now,
        updatedAt: now,
      };

      db.leads.create(lead);

      // Create conversation
      const convId = `conv_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
      db.conversations.create({
        id: convId,
        leadId: lead.id,
        sessionId: input.sessionId,
        channel: input.source || 'web',
        mode: 'BOT',
        lastMessageAt: now,
        createdAt: now,
      });

      // Log event
      db.events.create({
        id: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        leadId: lead.id,
        type: 'CREATED',
        payload: { score: lead.score, source: lead.source, status: lead.status },
        createdAt: now,
      });

      realtimeHub.broadcast('lead:new', lead);
    } else {
      // Update existing lead
      const statusUpdates: Partial<Lead> = {
        customerName: input.fullName || lead.customerName,
        company: input.company || lead.company,
        phone: phone || lead.phone,
        email: email || lead.email,
        productType: mergedBrief.productType || lead.productType,
        quantity: mergedBrief.quantity || lead.quantity,
        deadline: mergedBrief.deadline || lead.deadline,
        hasDesignFile: input.hasDesignFile ?? lead.hasDesignFile,
        brief: mergedBrief,
        missingFields: input.missingFields || lead.missingFields,
        score: scoreResult.score,
        updatedAt: now,
      };

      if (input.needHuman && lead.status !== 'CLAIMED' && lead.status !== 'CONTACTED') {
        statusUpdates.status = 'NEEDS_HUMAN';
      }

      lead = db.leads.update(lead.id, statusUpdates) || lead;

      realtimeHub.broadcast('lead:updated', lead);
    }

    // Trigger notification if lead is HOT or needs human or brief completed
    if (scoreResult.isHot || input.needHuman || (phone && mergedBrief.productType && mergedBrief.quantity)) {
      await notifyService.notifyStaff(lead, input.needHuman ? 'Khách yêu cầu gặp nhân viên' : 'Lead HOT / Brief hoàn tất');
    }

    return { lead, isNew };
  },

  async claim(leadId: string, userId: string, staffName: string): Promise<Lead> {
    const lead = db.leads.findById(leadId);
    if (!lead) {
      throw new Error('Không tìm thấy hồ sơ lead.');
    }

    // Atomic conflict check: only first staff wins!
    if (lead.status === 'CLAIMED' && lead.assignedToId && lead.assignedToId !== userId) {
      const err: any = new Error(`Lead này đã được nhận xử lý bởi ${lead.claimedBy || 'nhân viên khác'} lúc ${lead.claimedAt}.`);
      err.status = 409;
      err.claimedBy = lead.claimedBy;
      err.claimedAt = lead.claimedAt;
      throw err;
    }

    const now = new Date().toISOString();
    const updated = db.leads.update(lead.id, {
      status: 'CLAIMED',
      assignedToId: userId,
      claimedBy: staffName,
      claimedAt: now,
    });

    if (!updated) {
      throw new Error('Cập nhật trạng thái lead thất bại.');
    }

    // Log event
    db.events.create({
      id: `ev_${Date.now()}_claim`,
      leadId: lead.id,
      type: 'CLAIMED',
      actorId: userId,
      actorName: staffName,
      payload: { claimedAt: now },
      createdAt: now,
    });

    // Update Telegram message inline button
    await notifyService.updateTelegramClaimed(updated, staffName);

    // Broadcast realtime event
    realtimeHub.broadcast('lead:updated', updated);

    return updated;
  },

  async changeStatus(leadId: string, newStatus: LeadStatus, actorId?: string, actorName?: string, reason?: string): Promise<Lead> {
    const lead = db.leads.findById(leadId);
    if (!lead) {
      throw new Error('Không tìm thấy hồ sơ lead.');
    }

    const oldStatus = lead.status;
    const now = new Date().toISOString();

    const updates: Partial<Lead> = {
      status: newStatus,
      updatedAt: now,
    };

    if (newStatus === 'CONTACTED' && !lead.firstResponseAt) {
      updates.firstResponseAt = now;
    }

    const updated = db.leads.update(leadId, updates);
    if (!updated) {
      throw new Error('Cập nhật trạng thái thất bại.');
    }

    db.events.create({
      id: `ev_${Date.now()}_status`,
      leadId,
      type: 'STATUS_CHANGED',
      actorId,
      actorName,
      payload: { from: oldStatus, to: newStatus, reason },
      createdAt: now,
    });

    realtimeHub.broadcast('lead:updated', updated);

    return updated;
  },

  async assign(leadId: string, targetUserId: string, actorId?: string, actorName?: string): Promise<Lead> {
    const lead = db.leads.findById(leadId);
    if (!lead) throw new Error('Không tìm thấy lead.');
    const user = db.users.findById(targetUserId);
    if (!user) throw new Error('Nhân viên không tồn tại.');

    const now = new Date().toISOString();
    const updated = db.leads.update(leadId, {
      assignedToId: user.id,
      claimedBy: user.name,
      claimedAt: lead.claimedAt || now,
      status: lead.status === 'NEW' || lead.status === 'NEEDS_HUMAN' ? 'CLAIMED' : lead.status,
    });

    if (!updated) throw new Error('Gán phụ trách thất bại.');

    db.events.create({
      id: `ev_${Date.now()}_assign`,
      leadId,
      type: 'ASSIGNED',
      actorId,
      actorName,
      payload: { assignedToId: user.id, assignedToName: user.name },
      createdAt: now,
    });

    realtimeHub.broadcast('lead:updated', updated);
    return updated;
  },

  async addNote(leadId: string, authorId: string, authorName: string, text: string): Promise<Note> {
    const lead = db.leads.findById(leadId);
    if (!lead) throw new Error('Không tìm thấy lead.');

    const note = db.notes.create({
      id: `note_${Date.now()}`,
      leadId,
      authorId,
      authorName,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    });

    db.events.create({
      id: `ev_${Date.now()}_note`,
      leadId,
      type: 'NOTE_ADDED',
      actorId: authorId,
      actorName: authorName,
      payload: { noteId: note.id },
      createdAt: new Date().toISOString(),
    });

    return note;
  },

  getLeads(filter?: {
    status?: string;
    score?: string;
    source?: string;
    assignedToId?: string;
    q?: string;
    limit?: number;
    offset?: number;
  }) {
    let list = db.leads.list();

    if (filter?.status && filter.status !== 'ALL') {
      list = list.filter(l => l.status === filter.status);
    }
    if (filter?.score && filter.score !== 'ALL') {
      list = list.filter(l => l.score === filter.score);
    }
    if (filter?.source && filter.source !== 'ALL') {
      list = list.filter(l => l.source === filter.source);
    }
    if (filter?.assignedToId) {
      list = list.filter(l => l.assignedToId === filter.assignedToId);
    }
    if (filter?.q) {
      const q = filter.q.toLowerCase();
      list = list.filter(l =>
        l.code.toLowerCase().includes(q) ||
        (l.customerName && l.customerName.toLowerCase().includes(q)) ||
        (l.phone && l.phone.toLowerCase().includes(q)) ||
        (l.email && l.email.toLowerCase().includes(q)) ||
        (l.company && l.company.toLowerCase().includes(q)) ||
        (l.productType && l.productType.toLowerCase().includes(q))
      );
    }

    const total = list.length;
    const offset = filter?.offset || 0;
    const limit = filter?.limit || 100;
    const paged = list.slice(offset, offset + limit);

    const allLeads = db.leads.list();
    const stats = {
      total: allLeads.length,
      hot: allLeads.filter(l => l.score === 'HOT').length,
      warm: allLeads.filter(l => l.score === 'WARM').length,
      cold: allLeads.filter(l => l.score === 'COLD').length,
      new: allLeads.filter(l => l.status === 'NEW').length,
      needsHuman: allLeads.filter(l => l.status === 'NEEDS_HUMAN').length,
      claimed: allLeads.filter(l => l.status === 'CLAIMED').length,
      contacted: allLeads.filter(l => l.status === 'CONTACTED').length,
      quoted: allLeads.filter(l => l.status === 'QUOTED').length,
      won: allLeads.filter(l => l.status === 'WON').length,
      lost: allLeads.filter(l => l.status === 'LOST').length,
    };

    return { total, leads: paged, stats };
  },

  getLeadById(leadId: string, currentUserId?: string, currentUserName?: string) {
    const lead = db.leads.findById(leadId);
    if (!lead) return null;

    const conversation = db.conversations.findByLeadId(leadId);
    const messages = conversation ? db.messages.listByConversationId(conversation.id) : [];
    const notes = db.notes.listByLeadId(leadId);
    const events = db.events.listByLeadId(leadId);
    const notificationLogs = db.notificationLogs.listByLeadId(leadId);

    // Audit log: viewing full phone number
    if (currentUserId) {
      db.events.create({
        id: `ev_${Date.now()}_viewphone`,
        leadId,
        type: 'PHONE_VIEWED',
        actorId: currentUserId,
        actorName: currentUserName,
        createdAt: new Date().toISOString(),
      });
    }

    return {
      lead,
      conversation,
      messages,
      notes,
      events,
      notificationLogs,
    };
  },

  exportCsv(): string {
    const leads = db.leads.list();
    const headers = [
      'Mã hồ sơ',
      'Khách hàng',
      'Công ty',
      'Số điện thoại',
      'Email',
      'Loại sản phẩm',
      'Số lượng',
      'Tiến độ',
      'Điểm xếp hạng',
      'Trạng thái',
      'Người phụ trách',
      'Thời gian tạo',
    ];

    const rows = leads.map(l => [
      l.code,
      `"${(l.customerName || '').replace(/"/g, '""')}"`,
      `"${(l.company || '').replace(/"/g, '""')}"`,
      `"${l.phone || ''}"`,
      `"${l.email || ''}"`,
      `"${(l.productType || '').replace(/"/g, '""')}"`,
      `"${(l.quantity || '').toString().replace(/"/g, '""')}"`,
      `"${(l.deadline || '').replace(/"/g, '""')}"`,
      l.score,
      l.status,
      `"${(l.claimedBy || '').replace(/"/g, '""')}"`,
      new Date(l.createdAt).toLocaleString('vi-VN'),
    ]);

    // UTF-8 BOM + CSV content
    return '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  },
};
