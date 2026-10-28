/**
 * DatabaseStore — PostgreSQL-backed (Drizzle ORM)
 *
 * Keeps the same interface as the old JSON-file store so all routes/services
 * need minimal changes. All operations are now async-safe and persistent.
 */
import { eq, desc, asc, sql } from 'drizzle-orm';
import { pgDb } from './drizzle.js';
import * as t from './pgSchema.js';
import {
  User,
  Lead,
  Conversation,
  Message,
  Note,
  LeadEvent,
  NotificationLog,
  KbDocument,
  Category,
  Product,
  Post,
  Job,
  JobApplication,
} from './schema.js';

// ─── Helper: map DB row → TypeScript type ───────────────────────────────────

function mapUser(row: typeof t.users.$inferSelect): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.passwordHash,
    role: row.role as User['role'],
    telegramUserId: row.telegramUserId ?? undefined,
    zaloUserId: row.zaloUserId ?? undefined,
    active: row.active,
    failedLoginAttempts: row.failedLoginAttempts,
    lockedUntil: row.lockedUntil ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function mapLead(row: typeof t.leads.$inferSelect): Lead {
  return {
    id: row.id,
    code: row.code,
    status: row.status as Lead['status'],
    score: row.score as Lead['score'],
    source: row.source as Lead['source'],
    customerName: row.customerName ?? undefined,
    company: row.company ?? undefined,
    phone: row.phone ?? undefined,
    email: row.email ?? undefined,
    industry: row.industry ?? undefined,
    productType: row.productType,
    quantity: row.quantity ?? undefined,
    deadline: row.deadline ?? undefined,
    hasDesignFile: row.hasDesignFile ?? undefined,
    brief: (row.brief as Record<string, any>) || {},
    missingFields: (row.missingFields as string[]) || [],
    assignedToId: row.assignedToId ?? undefined,
    claimedBy: row.claimedBy ?? undefined,
    claimedAt: row.claimedAt ?? undefined,
    firstResponseAt: row.firstResponseAt ?? undefined,
    telegramMessageId: row.telegramMessageId ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function mapConversation(row: typeof t.conversations.$inferSelect): Conversation {
  return {
    id: row.id,
    leadId: row.leadId,
    sessionId: row.sessionId,
    channel: row.channel as Conversation['channel'],
    mode: row.mode as Conversation['mode'],
    humanAgentId: row.humanAgentId ?? undefined,
    lastMessageAt: row.lastMessageAt,
    csat: row.csat ?? undefined,
    createdAt: row.createdAt,
  };
}

function mapMessage(row: typeof t.messages.$inferSelect): Message {
  return {
    id: row.id,
    conversationId: row.conversationId,
    sender: row.sender as Message['sender'],
    staffId: row.staffId ?? undefined,
    staffName: row.staffName ?? undefined,
    text: row.text,
    attachments: (row.attachments as Message['attachments']) ?? undefined,
    createdAt: row.createdAt,
    readAt: row.readAt ?? undefined,
    isFlaggedWrong: row.isFlaggedWrong ?? undefined,
  };
}

function mapNote(row: typeof t.notes.$inferSelect): Note {
  return {
    id: row.id,
    leadId: row.leadId,
    authorId: row.authorId,
    authorName: row.authorName,
    text: row.text,
    createdAt: row.createdAt,
  };
}

function mapEvent(row: typeof t.leadEvents.$inferSelect): LeadEvent {
  return {
    id: row.id,
    leadId: row.leadId,
    type: row.type as LeadEvent['type'],
    actorId: row.actorId ?? undefined,
    actorName: row.actorName ?? undefined,
    payload: (row.payload as Record<string, any>) ?? undefined,
    createdAt: row.createdAt,
  };
}

function mapNotificationLog(row: typeof t.notificationLogs.$inferSelect): NotificationLog {
  return {
    id: row.id,
    leadId: row.leadId,
    channel: row.channel as NotificationLog['channel'],
    status: row.status as NotificationLog['status'],
    error: row.error ?? undefined,
    sentAt: row.sentAt,
  };
}

function mapKbDocument(row: typeof t.kbDocuments.$inferSelect): KbDocument {
  return {
    id: row.id,
    title: row.title,
    filePath: row.filePath,
    content: row.content,
    status: row.status as KbDocument['status'],
    updatedAt: row.updatedAt,
    ingestedAt: row.ingestedAt ?? undefined,
  };
}

function mapCategory(row: typeof t.categories.$inferSelect): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    parentId: row.parentId ?? undefined,
    order: row.order,
  };
}

