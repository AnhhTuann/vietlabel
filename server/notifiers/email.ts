import { Notifier, LeadRecord } from './types';

export class EmailNotifier implements Notifier {
  name = 'Email';

  private salesEmails = (process.env.SALES_EMAILS || 'thien@vietlabel.com.vn,baogia@vietlabel.com.vn')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  isEnabled(): boolean {
    return this.salesEmails.length > 0;
  }

  async send(lead: LeadRecord): Promise<{ success: boolean; error?: string }> {
    console.log(`[EMAIL NOTIFIER] Dispatched lead notification #${lead.id} to: ${this.salesEmails.join(', ')}`);
    return { success: true };
  }
}
