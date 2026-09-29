import { CustomerBrief } from '../config/leadScoring';

export interface ChatMessageItem {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  attachments?: Array<{ name: string; url?: string; size?: number }>;
  isError?: boolean;
}

export interface SendMessageOptions {
  sessionId: string;
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  attachments?: Array<{ name: string; url?: string; size?: number }>;
  onChunk?: (chunk: string) => void;
  signal?: AbortSignal;
}

export interface ChatApiResponse {
  reply: string;
  extractedFields: Record<string, any>;
  missingFields: string[];
  leadScore: 'HOT' | 'WARM' | 'COLD';
  needHuman: boolean;
  briefReady: boolean;
  sources?: string[];
}

export const chatApi = {
  async sendMessage(options: SendMessageOptions): Promise<ChatApiResponse> {
    const { sessionId, messages, attachments, onChunk, signal } = options;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          messages,
          attachments,
          stream: Boolean(onChunk),
        }),
        signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Lỗi máy chủ (${response.status})`);
      }

      // If SSE streaming
      if (onChunk && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullReply = '';
        let metadata: any = null;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value, { stream: true });
          const lines = text.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const parsed = JSON.parse(line.replace('data: ', '').trim());
                if (parsed.chunk) {
                  fullReply += parsed.chunk;
                  onChunk(parsed.chunk);
                }
                if (parsed.done && parsed.metadata) {
                  metadata = parsed.metadata;
                }
              } catch (e) {
                // Ignore chunk parse glitch
              }
            }
          }
        }

        return {
          reply: fullReply || metadata?.replyText || '',
          extractedFields: metadata?.extractedFields || {},
          missingFields: metadata?.missingFields || [],
          leadScore: metadata?.leadScore || 'WARM',
          needHuman: Boolean(metadata?.needHuman),
          briefReady: Boolean(metadata?.briefReady),
          sources: metadata?.sources || [],
        };
      }

      // JSON response
      const data: ChatApiResponse = await response.json();
      return data;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw err;
      }
      console.error('API chat call failed:', err);
      throw err;
    }
  },

  async submitCustomerBrief(brief: CustomerBrief & { sessionId?: string }): Promise<{ success: boolean; leadId?: string; message: string }> {
    const response = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(brief),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Gửi thông tin thất bại');
    }

    return response.json();
  },

  async uploadFile(file: File): Promise<{ name: string; url: string; size: number }> {
    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('Dung lượng file tối đa là 10MB');
    }

    const payload = {
      fileName: file.name,
      fileSize: file.size,
    };

    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Tải file thất bại');
    }

    const data = await response.json();
    return data.file;
  },

  async submitFeedback(payload: { sessionId: string; rating: number | 'like' | 'dislike'; comment?: string }): Promise<void> {
    await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(err => console.warn('Submit feedback warning:', err));
  },

  async requestHumanHandoff(payload: {
    contact?: string;
    fullName?: string;
    notes?: string;
    productType?: string;
    sessionId?: string;
    conversationHistory?: Array<{ role: string; content: string }>;
  }): Promise<{ success: boolean; leadId: string; message: string; inWorkingHours: boolean }> {
    const response = await fetch('/api/lead/handoff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Không thể chuyển tiếp yêu cầu');
    }

    return response.json();
  },

  async claimLead(leadId: string, claimedBy: string): Promise<{ success: boolean; message: string; lead?: any }> {
    const response = await fetch(`/api/lead/${leadId}/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ claimedBy }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Không thể nhận xử lý');
    }

    return response.json();
  },

  async getLeads(params?: { status?: string; score?: string; q?: string }): Promise<{ total: number; leads: any[]; stats: any }> {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.score) query.set('score', params.score);
    if (params?.q) query.set('q', params.q);

    const response = await fetch(`/api/lead?${query.toString()}`);
    if (!response.ok) {
      throw new Error('Lỗi lấy danh sách lead');
    }
    return response.json();
  },

  async getLeadById(id: string): Promise<{ success: boolean; lead: any }> {
    const response = await fetch(`/api/lead/${id}`);
    if (!response.ok) {
      throw new Error('Không tìm thấy hồ sơ lead');
    }
    return response.json();
  },
};
