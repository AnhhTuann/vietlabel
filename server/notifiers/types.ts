export type LeadStatus = 'NEW' | 'NEEDS_HUMAN' | 'CLAIMED' | 'CONTACTED' | 'CLOSED';

export interface LeadAttachment {
  name: string;
  url?: string;
  size?: number;
}

export interface LeadRecord {
  id: string;
  sessionId?: string;
  fullName?: string;
  company?: string;
  contact: string; // SĐT / Zalo / Email
  email?: string;
  productType: string;
  quantity?: string | number;
  dimensions?: string;
  material?: string;
  finishing?: string;
  innerProductOrSurface?: string;
  hasDesignFile?: boolean | string;
  attachments?: LeadAttachment[];
  deadline?: string;
  deliveryLocation?: string;
  notes?: string;
  leadScore: 'HOT' | 'WARM' | 'COLD';
  status: LeadStatus;
  claimedBy?: string;
  claimedAt?: string;
  createdAt: string;
  source?: string;
  conversationHistory?: Array<{ role: string; content: string; timestamp?: string }>;
  telegramMessageId?: number;
  telegramChatId?: string;
}

export interface Notifier {
  name: string;
  isEnabled(): boolean;
  send(lead: LeadRecord): Promise<{ success: boolean; error?: string; messageId?: number }>;
  updateClaimed?(lead: LeadRecord, claimedBy: string): Promise<boolean>;
  sendReminder?(lead: LeadRecord): Promise<boolean>;
}
