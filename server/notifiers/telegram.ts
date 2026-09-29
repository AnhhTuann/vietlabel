import { Notifier, LeadRecord } from './types';

export class TelegramNotifier implements Notifier {
  name = 'Telegram';

  private botToken = process.env.TELEGRAM_BOT_TOKEN;
  private chatId = process.env.TELEGRAM_CHAT_ID;
  private appBaseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';

  isEnabled(): boolean {
    return Boolean(this.botToken && this.chatId) || process.env.NODE_ENV !== 'production';
  }

  private formatMessage(lead: LeadRecord): string {
    const timeStr = new Date(lead.createdAt).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
    });

    const isHot = lead.leadScore === 'HOT';
    const isNeedsHuman = lead.status === 'NEEDS_HUMAN';
    const icon = isNeedsHuman ? '🚨 YÊU CẦU GẶP NHÂN VIÊN' : isHot ? '🔥 LEAD HOT' : '⚡ LEAD MỚI';

    const customerName = lead.fullName || 'Khách hàng web';
    const company = lead.company ? `(${lead.company})` : '';
    const phone = lead.contact || 'Chưa cung cấp';
    const qty = lead.quantity ? `${lead.quantity}` : 'Thỏa thuận';
    const deadline = lead.deadline || 'Theo tiến độ xưởng';
    const hasDesign = lead.hasDesignFile ? 'Có sẵn' : (lead.attachments?.length ? `${lead.attachments.length} file đính kèm` : 'Chưa có file');

    let nextAction = 'Liên hệ tư vấn sơ bộ và gửi bảng báo giá qua Zalo/SĐT';
    if (isNeedsHuman) {
      nextAction = 'Khách đang chờ trên web! Bấm [Nhận xử lý] để gọi điện hoặc nhắn Zalo ngay.';
    } else if (isHot) {
      nextAction = 'Khách có nhu cầu lớn / tiến độ gấp! Ưu tiên liên hệ trong 15 phút.';
    }

    return `${icon} #${lead.id} – ${timeStr}

👤 *Khách hàng:* ${customerName} ${company}
📞 *Liên hệ:* \`${phone}\`${lead.email ? ` | ${lead.email}` : ''}
📦 *Nhu cầu:* ${lead.productType} (SL: ${qty})
📐 *Quy cách:* ${lead.dimensions || 'Tiêu chuẩn'} | ${lead.material || 'Theo tư vấn'}
⏳ *Deadline:* ${deadline} | 📎 *File:* ${hasDesign}
${lead.innerProductOrSurface ? `🏷️ *Môi trường/Bề mặt:* ${lead.innerProductOrSurface}\n` : ''}${lead.notes ? `📝 *Ghi chú:* ${lead.notes}\n` : ''}
🎯 *Việc cần làm:* ${nextAction}
🌐 *Nguồn:* ${lead.source || 'Web AI Chat'}
🔗 *Admin:* ${this.appBaseUrl}/admin/leads/${lead.id}`;
  }

  async send(lead: LeadRecord): Promise<{ success: boolean; error?: string; messageId?: number }> {
    const text = this.formatMessage(lead);
    const adminUrl = `${this.appBaseUrl}/admin/leads/${lead.id}`;

    // If bot token is configured, call Telegram Bot API with retry
    if (this.botToken && this.chatId) {
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const res = await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: this.chatId,
              text,
              parse_mode: 'Markdown',
              reply_markup: {
                inline_keyboard: [
                  [
                    { text: '🔥 Nhận xử lý ngay', callback_data: `claim:${lead.id}` },
                    { text: '📋 Xem chi tiết', url: adminUrl },
                  ],
                ],
              },
            }),
          });

          const data: any = await res.json();
          if (data.ok) {
            console.log(`[TELEGRAM NOTIFIER] Sent lead #${lead.id} to Telegram group (Msg ID: ${data.result?.message_id})`);
            return { success: true, messageId: data.result?.message_id };
          } else {
            console.warn(`[TELEGRAM NOTIFIER] Attempt ${attempt} failed:`, data.description);
          }
        } catch (err: any) {
          console.warn(`[TELEGRAM NOTIFIER] Attempt ${attempt} network error:`, err.message);
        }
        await new Promise(r => setTimeout(r, attempt * 1000));
      }
      return { success: false, error: 'Telegram API send failed after 3 attempts' };
    }

    // In-memory simulation when token is not yet in .env
    const simulatedMessageId = Math.floor(100000 + Math.random() * 900000);
    console.log(`\n================== [TELEGRAM BOT SIMULATION] ==================`);
    console.log(text);
    console.log(`[ACTION BUTTONS]: [🔥 Nhận xử lý ngay] | [📋 Xem chi tiết: ${adminUrl}]`);
    console.log(`================================================================\n`);
    return { success: true, messageId: simulatedMessageId };
  }

  async updateClaimed(lead: LeadRecord, claimedBy: string): Promise<boolean> {
    const claimTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const updatedText = `✅ *ĐÃ NHẬN XỬ LÝ BỞI: ${claimedBy}* (Lúc ${claimTime})

` + this.formatMessage(lead);

    if (this.botToken && this.chatId && lead.telegramMessageId) {
      try {
        const adminUrl = `${this.appBaseUrl}/admin/leads/${lead.id}`;
        await fetch(`https://api.telegram.org/bot${this.botToken}/editMessageText`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: this.chatId,
            message_id: lead.telegramMessageId,
            text: updatedText,
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [
                  { text: `✅ Đã nhận bởi: ${claimedBy}`, callback_data: `claimed_info:${lead.id}` },
                  { text: '📋 Xem hồ sơ', url: adminUrl },
                ],
              ],
            },
          }),
        });
        return true;
      } catch (err: any) {
        console.warn('[TELEGRAM NOTIFIER] Could not edit message:', err.message);
      }
    }

    console.log(`[TELEGRAM NOTIFIER] Lead #${lead.id} claimed by ${claimedBy}`);
    return true;
  }

  async sendReminder(lead: LeadRecord): Promise<boolean> {
    const reminderText = `⚠️ *[NHẮC LẦN 2 - CHƯA CÓ NGƯỜI NHẬN]*
Lead #${lead.id} (${lead.fullName || 'Khách hàng'} - ${lead.productType}) đã chờ hơn 10 phút chưa có nhân viên nhận xử lý!
📞 SĐT: \`${lead.contact}\`
Vui lòng bấm [Nhận xử lý] để hỗ trợ khách kịp thời.`;

    if (this.botToken && this.chatId) {
      try {
        await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: this.chatId,
            text: reminderText,
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [
                  { text: '🔥 Nhận xử lý ngay', callback_data: `claim:${lead.id}` },
                  { text: '📋 Xem chi tiết', url: `${this.appBaseUrl}/admin/leads/${lead.id}` },
                ],
              ],
            },
          }),
        });
        return true;
      } catch (err) {
        // ignore
      }
    }

    console.log(`[TELEGRAM REMINDER SIMULATION] Lead #${lead.id} is still unassigned after escalation window.`);
    return true;
  }
}
