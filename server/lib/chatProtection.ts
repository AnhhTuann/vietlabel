type Limit = {
  scope: 'ip' | 'session';
  count: number;
  windowMs: number;
};

const LIMITS: Limit[] = [
  { scope: 'ip', count: 12, windowMs: 60_000 },
  { scope: 'ip', count: 50, windowMs: 60 * 60_000 },
  { scope: 'ip', count: 100, windowMs: 24 * 60 * 60_000 },
  { scope: 'session', count: 6, windowMs: 60_000 },
  { scope: 'session', count: 25, windowMs: 60 * 60_000 },
  { scope: 'session', count: 30, windowMs: 24 * 60 * 60_000 },
];

export type ChatLimitResult = { allowed: true } | { allowed: false; retryAfterSeconds: number };

export class ChatRateLimiter {
  private readonly requests = new Map<string, number[]>();
  private checks = 0;

  consume(ip: string, sessionId: string, now = Date.now()): ChatLimitResult {
    const checks = LIMITS.map((limit) => {
      const key = `${limit.scope}:${limit.scope === 'ip' ? ip : `${ip}:${sessionId}`}:${limit.windowMs}`;
      const cutoff = now - limit.windowMs;
      const recent = (this.requests.get(key) || []).filter((timestamp) => timestamp > cutoff);
      return { key, recent, limit };
    });

    const rejected = checks.find(({ recent, limit }) => recent.length >= limit.count);
    if (rejected) {
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil((rejected.recent[0] + rejected.limit.windowMs - now) / 1000)),
      };
    }

    for (const { key, recent } of checks) {
      recent.push(now);
      this.requests.set(key, recent);
    }

    this.checks += 1;
    if (this.checks % 100 === 0) this.removeExpired(now);
    return { allowed: true };
  }

  private removeExpired(now: number): void {
    for (const [key, timestamps] of this.requests) {
      const windowMs = Number(key.slice(key.lastIndexOf(':') + 1));
      const recent = timestamps.filter((timestamp) => timestamp > now - windowMs);
      if (recent.length === 0) this.requests.delete(key);
      else this.requests.set(key, recent);
    }
  }
}

export type SafeChatAttachment = { name: string; url?: string; size?: number };

export function validateChatRequest(body: unknown): {
  sessionId: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  attachments: SafeChatAttachment[];
  stream: boolean;
} | null {
  if (!body || typeof body !== 'object') return null;
  const input = body as Record<string, unknown>;
  if (typeof input.sessionId !== 'string' || !/^[a-zA-Z0-9_-]{8,100}$/.test(input.sessionId)) return null;
  if (!Array.isArray(input.messages) || input.messages.length === 0 || input.messages.length > 50) return null;

  const candidateMessages = input.messages as unknown[];
  const sanitized: Array<{ role: 'user' | 'assistant'; content: string }> = [];
  for (const candidate of candidateMessages) {
    if (!candidate || typeof candidate !== 'object') return null;
    const message = candidate as Record<string, unknown>;
    if (message.role !== 'user' && message.role !== 'assistant') return null;
    if (typeof message.content !== 'string' || message.content.length > 2_000) return null;
    if (message.content.trim()) sanitized.push({ role: message.role, content: message.content.trim() });
  }

  if (sanitized.length === 0 || sanitized[sanitized.length - 1].role !== 'user') return null;
  if (sanitized.reduce((total, message) => total + message.content.length, 0) > 10_000) return null;

  const rawAttachments = input.attachments === undefined ? [] : input.attachments;
  if (!Array.isArray(rawAttachments) || rawAttachments.length > 5) return null;
  const attachments: SafeChatAttachment[] = [];
  for (const item of rawAttachments) {
    if (!item || typeof item !== 'object') return null;
    const attachment = item as Record<string, unknown>;
    if (typeof attachment.name !== 'string' || attachment.name.length === 0 || attachment.name.length > 255) return null;
    if (attachment.size !== undefined && (!Number.isInteger(attachment.size) || Number(attachment.size) < 0 || Number(attachment.size) > 10 * 1024 * 1024)) return null;
    if (attachment.url !== undefined && typeof attachment.url !== 'string') return null;
    attachments.push({
      name: attachment.name.replace(/[\u0000-\u001f\u007f]/g, ''),
      ...(typeof attachment.url === 'string' && attachment.url.startsWith('/api/upload/') && { url: attachment.url }),
      ...(typeof attachment.size === 'number' && { size: attachment.size }),
    });
  }

  if (!sanitized[sanitized.length - 1].content && attachments.length === 0) return null;
  return {
    sessionId: input.sessionId,
    messages: sanitized.slice(-12),
    attachments,
    stream: input.stream === true,
  };
}
