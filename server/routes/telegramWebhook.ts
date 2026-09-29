import { Router, Request, Response } from 'express';
import { leadsDatabase, getLeadById } from './lead';
import { telegramNotifier } from '../notifiers';

export const telegramWebhookRouter = Router();

telegramWebhookRouter.post('/', async (req: Request, res: Response) => {
  const update = req.body;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (update?.callback_query) {
    const callbackQuery = update.callback_query;
    const data = callbackQuery.data || '';
    const from = callbackQuery.from;
    const staffName = from.username ? `@${from.username}` : (from.first_name || 'Nhân viên kinh doanh');

    if (data.startsWith('claim:')) {
      const leadId = data.replace('claim:', '');
      const lead = getLeadById(leadId);

      if (lead) {
        if (lead.status === 'CLAIMED' && lead.claimedBy) {
          // Already claimed
          if (botToken) {
            await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                callback_query_id: callbackQuery.id,
                text: `⚠️ Lead #${leadId} đã được nhận bởi ${lead.claimedBy} trước đó!`,
                show_alert: true,
              }),
            }).catch(() => {});
          }
          return res.json({ ok: true });
        }

        // Mark claimed
        lead.status = 'CLAIMED';
        lead.claimedBy = staffName;
        lead.claimedAt = new Date().toISOString();

        // Answer callback query popup
        if (botToken) {
          await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              callback_query_id: callbackQuery.id,
              text: `✅ Bạn (${staffName}) đã nhận xử lý lead #${leadId}! Vui lòng gọi khách sớm nhất.`,
              show_alert: false,
            }),
          }).catch(() => {});
        }

        // Edit Telegram message to update status
        await telegramNotifier.updateClaimed(lead, staffName);
        console.log(`[TELEGRAM CALLBACK] Lead #${lead.id} claimed via Telegram button by ${staffName}`);
      }
    } else if (data.startsWith('claimed_info:')) {
      const leadId = data.replace('claimed_info:', '');
      const lead = getLeadById(leadId);
      if (botToken) {
        await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            callback_query_id: callbackQuery.id,
            text: `Lead #${leadId} đã được ${lead?.claimedBy || 'nhân viên'} nhận xử lý.`,
            show_alert: true,
          }),
        }).catch(() => {});
      }
    }
  }

  return res.json({ ok: true });
});
