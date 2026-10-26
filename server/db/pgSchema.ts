import {
  pgTable,
  text,
  integer,
  boolean,
  jsonb,
  timestamp,
  serial,
} from 'drizzle-orm/pg-core';

// ─── Users ───────────────────────────────────────────────
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().$type<'SALES' | 'MANAGER' | 'ADMIN'>(),
  telegramUserId: text('telegram_user_id'),
  zaloUserId: text('zalo_user_id'),
  active: boolean('active').notNull().default(true),
  failedLoginAttempts: integer('failed_login_attempts').notNull().default(0),
  lockedUntil: text('locked_until'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// ─── Leads ───────────────────────────────────────────────
export const leads = pgTable('leads', {
  id: text('id').primaryKey(),
  code: text('code').notNull().unique(),
  status: text('status').notNull().$type<'NEW' | 'NEEDS_HUMAN' | 'CLAIMED' | 'CONTACTED' | 'QUOTED' | 'WON' | 'LOST'>(),
  score: text('score').notNull().$type<'HOT' | 'WARM' | 'COLD'>(),
  source: text('source').notNull().$type<'web' | 'zalo' | 'messenger'>(),
  customerName: text('customer_name'),
  company: text('company'),
  phone: text('phone'),
  email: text('email'),
  industry: text('industry'),
  productType: text('product_type').notNull(),
  quantity: text('quantity'),
  deadline: text('deadline'),
  hasDesignFile: text('has_design_file'), // stored as string for flexibility
  brief: jsonb('brief').notNull().default({}),
  missingFields: jsonb('missing_fields').notNull().default([]),
  assignedToId: text('assigned_to_id'),
  claimedBy: text('claimed_by'),
  claimedAt: text('claimed_at'),
  firstResponseAt: text('first_response_at'),
  telegramMessageId: integer('telegram_message_id'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// ─── Conversations ────────────────────────────────────────
export const conversations = pgTable('conversations', {
  id: text('id').primaryKey(),
  leadId: text('lead_id').notNull(),
  sessionId: text('session_id').notNull().unique(),
  channel: text('channel').notNull().$type<'web' | 'zalo' | 'messenger'>(),
  mode: text('mode').notNull().default('BOT').$type<'BOT' | 'HUMAN'>(),
  humanAgentId: text('human_agent_id'),
  lastMessageAt: text('last_message_at').notNull(),
  csat: integer('csat'),
  createdAt: text('created_at').notNull(),
});

// ─── Messages ─────────────────────────────────────────────
export const messages = pgTable('messages', {
  id: text('id').primaryKey(),
  conversationId: text('conversation_id').notNull(),
  sender: text('sender').notNull().$type<'CUSTOMER' | 'BOT' | 'STAFF' | 'SYSTEM'>(),
  staffId: text('staff_id'),
  staffName: text('staff_name'),
  text: text('text').notNull().default(''),
  attachments: jsonb('attachments').default([]),
  createdAt: text('created_at').notNull(),
  readAt: text('read_at'),
  isFlaggedWrong: boolean('is_flagged_wrong').default(false),
});

// ─── Notes ───────────────────────────────────────────────
export const notes = pgTable('notes', {
  id: text('id').primaryKey(),
  leadId: text('lead_id').notNull(),
  authorId: text('author_id').notNull(),
  authorName: text('author_name').notNull(),
  text: text('text').notNull(),
  createdAt: text('created_at').notNull(),
});

// ─── Lead Events ─────────────────────────────────────────
export const leadEvents = pgTable('lead_events', {
  id: text('id').primaryKey(),
  leadId: text('lead_id').notNull(),
  type: text('type').notNull(),
  actorId: text('actor_id'),
  actorName: text('actor_name'),
  payload: jsonb('payload').default({}),
  createdAt: text('created_at').notNull(),
});

// ─── Notification Logs ────────────────────────────────────
export const notificationLogs = pgTable('notification_logs', {
  id: text('id').primaryKey(),
  leadId: text('lead_id').notNull(),
  channel: text('channel').notNull().$type<'telegram' | 'zalo' | 'email'>(),
  status: text('status').notNull().$type<'SENT' | 'FAILED' | 'SKIPPED'>(),
  error: text('error'),
  sentAt: text('sent_at').notNull(),
});

// ─── KB Documents ─────────────────────────────────────────
export const kbDocuments = pgTable('kb_documents', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  filePath: text('file_path').notNull(),
  content: text('content').notNull(),
  status: text('status').notNull().default('DRAFT').$type<'DRAFT' | 'APPROVED'>(),
  updatedAt: text('updated_at').notNull(),
  ingestedAt: text('ingested_at'),
});

// ─── Categories ───────────────────────────────────────────
export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  parentId: text('parent_id'),
  order: integer('order').notNull().default(0),
});

// ─── Products ─────────────────────────────────────────────
export const products = pgTable('products', {
  id: text('id').primaryKey(),
  categoryId: text('category_id').notNull(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull().default(''),
  images: jsonb('images').notNull().default([]),
  specs: jsonb('specs').notNull().default({}),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// ─── Posts ────────────────────────────────────────────────
export const posts = pgTable('posts', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  summary: text('summary').notNull().default(''),
  content: text('content').notNull().default(''),
  imageUrl: text('image_url'),
  category: text('category').notNull().default('Tin tức'),
  status: text('status').notNull().default('DRAFT').$type<'DRAFT' | 'PUBLISHED'>(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// ─── Jobs ─────────────────────────────────────────────────
export const jobs = pgTable('jobs', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  department: text('department').notNull(),
  location: text('location').notNull(),
  type: text('type').notNull(),
  description: text('description').notNull().default(''),
  requirements: text('requirements').notNull().default(''),
  benefits: text('benefits').notNull().default(''),
  status: text('status').notNull().default('OPEN').$type<'OPEN' | 'CLOSED'>(),
  deadline: text('deadline').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// ─── Job Applications ────────────────────────────────────
export const jobApplications = pgTable('job_applications', {
  id: text('id').primaryKey(),
  jobId: text('job_id').notNull(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  coverLetter: text('cover_letter').notNull().default(''),
  cvStorageKey: text('cv_storage_key').notNull().unique(),
  cvFileName: text('cv_file_name').notNull(),
  cvFileSize: integer('cv_file_size').notNull(),
  status: text('status').notNull().default('NEW')
    .$type<'NEW' | 'REVIEWING' | 'REJECTED' | 'ACCEPTED'>(),
  createdAt: text('created_at').notNull(),
});

// ─── Settings ─────────────────────────────────────────────
export const settings = pgTable('settings', {
  key: text('key').primaryKey(),
  value: jsonb('value').notNull(),
});

// ─── Lead counter ─────────────────────────────────────────
export const counters = pgTable('counters', {
  name: text('name').primaryKey(),
  value: integer('value').notNull().default(0),
});
