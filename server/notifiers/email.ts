import { Notifier, LeadRecord } from './types.js';
import { sendEmail } from '../services/emailService.js';

const escapeHtml = (value: unknown): string =>
  String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]!);

export class EmailNotifier implements Notifier {
  name = 'Email';

  private salesEmails = (process.env.SALES_EMAILS || 'thien@vietlabel.com.vn,baogia@vietlabel.com.vn')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  isEnabled(): boolean {
    return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM && this.salesEmails.length > 0);
  }

  async send(lead: LeadRecord): Promise<{ success: boolean; error?: string }> {
    const html = [
      '<h2>Vietlabel — Yêu cầu tư vấn mới</h2>',
      `<p><strong>Mã hồ sơ:</strong> ${escapeHtml(lead.id)}</p>`,
      `<p><strong>Khách hàng:</strong> ${escapeHtml(lead.fullName)}</p>`,
      `<p><strong>Liên hệ:</strong> ${escapeHtml(lead.contact)}</p>`,
      `<p><strong>Sản phẩm:</strong> ${escapeHtml(lead.productType)}</p>`,
      `<p><strong>Số lượng:</strong> ${escapeHtml(lead.quantity)}</p>`,
      `<p><strong>Trạng thái:</strong> ${escapeHtml(lead.status)} / ${escapeHtml(lead.leadScore)}</p>`,
      `<p><strong>Ghi chú:</strong> ${escapeHtml(lead.notes)}</p>`,
    ].join('');

    const success = await sendEmail(
      this.salesEmails,
      `Vietlabel: yêu cầu mới ${lead.id}`,
      html,
    );
    return { success };
  }
}