function mapProduct(row: typeof t.products.$inferSelect): Product {
  return {
    id: row.id,
    categoryId: row.categoryId,
    name: row.name,
    slug: row.slug,
    description: row.description,
    images: (row.images as string[]) || [],
    specs: (row.specs as Record<string, string>) || {},
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function mapPost(row: typeof t.posts.$inferSelect): Post {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    content: row.content,
    imageUrl: row.imageUrl ?? undefined,
    category: row.category,
    status: row.status as Post['status'],
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function mapJob(row: typeof t.jobs.$inferSelect): Job {
  return {
    id: row.id,
    title: row.title,
    department: row.department,
    location: row.location,
    type: row.type,
    description: row.description,
    requirements: row.requirements,
    benefits: row.benefits,
    status: row.status as Job['status'],
    deadline: row.deadline,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function mapJobApplication(row: typeof t.jobApplications.$inferSelect): JobApplication {
  return {
    id: row.id,
    jobId: row.jobId,
    fullName: row.fullName,
    email: row.email,
    phone: row.phone,
    coverLetter: row.coverLetter,
    cvStorageKey: row.cvStorageKey,
    cvFileName: row.cvFileName,
    cvFileSize: row.cvFileSize,
    status: row.status,
    createdAt: row.createdAt,
  };
}

// ─── DB object with same interface as old JSON store ─────────────────────────

export const db = {
  // ── Users ────────────────────────────────────────────────────────────────
  users: {
    findById: async (id: string): Promise<User | null> => {
      const rows = await pgDb.select().from(t.users).where(eq(t.users.id, id)).limit(1);
      return rows[0] ? mapUser(rows[0]) : null;
    },
    findByEmail: async (email: string): Promise<User | null> => {
      const rows = await pgDb.select().from(t.users)
        .where(sql`LOWER(${t.users.email}) = LOWER(${email})`).limit(1);
      return rows[0] ? mapUser(rows[0]) : null;
    },
    findByTelegramId: async (telegramId: string): Promise<User | null> => {
      const rows = await pgDb.select().from(t.users)
        .where(eq(t.users.telegramUserId, telegramId)).limit(1);
      return rows[0] ? mapUser(rows[0]) : null;
    },
    list: async (): Promise<User[]> => {
      const rows = await pgDb.select().from(t.users);
      return rows.map(mapUser);
    },
    create: async (user: User): Promise<User> => {
      await pgDb.insert(t.users).values({
        id: user.id,
        name: user.name,
        email: user.email,
        passwordHash: user.passwordHash,
        role: user.role,
        telegramUserId: user.telegramUserId ?? null,
        zaloUserId: user.zaloUserId ?? null,
        active: user.active,
        failedLoginAttempts: user.failedLoginAttempts,
        lockedUntil: user.lockedUntil ?? null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
      return user;
    },
    update: async (id: string, updates: Partial<User>): Promise<User | null> => {
      const now = new Date().toISOString();
      const rows = await pgDb.update(t.users)
        .set({
          ...(updates.name !== undefined && { name: updates.name }),
          ...(updates.email !== undefined && { email: updates.email }),
          ...(updates.passwordHash !== undefined && { passwordHash: updates.passwordHash }),
          ...(updates.role !== undefined && { role: updates.role }),
          ...(updates.telegramUserId !== undefined && { telegramUserId: updates.telegramUserId }),
          ...(updates.zaloUserId !== undefined && { zaloUserId: updates.zaloUserId }),
          ...(updates.active !== undefined && { active: updates.active }),
          ...(updates.failedLoginAttempts !== undefined && { failedLoginAttempts: updates.failedLoginAttempts }),
          ...(updates.lockedUntil !== undefined && { lockedUntil: updates.lockedUntil ?? null }),
          updatedAt: now,
        })
        .where(eq(t.users.id, id))
        .returning();
      return rows[0] ? mapUser(rows[0]) : null;
    },
  },

  // ── Leads ────────────────────────────────────────────────────────────────
  leads: {
    getNextCode: async (): Promise<string> => {
      const result = await pgDb
        .update(t.counters)
        .set({ value: sql`${t.counters.value} + 1` })
        .where(eq(t.counters.name, 'lead_counter'))
        .returning({ value: t.counters.value });
      const counter = result[0]?.value ?? 1001;
      return `#${counter}`;
    },
    findById: async (id: string): Promise<Lead | null> => {
      const rows = await pgDb.select().from(t.leads).where(eq(t.leads.id, id)).limit(1);
      return rows[0] ? mapLead(rows[0]) : null;
    },
    findByCode: async (code: string): Promise<Lead | null> => {
      const rows = await pgDb.select().from(t.leads).where(eq(t.leads.code, code)).limit(1);
      return rows[0] ? mapLead(rows[0]) : null;
    },
    list: async (): Promise<Lead[]> => {
      const rows = await pgDb.select().from(t.leads).orderBy(desc(t.leads.createdAt));
      return rows.map(mapLead);
    },
    create: async (lead: Lead): Promise<Lead> => {
      await pgDb.insert(t.leads).values({
        id: lead.id,
        code: lead.code,
        status: lead.status,
        score: lead.score,
        source: lead.source,
        customerName: lead.customerName ?? null,
        company: lead.company ?? null,
        phone: lead.phone ?? null,
        email: lead.email ?? null,
        industry: lead.industry ?? null,
        productType: lead.productType,
        quantity: lead.quantity?.toString() ?? null,
        deadline: lead.deadline ?? null,
        hasDesignFile: lead.hasDesignFile?.toString() ?? null,
        brief: lead.brief,
        missingFields: lead.missingFields,
        assignedToId: lead.assignedToId ?? null,
        claimedBy: lead.claimedBy ?? null,
        claimedAt: lead.claimedAt ?? null,
        firstResponseAt: lead.firstResponseAt ?? null,
        telegramMessageId: lead.telegramMessageId ?? null,
        createdAt: lead.createdAt,
        updatedAt: lead.updatedAt,
      });
      return lead;
    },
    update: async (id: string, updates: Partial<Lead>): Promise<Lead | null> => {
      const now = new Date().toISOString();
      const rows = await pgDb.update(t.leads)
        .set({
          ...(updates.status !== undefined && { status: updates.status }),
          ...(updates.score !== undefined && { score: updates.score }),
          ...(updates.source !== undefined && { source: updates.source }),
          ...(updates.customerName !== undefined && { customerName: updates.customerName }),
          ...(updates.company !== undefined && { company: updates.company }),
          ...(updates.phone !== undefined && { phone: updates.phone }),
          ...(updates.email !== undefined && { email: updates.email }),
          ...(updates.industry !== undefined && { industry: updates.industry }),
          ...(updates.productType !== undefined && { productType: updates.productType }),
          ...(updates.quantity !== undefined && { quantity: updates.quantity?.toString() }),
          ...(updates.deadline !== undefined && { deadline: updates.deadline }),
          ...(updates.hasDesignFile !== undefined && { hasDesignFile: updates.hasDesignFile?.toString() }),
          ...(updates.brief !== undefined && { brief: updates.brief }),
          ...(updates.missingFields !== undefined && { missingFields: updates.missingFields }),
          ...(updates.assignedToId !== undefined && { assignedToId: updates.assignedToId }),
          ...(updates.claimedBy !== undefined && { claimedBy: updates.claimedBy }),
          ...(updates.claimedAt !== undefined && { claimedAt: updates.claimedAt }),
          ...(updates.firstResponseAt !== undefined && { firstResponseAt: updates.firstResponseAt }),
          ...(updates.telegramMessageId !== undefined && { telegramMessageId: updates.telegramMessageId }),
          updatedAt: now,
        })
        .where(eq(t.leads.id, id))
        .returning();
      return rows[0] ? mapLead(rows[0]) : null;
    },
    delete: async (id: string): Promise<boolean> => {
      const rows = await pgDb.delete(t.leads).where(eq(t.leads.id, id)).returning({ id: t.leads.id });
      return rows.length > 0;
    },
    // Query leads created on a specific date range for stats
    listByDateRange: async (from: string, to: string): Promise<Lead[]> => {
      const rows = await pgDb.select().from(t.leads)
        .where(sql`${t.leads.createdAt} >= ${from} AND ${t.leads.createdAt} <= ${to}`)
        .orderBy(desc(t.leads.createdAt));
      return rows.map(mapLead);
    },
  },

  // ── Conversations ─────────────────────────────────────────────────────────
  conversations: {
    findById: async (id: string): Promise<Conversation | null> => {
      const rows = await pgDb.select().from(t.conversations).where(eq(t.conversations.id, id)).limit(1);
      return rows[0] ? mapConversation(rows[0]) : null;
    },
    findBySessionId: async (sessionId: string): Promise<Conversation | null> => {
      const rows = await pgDb.select().from(t.conversations)
        .where(eq(t.conversations.sessionId, sessionId)).limit(1);
      return rows[0] ? mapConversation(rows[0]) : null;
    },
    findByLeadId: async (leadId: string): Promise<Conversation | null> => {
      const rows = await pgDb.select().from(t.conversations)
        .where(eq(t.conversations.leadId, leadId)).limit(1);
      return rows[0] ? mapConversation(rows[0]) : null;
    },
    list: async (): Promise<Conversation[]> => {
      const rows = await pgDb.select().from(t.conversations);
      return rows.map(mapConversation);
    },
    create: async (conv: Conversation): Promise<Conversation> => {
      await pgDb.insert(t.conversations).values({
        id: conv.id,
        leadId: conv.leadId,
        sessionId: conv.sessionId,
        channel: conv.channel,
        mode: conv.mode,
        humanAgentId: conv.humanAgentId ?? null,
        lastMessageAt: conv.lastMessageAt,
        csat: conv.csat ?? null,
        createdAt: conv.createdAt,
      });
      return conv;
    },
    update: async (id: string, updates: Partial<Conversation>): Promise<Conversation | null> => {
      const rows = await pgDb.update(t.conversations)
        .set({
          ...(updates.mode !== undefined && { mode: updates.mode }),
          ...(updates.humanAgentId !== undefined && { humanAgentId: updates.humanAgentId }),
          ...(updates.lastMessageAt !== undefined && { lastMessageAt: updates.lastMessageAt }),
          ...(updates.csat !== undefined && { csat: updates.csat }),
        })
        .where(eq(t.conversations.id, id))
        .returning();
      return rows[0] ? mapConversation(rows[0]) : null;
    },
  },

  // ── Messages ──────────────────────────────────────────────────────────────
  messages: {
    listByConversationId: async (convId: string): Promise<Message[]> => {
      const rows = await pgDb.select().from(t.messages)
        .where(eq(t.messages.conversationId, convId))
        .orderBy(asc(t.messages.createdAt));
      return rows.map(mapMessage);
    },
    create: async (msg: Message): Promise<Message> => {
      await pgDb.insert(t.messages).values({
        id: msg.id,
        conversationId: msg.conversationId,
        sender: msg.sender,
        staffId: msg.staffId ?? null,
        staffName: msg.staffName ?? null,
        text: msg.text,
        attachments: msg.attachments ?? null,
        createdAt: msg.createdAt,
        readAt: msg.readAt ?? null,
        isFlaggedWrong: msg.isFlaggedWrong ?? false,
      });
      return msg;
    },
    update: async (id: string, updates: Partial<Message>): Promise<Message | null> => {
      const rows = await pgDb.update(t.messages)
        .set({
          ...(updates.readAt !== undefined && { readAt: updates.readAt }),
          ...(updates.isFlaggedWrong !== undefined && { isFlaggedWrong: updates.isFlaggedWrong }),
          ...(updates.text !== undefined && { text: updates.text }),
        })
        .where(eq(t.messages.id, id))
        .returning();
      return rows[0] ? mapMessage(rows[0]) : null;
    },
  },

  // ── Notes ─────────────────────────────────────────────────────────────────
  notes: {
    listByLeadId: async (leadId: string): Promise<Note[]> => {
      const rows = await pgDb.select().from(t.notes)
        .where(eq(t.notes.leadId, leadId))
        .orderBy(desc(t.notes.createdAt));
      return rows.map(mapNote);
    },
    create: async (note: Note): Promise<Note> => {
      await pgDb.insert(t.notes).values({
        id: note.id,
        leadId: note.leadId,
        authorId: note.authorId,
        authorName: note.authorName,
        text: note.text,
        createdAt: note.createdAt,
      });
      return note;
    },
  },

  // ── Lead Events ───────────────────────────────────────────────────────────
  events: {
    listByLeadId: async (leadId: string): Promise<LeadEvent[]> => {
      const rows = await pgDb.select().from(t.leadEvents)
        .where(eq(t.leadEvents.leadId, leadId))
        .orderBy(desc(t.leadEvents.createdAt));
      return rows.map(mapEvent);
    },
    create: async (event: LeadEvent): Promise<LeadEvent> => {
      await pgDb.insert(t.leadEvents).values({
        id: event.id,
        leadId: event.leadId,
        type: event.type,
        actorId: event.actorId ?? null,
        actorName: event.actorName ?? null,
        payload: event.payload ?? null,
        createdAt: event.createdAt,
      });
      return event;
    },
  },

  // ── Notification Logs ─────────────────────────────────────────────────────
  notificationLogs: {
    listByLeadId: async (leadId: string): Promise<NotificationLog[]> => {
      const rows = await pgDb.select().from(t.notificationLogs)
        .where(eq(t.notificationLogs.leadId, leadId))
        .orderBy(desc(t.notificationLogs.sentAt));
      return rows.map(mapNotificationLog);
    },
    create: async (log: NotificationLog): Promise<NotificationLog> => {
      await pgDb.insert(t.notificationLogs).values({
        id: log.id,
        leadId: log.leadId,
        channel: log.channel,
        status: log.status,
        error: log.error ?? null,
        sentAt: log.sentAt,
      });
      return log;
    },
  },

  // ── KB Documents ──────────────────────────────────────────────────────────
  kbDocuments: {
    list: async (): Promise<KbDocument[]> => {
      const rows = await pgDb.select().from(t.kbDocuments);
      return rows.map(mapKbDocument);
    },
    findById: async (id: string): Promise<KbDocument | null> => {
      const rows = await pgDb.select().from(t.kbDocuments).where(eq(t.kbDocuments.id, id)).limit(1);
      return rows[0] ? mapKbDocument(rows[0]) : null;
    },
    create: async (doc: KbDocument): Promise<KbDocument> => {
      await pgDb.insert(t.kbDocuments).values({
        id: doc.id,
        title: doc.title,
        filePath: doc.filePath,
        content: doc.content,
        status: doc.status,
        updatedAt: doc.updatedAt,
        ingestedAt: doc.ingestedAt ?? null,
      });
      return doc;
    },
    update: async (id: string, updates: Partial<KbDocument>): Promise<KbDocument | null> => {
      const now = new Date().toISOString();
      const rows = await pgDb.update(t.kbDocuments)
        .set({
          ...(updates.title !== undefined && { title: updates.title }),
          ...(updates.content !== undefined && { content: updates.content }),
          ...(updates.status !== undefined && { status: updates.status }),
          ...(updates.ingestedAt !== undefined && { ingestedAt: updates.ingestedAt }),
          updatedAt: now,
        })
        .where(eq(t.kbDocuments.id, id))
        .returning();
      return rows[0] ? mapKbDocument(rows[0]) : null;
    },
    delete: async (id: string): Promise<boolean> => {
      const rows = await pgDb.delete(t.kbDocuments).where(eq(t.kbDocuments.id, id)).returning({ id: t.kbDocuments.id });
      return rows.length > 0;
    },
  },

  // ── Settings ──────────────────────────────────────────────────────────────
  settings: {
    getAll: async (): Promise<Record<string, any>> => {
      const rows = await pgDb.select().from(t.settings);
      return Object.fromEntries(rows.map(r => [r.key, r.value]));
    },
    get: async (key: string): Promise<any> => {
      const rows = await pgDb.select().from(t.settings).where(eq(t.settings.key, key)).limit(1);
      return rows[0]?.value ?? null;
    },
    set: async (key: string, value: any): Promise<any> => {
      await pgDb.insert(t.settings)
        .values({ key, value })
        .onConflictDoUpdate({ target: t.settings.key, set: { value } });
      return value;
    },
  },

  // ── Categories ────────────────────────────────────────────────────────────
  categories: {
    list: async (): Promise<Category[]> => {
      const rows = await pgDb.select().from(t.categories).orderBy(asc(t.categories.order));
      return rows.map(mapCategory);
    },
    findById: async (id: string): Promise<Category | null> => {
      const rows = await pgDb.select().from(t.categories).where(eq(t.categories.id, id)).limit(1);
      return rows[0] ? mapCategory(rows[0]) : null;
    },
    create: async (cat: Category): Promise<Category> => {
      await pgDb.insert(t.categories).values({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        parentId: cat.parentId ?? null,
        order: cat.order,
      });
      return cat;
    },
    update: async (id: string, updates: Partial<Category>): Promise<Category | null> => {
      const rows = await pgDb.update(t.categories)
        .set({
          ...(updates.name !== undefined && { name: updates.name }),
          ...(updates.slug !== undefined && { slug: updates.slug }),
          ...(updates.parentId !== undefined && { parentId: updates.parentId }),
          ...(updates.order !== undefined && { order: updates.order }),
        })
        .where(eq(t.categories.id, id))
        .returning();
      return rows[0] ? mapCategory(rows[0]) : null;
    },
    delete: async (id: string): Promise<boolean> => {
      const rows = await pgDb.delete(t.categories).where(eq(t.categories.id, id)).returning({ id: t.categories.id });
      return rows.length > 0;
    },
  },

  // ── Products ──────────────────────────────────────────────────────────────
  products: {
    list: async (): Promise<Product[]> => {
      const rows = await pgDb.select().from(t.products).orderBy(desc(t.products.createdAt));
      return rows.map(mapProduct);
    },
    findById: async (id: string): Promise<Product | null> => {
      const rows = await pgDb.select().from(t.products).where(eq(t.products.id, id)).limit(1);
      return rows[0] ? mapProduct(rows[0]) : null;
    },
    findBySlug: async (slug: string): Promise<Product | null> => {
      const rows = await pgDb.select().from(t.products).where(eq(t.products.slug, slug)).limit(1);
      return rows[0] ? mapProduct(rows[0]) : null;
    },
    create: async (prod: Product): Promise<Product> => {
      await pgDb.insert(t.products).values({
        id: prod.id,
        categoryId: prod.categoryId,
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        images: prod.images,
        specs: prod.specs,
        isActive: prod.isActive,
        createdAt: prod.createdAt,
        updatedAt: prod.updatedAt,
      });
      return prod;
    },
    update: async (id: string, updates: Partial<Product>): Promise<Product | null> => {
      const now = new Date().toISOString();
      const rows = await pgDb.update(t.products)
        .set({
          ...(updates.categoryId !== undefined && { categoryId: updates.categoryId }),
          ...(updates.name !== undefined && { name: updates.name }),
          ...(updates.slug !== undefined && { slug: updates.slug }),
          ...(updates.description !== undefined && { description: updates.description }),
          ...(updates.images !== undefined && { images: updates.images }),
          ...(updates.specs !== undefined && { specs: updates.specs }),
          ...(updates.isActive !== undefined && { isActive: updates.isActive }),
          updatedAt: now,
        })
        .where(eq(t.products.id, id))
        .returning();
      return rows[0] ? mapProduct(rows[0]) : null;
    },
    delete: async (id: string): Promise<boolean> => {
      const rows = await pgDb.delete(t.products).where(eq(t.products.id, id)).returning({ id: t.products.id });
      return rows.length > 0;
    },
  },

  // ── Posts ─────────────────────────────────────────────────────────────────
  posts: {
    list: async (): Promise<Post[]> => {
      const rows = await pgDb.select().from(t.posts).orderBy(desc(t.posts.createdAt));
      return rows.map(mapPost);
    },
    findById: async (id: string): Promise<Post | null> => {
      const rows = await pgDb.select().from(t.posts).where(eq(t.posts.id, id)).limit(1);
      return rows[0] ? mapPost(rows[0]) : null;
    },
    findBySlug: async (slug: string): Promise<Post | null> => {
      const rows = await pgDb.select().from(t.posts).where(eq(t.posts.slug, slug)).limit(1);
      return rows[0] ? mapPost(rows[0]) : null;
    },
    create: async (post: Post): Promise<Post> => {
      await pgDb.insert(t.posts).values({
        id: post.id,
        title: post.title,
        slug: post.slug,
        summary: post.summary,
        content: post.content,
        imageUrl: post.imageUrl ?? null,
        category: post.category,
        status: post.status,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      });
      return post;
    },
    update: async (id: string, updates: Partial<Post>): Promise<Post | null> => {
      const now = new Date().toISOString();
      const rows = await pgDb.update(t.posts)
        .set({
          ...(updates.title !== undefined && { title: updates.title }),
          ...(updates.slug !== undefined && { slug: updates.slug }),
          ...(updates.summary !== undefined && { summary: updates.summary }),
          ...(updates.content !== undefined && { content: updates.content }),
          ...(updates.imageUrl !== undefined && { imageUrl: updates.imageUrl }),
          ...(updates.category !== undefined && { category: updates.category }),
          ...(updates.status !== undefined && { status: updates.status }),
          updatedAt: now,
        })
        .where(eq(t.posts.id, id))
        .returning();
      return rows[0] ? mapPost(rows[0]) : null;
    },
    delete: async (id: string): Promise<boolean> => {
      const rows = await pgDb.delete(t.posts).where(eq(t.posts.id, id)).returning({ id: t.posts.id });
      return rows.length > 0;
    },
  },

  // ── Jobs ──────────────────────────────────────────────────────────────────
  jobs: {
    list: async (): Promise<Job[]> => {
      const rows = await pgDb.select().from(t.jobs).orderBy(desc(t.jobs.createdAt));
      return rows.map(mapJob);
    },
    findById: async (id: string): Promise<Job | null> => {
      const rows = await pgDb.select().from(t.jobs).where(eq(t.jobs.id, id)).limit(1);
      return rows[0] ? mapJob(rows[0]) : null;
    },
    create: async (job: Job): Promise<Job> => {
      await pgDb.insert(t.jobs).values({
        id: job.id,
        title: job.title,
        department: job.department,
        location: job.location,
        type: job.type,
        description: job.description,
        requirements: job.requirements,
        benefits: job.benefits,
        status: job.status,
        deadline: job.deadline,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
      });
      return job;
    },
    update: async (id: string, updates: Partial<Job>): Promise<Job | null> => {
      const now = new Date().toISOString();
      const rows = await pgDb.update(t.jobs)
        .set({
          ...(updates.title !== undefined && { title: updates.title }),
          ...(updates.department !== undefined && { department: updates.department }),
          ...(updates.location !== undefined && { location: updates.location }),
          ...(updates.type !== undefined && { type: updates.type }),
          ...(updates.description !== undefined && { description: updates.description }),
          ...(updates.requirements !== undefined && { requirements: updates.requirements }),
          ...(updates.benefits !== undefined && { benefits: updates.benefits }),
          ...(updates.status !== undefined && { status: updates.status }),
          ...(updates.deadline !== undefined && { deadline: updates.deadline }),
          updatedAt: now,
        })
        .where(eq(t.jobs.id, id))
        .returning();
      return rows[0] ? mapJob(rows[0]) : null;
    },
    delete: async (id: string): Promise<boolean> => {
      const rows = await pgDb.delete(t.jobs).where(eq(t.jobs.id, id)).returning({ id: t.jobs.id });
      return rows.length > 0;
    },
  },

  jobApplications: {
    list: async (): Promise<JobApplication[]> => {
      const rows = await pgDb.select().from(t.jobApplications).orderBy(desc(t.jobApplications.createdAt));
      return rows.map(mapJobApplication);
    },
    findById: async (id: string): Promise<JobApplication | null> => {
      const rows = await pgDb.select().from(t.jobApplications).where(eq(t.jobApplications.id, id)).limit(1);
      return rows[0] ? mapJobApplication(rows[0]) : null;
    },
    create: async (application: JobApplication): Promise<JobApplication> => {
      await pgDb.insert(t.jobApplications).values({
        ...application,
      });
      return application;
    },
  },
};
