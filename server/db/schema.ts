export type UserRole = 'SALES' | 'MANAGER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  telegramUserId?: string;
  zaloUserId?: string;
  active: boolean;
  failedLoginAttempts: number;
  lockedUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export type LeadScore = 'HOT' | 'WARM' | 'COLD';
export type LeadStatus = 'NEW' | 'NEEDS_HUMAN' | 'CLAIMED' | 'CONTACTED' | 'QUOTED' | 'WON' | 'LOST';

export interface Lead {
  id: string; // e.g. LEAD-MUM8A-1234
  code: string; // e.g. #1234
  status: LeadStatus;
  score: LeadScore;
  source: 'web' | 'zalo' | 'messenger';
  customerName?: string;
  company?: string;
  phone?: string;
  email?: string;
  industry?: string;
  productType: string;
  quantity?: string | number;
  deadline?: string;
  hasDesignFile?: boolean | string;
  brief: Record<string, any>; // full customer brief fields
  missingFields: string[];
  assignedToId?: string; // User ID
  claimedBy?: string; // User Name
  claimedAt?: string;
  firstResponseAt?: string;
  createdAt: string;
  updatedAt: string;
  telegramMessageId?: number;
}

export type ConversationMode = 'BOT' | 'HUMAN';

export interface Conversation {
  id: string;
  leadId: string;
  sessionId: string;
  channel: 'web' | 'zalo' | 'messenger';
  mode: ConversationMode;
  humanAgentId?: string;
  lastMessageAt: string;
  csat?: number;
  createdAt: string;
}

export type MessageSender = 'CUSTOMER' | 'BOT' | 'STAFF' | 'SYSTEM';

export interface Message {
  id: string;
  conversationId: string;
  sender: MessageSender;
  staffId?: string;
  staffName?: string;
  text: string;
  attachments?: Array<{ name: string; url?: string; size?: number }>;
  createdAt: string;
  readAt?: string;
  isFlaggedWrong?: boolean;
}

export interface Note {
  id: string;
  leadId: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: string;
}

export interface LeadEvent {
  id: string;
  leadId: string;
  type: 'CREATED' | 'STATUS_CHANGED' | 'CLAIMED' | 'ASSIGNED' | 'TAKEOVER' | 'RELEASED' | 'NOTE_ADDED' | 'PHONE_VIEWED' | 'NOTIFIED' | 'MESSAGE_SENT';
  actorId?: string;
  actorName?: string;
  payload?: Record<string, any>;
  createdAt: string;
}

export interface NotificationLog {
  id: string;
  leadId: string;
  channel: 'telegram' | 'zalo' | 'email';
  status: 'SENT' | 'FAILED' | 'SKIPPED';
  error?: string;
  sentAt: string;
}

export interface KbDocument {
  id: string;
  title: string;
  filePath: string;
  content: string;
  status: 'DRAFT' | 'APPROVED';
  updatedAt: string;
  ingestedAt?: string;
}

export interface Setting {
  key: string;
  value: any;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string; // For 2-level hierarchy
  order: number;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  specs: Record<string, string>; // e.g. { "Chất liệu": "Giấy Kraft", "Kích thước": "Tùy chỉnh" }
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
