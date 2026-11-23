/**
 * Optional transactional email via Resend HTTP API.
 * Email is deliberately disabled until a verified sender and API key are configured.
 * The core contact/CRM workflow still persists leads in PostgreSQL without email.
 */
export const sendEmail = async (to: string | string[], subject: string, html: string): Promise<boolean> => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    console.info('[EMAIL] Not configured; message was not sent. Lead data remains saved in CRM.');
    return false;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to: Array.isArray(to) ? to : [to], subject, html }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Email provider rejected the message (${response.status}): ${detail.slice(0, 300)}`);
  }

  return true;
};
