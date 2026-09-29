import { LeadRecord, Notifier } from './types';
import { TelegramNotifier } from './telegram';
import { ZaloNotifier } from './zalo';
import { EmailNotifier } from './email';

export const telegramNotifier = new TelegramNotifier();
export const zaloNotifier = new ZaloNotifier();
export const emailNotifier = new EmailNotifier();

const notifiers: Notifier[] = [
  telegramNotifier,
  zaloNotifier,
  emailNotifier,
];

// Escalation window in minutes (default 10)
const ESCALATION_MINUTES = parseInt(process.env.ESCALATION_MINUTES || '10', 10);

export function isWithinWorkingHours(): boolean {
  // Working hours: 08:00 to 17:30 (Monday to Saturday)
  const now = new Date();
  // Vietnam timezone UTC+7
  const utcHours = now.getUTCHours();
  const vnHours = (utcHours + 7) % 24;
  const vnMinutes = now.getUTCMinutes();
  const vnDay = now.getUTCDay(); // 0 is Sunday

  // Closed on Sunday
  if (vnDay === 0) return false;

  const currentMinutesFromMidnight = vnHours * 60 + vnMinutes;
  const startMinutes = 8 * 60; // 08:00
  const endMinutes = 17 * 60 + 30; // 17:30

  return currentMinutesFromMidnight >= startMinutes && currentMinutesFromMidnight <= endMinutes;
}

export async function notifyStaff(
  lead: LeadRecord,
  getLatestLeadState?: (id: string) => LeadRecord | undefined
): Promise<void> {
  const isWorking = isWithinWorkingHours();
  console.log(`[STAFF NOTIFICATION] Triggering alert for Lead #${lead.id} (Score: ${lead.leadScore}, Status: ${lead.status}, InWorkingHours: ${isWorking})`);

  // Run all enabled notifiers in parallel with error isolation
  const results = await Promise.allSettled(
    notifiers
      .filter(n => n.isEnabled())
      .map(async (notifier) => {
        try {
          const res = await notifier.send(lead);
          if (notifier.name === 'Telegram' && res.messageId) {
            lead.telegramMessageId = res.messageId;
          }
          return { name: notifier.name, ...res };
        } catch (err: any) {
          console.error(`[NOTIFIER ERROR] ${notifier.name}:`, err.message);
          return { name: notifier.name, success: false, error: err.message };
        }
      })
  );

  for (const r of results) {
    if (r.status === 'fulfilled') {
      console.log(`[NOTIFIER DISPATCHED] Channel: ${r.value.name} -> Success: ${r.value.success}`);
    }
  }

  // Set escalation timer for HOT or NEEDS_HUMAN leads
  if ((lead.leadScore === 'HOT' || lead.status === 'NEEDS_HUMAN') && isWorking) {
    const delayMs = ESCALATION_MINUTES * 60 * 1000;
    setTimeout(async () => {
      const currentLead = getLatestLeadState ? getLatestLeadState(lead.id) : lead;
      if (currentLead && currentLead.status !== 'CLAIMED' && currentLead.status !== 'CONTACTED') {
        console.warn(`[ESCALATION TRIGGERED] Lead #${lead.id} remains unclaimed after ${ESCALATION_MINUTES} minutes. Sending Telegram reminder...`);
        await telegramNotifier.sendReminder(currentLead);
      }
    }, delayMs);
  }
}
