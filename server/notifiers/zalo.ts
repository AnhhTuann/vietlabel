import { Notifier, LeadRecord } from './types';

export class ZaloNotifier implements Notifier {
  name = 'Zalo OA';

  private isEnabledFlag = process.env.ZALO_ENABLED === 'true';
  private accessToken = process.env.ZALO_OA_ACCESS_TOKEN;
  private staffUserIds = (process.env.ZALO_STAFF_USER_IDS || '').split(',').map(s => s.trim()).filter(Boolean);
  private appBaseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';

  isEnabled(): boolean {
    return this.isEnabledFlag && Boolean(this.accessToken && this.staffUserIds.length > 0);
  }

  async send(lead: LeadRecord): Promise<{ success: boolean; error?: string }> {
    if (!this.isEnabled()) {
      return { success: false, error: 'Zalo notifier is disabled or not configured' };
    }

    const messageText = `[VIETLABEL SALES ALERT] Lead mới #${lead.id}
Khách: ${lead.fullName || 'Khách web'} (${lead.contact})
Yêu cầu: ${lead.productType} (SL: ${lead.quantity || 'Thỏa thuận'})
Chi tiết: ${this.appBaseUrl}/admin/leads/${lead.id}`;

    let sentCount = 0;

    for (const userId of this.staffUserIds) {
      try {
        const res = await fetch('https://openapi.zalo.me/v3.0/oa/message/cs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            access_token: this.accessToken!,
          },
          body: JSON.stringify({
            recipient: { user_id: userId },
            message: { text: messageText },
          }),
        });

        const data: any = await res.json();
        if (data.error === 0) {
          sentCount++;
        } else {
          console.warn(`[ZALO NOTIFIER] Failed to send to staff ${userId}: ${data.message} (error code ${data.error})`);
        }
      } catch (err: any) {
        console.warn(`[ZALO NOTIFIER] Network error sending to ${userId}:`, err.message);
      }
    }

    return {
      success: sentCount > 0,
      error: sentCount === 0 ? 'Failed to deliver to Zalo staff' : undefined,
    };
  }
}
