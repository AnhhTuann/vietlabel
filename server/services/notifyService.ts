import { db } from '../db/store';
import { Lead } from '../db/schema';
import { telegramNotifier, zaloNotifier, emailNotifier } from '../notifiers';
import { realtimeHub } from './realtimeService';

export const notifyService = {
  async notifyStaff(lead: Lead, reason: string): Promise<void> {
    console.log(`[NOTIFY SERVICE] Notifying staff for Lead ${lead.code} (${lead.id}). Reason: ${reason}`);

    // Map DB lead to notifier format
    const notifierLead: any = {
      id: lead.id,
      code: lead.code,
      fullName: lead.customerName,
      company: lead.company,
      contact: lead.phone || lead.email || 'Web',
      email: lead.email,
      productType: lead.productType,
      quantity: lead.quantity,
      dimensions: lead.brief?.dimensions,
      material: lead.brief?.material,
      deadline: lead.deadline,
      hasDesignFile: lead.hasDesignFile,
      innerProductOrSurface: lead.brief?.innerProductOrSurface,
      notes: lead.brief?.notes,
      leadScore: lead.score,
      status: lead.status,
      source: lead.source,
      createdAt: lead.createdAt,
    };

    // 1. Telegram
    try {
      const tgRes = await telegramNotifier.send(notifierLead);
      if (tgRes.messageId) {
        db.leads.update(lead.id, { telegramMessageId: tgRes.messageId });
      }
      db.notificationLogs.create({
        id: `notif_tg_${Date.now()}`,
        leadId: lead.id,
        channel: 'telegram',
        status: tgRes.success ? 'SENT' : 'FAILED',
        error: tgRes.error,
        sentAt: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error('[NOTIFY ERROR] Telegram send failed:', err.message);
      db.notificationLogs.create({
        id: `notif_tg_${Date.now()}`,
        leadId: lead.id,
        channel: 'telegram',
        status: 'FAILED',
        error: err.message,
        sentAt: new Date().toISOString(),
      });
    }

    // 2. Zalo OA (if enabled)
    try {
      const isZaloEnabled = db.settings.get('zalo_enabled') === true || process.env.ZALO_ENABLED === 'true';
      if (isZaloEnabled) {
        const zaloRes = await zaloNotifier.send(notifierLead);
        db.notificationLogs.create({
          id: `notif_zl_${Date.now()}`,
          leadId: lead.id,
          channel: 'zalo',
          status: zaloRes.success ? 'SENT' : 'SKIPPED',
          error: zaloRes.error,
          sentAt: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      console.warn('[NOTIFY ERROR] Zalo send failed:', err.message);
    }

    // 3. Email
    try {
      await emailNotifier.send(notifierLead);
      db.notificationLogs.create({
        id: `notif_em_${Date.now()}`,
        leadId: lead.id,
        channel: 'email',
        status: 'SENT',
        sentAt: new Date().toISOString(),
      });
    } catch (err: any) {
      console.warn('[NOTIFY ERROR] Email send failed:', err.message);
    }

    // 4. Realtime broadcast to admin webapp
    realtimeHub.broadcast('notification:new', {
      type: 'LEAD_ALERT',
      leadId: lead.id,
      code: lead.code,
      customerName: lead.customerName,
      productType: lead.productType,
      score: lead.score,
      status: lead.status,
      timestamp: new Date().toISOString(),
    });

    // 5. Escalation timer: check after ESCALATION_MINUTES
    const escalationMinutes = Number(db.settings.get('escalation_minutes') || 10);
    setTimeout(async () => {
      const current = db.leads.findById(lead.id);
      if (current && (current.status === 'NEEDS_HUMAN' || current.status === 'NEW')) {
        console.warn(`[ESCALATION REMINDER] Lead ${current.code} unclaimed after ${escalationMinutes} min!`);
        await telegramNotifier.sendReminder({
          ...notifierLead,
          id: current.id,
          telegramMessageId: current.telegramMessageId,
        });
        realtimeHub.broadcast('lead:escalation', {
          leadId: current.id,
          code: current.code,
          customerName: current.customerName,
          minutesUnattended: escalationMinutes,
        });
      }
    }, escalationMinutes * 60 * 1000);
  },

  async updateTelegramClaimed(lead: Lead, staffName: string): Promise<void> {
    try {
      const notifierLead: any = {
        id: lead.id,
        code: lead.code,
        fullName: lead.customerName,
        contact: lead.phone || lead.email,
        productType: lead.productType,
        quantity: lead.quantity,
        leadScore: lead.score,
        status: lead.status,
        telegramMessageId: lead.telegramMessageId,
        createdAt: lead.createdAt,
      };
      await telegramNotifier.updateClaimed(notifierLead, staffName);
    } catch (err: any) {
      console.warn('[NOTIFY SERVICE] Failed to edit Telegram message:', err.message);
    }
  },
};
