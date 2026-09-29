import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  User,
  Lead,
  Conversation,
  Message,
  Note,
  LeadEvent,
  NotificationLog,
  KbDocument,
  Setting,
} from './schema';

interface DatabaseSchema {
  users: User[];
  leads: Lead[];
  conversations: Conversation[];
  messages: Message[];
  notes: Note[];
  events: LeadEvent[];
  notificationLogs: NotificationLog[];
  kbDocuments: KbDocument[];
  settings: Record<string, any>;
  nextLeadCounter: number;
}

const DB_DIR = path.resolve(process.cwd(), 'server/data');
const DB_FILE = path.join(DB_DIR, 'db.json');

class DatabaseStore {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
    this.seedDefaultData();
  }

  private loadDatabase(): DatabaseSchema {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      } catch (err) {
        console.error('Error reading db.json, initializing fresh store:', err);
      }
    }

    return {
      users: [],
      leads: [],
      conversations: [],
      messages: [],
      notes: [],
      events: [],
      notificationLogs: [],
      kbDocuments: [],
      settings: {
        working_hours: '08:00 - 17:30',
        escalation_minutes: 10,
        hot_threshold_quantity: 5000,
        telegram_enabled: true,
        zalo_enabled: false,
        email_enabled: true,
      },
      nextLeadCounter: 1001,
    };
  }

  public save() {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      const tmpFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tmpFile, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch (err) {
      console.error('Failed to write db.json:', err);
    }
  }

  private seedDefaultData() {
    let modified = false;

    // Seed users if empty
    if (this.data.users.length === 0) {
      const now = new Date().toISOString();
      const salt = bcrypt.genSaltSync(10);

      this.data.users = [
        {
          id: 'user_admin_01',
          name: 'Nguyễn Văn Admin',
          email: 'admin@vietlabel.com.vn',
          passwordHash: bcrypt.hashSync('Admin@123456', salt),
          role: 'ADMIN',
          telegramUserId: 'admin_tele',
          active: true,
          failedLoginAttempts: 0,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'user_manager_01',
          name: 'Lê Hoàng Nam (Trưởng phòng KD)',
          email: 'manager@vietlabel.com.vn',
          passwordHash: bcrypt.hashSync('Manager@123456', salt),
          role: 'MANAGER',
          telegramUserId: 'manager_tele',
          active: true,
          failedLoginAttempts: 0,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'user_sales_01',
          name: 'Trần Thu Hà (Sales Senior)',
          email: 'sales@vietlabel.com.vn',
          passwordHash: bcrypt.hashSync('Sales@123456', salt),
          role: 'SALES',
          telegramUserId: 'ha_sales',
          active: true,
          failedLoginAttempts: 0,
          createdAt: now,
          updatedAt: now,
        },
      ];
      modified = true;
    }

    // Seed KB documents from server/knowledge/*.md if empty
    if (this.data.kbDocuments.length === 0) {
      const knowledgeDir = path.resolve(process.cwd(), 'server/knowledge');
      if (fs.existsSync(knowledgeDir)) {
        const files = fs.readdirSync(knowledgeDir).filter(f => f.endsWith('.md'));
        const now = new Date().toISOString();
        for (const file of files) {
          const content = fs.readFileSync(path.join(knowledgeDir, file), 'utf-8');
          const firstLine = content.split('\n')[0] || file;
          const title = firstLine.replace(/^#*\s*/, '').trim() || file;
          this.data.kbDocuments.push({
            id: `kb_${file.replace('.md', '')}`,
            title,
            filePath: file,
            content,
            status: 'APPROVED',
            updatedAt: now,
            ingestedAt: now,
          });
        }
        modified = true;
      }
    }

    // Seed a sample initial lead for immediate demo view
    if (this.data.leads.length === 0) {
      const now = new Date().toISOString();
      const leadId = 'LEAD-MUM8A-1001';
      const convId = 'conv_demo_01';

      this.data.leads.push({
        id: leadId,
        code: '#1001',
        status: 'NEEDS_HUMAN',
        score: 'HOT',
        source: 'web',
        customerName: 'Hoàng Minh Tuấn',
        company: 'Công ty Cổ phần Dược phẩm BioPharm',
        phone: '0988776655',
        email: 'tuan.hoang@biopharm.vn',
        industry: 'Dược phẩm & Y tế',
        productType: 'Tem nhãn Pop-up gập mở 4 trang',
        quantity: '30.000 tem',
        deadline: 'Cần gấp trong 5 ngày',
        hasDesignFile: true,
        brief: {
          productType: 'Tem nhãn Pop-up gập mở 4 trang',
          quantity: '30.000 tem',
          deadline: 'Cần gấp trong 5 ngày',
          material: 'Decal nhựa PP kháng nước, keo y tế bóc dán 50 lần',
          dimensions: '60 x 90 mm',
          finishing: 'Cán màng mờ, phủ UV định hình logo, bế răng cưa',
        },
        missingFields: [],
        createdAt: now,
        updatedAt: now,
      });

      this.data.conversations.push({
        id: convId,
        leadId,
        sessionId: 'sess_demo_01',
        channel: 'web',
        mode: 'BOT',
        lastMessageAt: now,
        createdAt: now,
      });

      this.data.messages.push(
        {
          id: 'msg_01',
          conversationId: convId,
          sender: 'CUSTOMER',
          text: 'Bên mình cần đặt 30.000 tem pop-up gập mở cho chai thuốc siro kháng sinh, có thể gấp 4 trang hướng dẫn sử dụng được không?',
          createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        },
        {
          id: 'msg_02',
          conversationId: convId,
          sender: 'BOT',
          text: 'Dạ chào anh Tuấn! Vietlabel hoàn toàn có dây chuyền sản xuất tem Pop-up gập mở đa tầng từ 3 đến 8 trang chuẩn GMP dược phẩm. Tem có thể mở ra đọc hướng dẫn và dán lại nhiều lần bằng lớp keo chuyên dụng.\n\nCho em hỏi kích thước chai thuốc dự kiến và anh đã có sẵn file thiết kế chưa ạ?',
          createdAt: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
        },
        {
          id: 'msg_03',
          conversationId: convId,
          sender: 'CUSTOMER',
          text: 'Kích thước khoảng 60x90mm, file thiết kế AI bên mình có sẵn rồi, cần giao hàng trong 5 ngày tới tại Bình Dương.',
          createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        },
        {
          id: 'msg_04',
          conversationId: convId,
          sender: 'BOT',
          text: 'Dạ tuyệt vời! Em đã tổng hợp Customer Brief cho anh. Do đơn hàng có số lượng 30.000 tem và tiến độ gấp 5 ngày, em đã kết nối ưu tiên đến Trưởng bộ phận Kinh doanh để báo giá có chiết khấu tốt nhất ngay ạ.',
          createdAt: new Date(Date.now() - 1000 * 60 * 11).toISOString(),
        }
      );

      this.data.events.push(
        {
          id: 'ev_01',
          leadId,
          type: 'CREATED',
          payload: { source: 'web_ai_chat', score: 'HOT' },
          createdAt: now,
        },
        {
          id: 'ev_02',
          leadId,
          type: 'STATUS_CHANGED',
          payload: { from: 'NEW', to: 'NEEDS_HUMAN', reason: 'Lead HOT với số lượng 30.000 tem' },
          createdAt: now,
        }
      );

      this.data.notificationLogs.push({
        id: 'notif_01',
        leadId,
        channel: 'telegram',
        status: 'SENT',
        sentAt: now,
      });

      this.data.nextLeadCounter = 1002;
      modified = true;
    }

    if (modified) {
      this.save();
    }
  }

  // --- ACCESSORS ---
  public get users() {
    return {
      findById: (id: string) => this.data.users.find(u => u.id === id),
      findByEmail: (email: string) => this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase()),
      findByTelegramId: (telegramId: string) => this.data.users.find(u => u.telegramUserId === telegramId),
      list: () => [...this.data.users],
      create: (user: User) => {
        this.data.users.push(user);
        this.save();
        return user;
      },
      update: (id: string, updates: Partial<User>) => {
        const idx = this.data.users.findIndex(u => u.id === id);
        if (idx !== -1) {
          this.data.users[idx] = { ...this.data.users[idx], ...updates, updatedAt: new Date().toISOString() };
          this.save();
          return this.data.users[idx];
        }
        return null;
      },
    };
  }

  public get leads() {
    return {
      getNextCode: () => {
        const code = `#${this.data.nextLeadCounter}`;
        this.data.nextLeadCounter++;
        this.save();
        return code;
      },
      findById: (id: string) => this.data.leads.find(l => l.id === id),
      findByCode: (code: string) => this.data.leads.find(l => l.code === code),
      list: () => [...this.data.leads],
      create: (lead: Lead) => {
        this.data.leads.unshift(lead);
        this.save();
        return lead;
      },
      update: (id: string, updates: Partial<Lead>) => {
        const idx = this.data.leads.findIndex(l => l.id === id);
        if (idx !== -1) {
          this.data.leads[idx] = { ...this.data.leads[idx], ...updates, updatedAt: new Date().toISOString() };
          this.save();
          return this.data.leads[idx];
        }
        return null;
      },
    };
  }

  public get conversations() {
    return {
      findById: (id: string) => this.data.conversations.find(c => c.id === id),
      findBySessionId: (sessionId: string) => this.data.conversations.find(c => c.sessionId === sessionId),
      findByLeadId: (leadId: string) => this.data.conversations.find(c => c.leadId === leadId),
      list: () => [...this.data.conversations],
      create: (conv: Conversation) => {
        this.data.conversations.unshift(conv);
        this.save();
        return conv;
      },
      update: (id: string, updates: Partial<Conversation>) => {
        const idx = this.data.conversations.findIndex(c => c.id === id);
        if (idx !== -1) {
          this.data.conversations[idx] = { ...this.data.conversations[idx], ...updates };
          this.save();
          return this.data.conversations[idx];
        }
        return null;
      },
    };
  }

  public get messages() {
    return {
      listByConversationId: (convId: string) =>
        this.data.messages.filter(m => m.conversationId === convId).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
      create: (msg: Message) => {
        this.data.messages.push(msg);
        this.save();
        return msg;
      },
      update: (id: string, updates: Partial<Message>) => {
        const idx = this.data.messages.findIndex(m => m.id === id);
        if (idx !== -1) {
          this.data.messages[idx] = { ...this.data.messages[idx], ...updates };
          this.save();
          return this.data.messages[idx];
        }
        return null;
      },
    };
  }

  public get notes() {
    return {
      listByLeadId: (leadId: string) =>
        this.data.notes.filter(n => n.leadId === leadId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      create: (note: Note) => {
        this.data.notes.unshift(note);
        this.save();
        return note;
      },
    };
  }

  public get events() {
    return {
      listByLeadId: (leadId: string) =>
        this.data.events.filter(e => e.leadId === leadId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      create: (event: LeadEvent) => {
        this.data.events.unshift(event);
        this.save();
        return event;
      },
    };
  }

  public get notificationLogs() {
    return {
      listByLeadId: (leadId: string) =>
        this.data.notificationLogs.filter(n => n.leadId === leadId).sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()),
      create: (log: NotificationLog) => {
        this.data.notificationLogs.unshift(log);
        this.save();
        return log;
      },
    };
  }

  public get kbDocuments() {
    return {
      list: () => [...this.data.kbDocuments],
      findById: (id: string) => this.data.kbDocuments.find(k => k.id === id),
      create: (doc: KbDocument) => {
        this.data.kbDocuments.unshift(doc);
        this.save();
        return doc;
      },
      update: (id: string, updates: Partial<KbDocument>) => {
        const idx = this.data.kbDocuments.findIndex(k => k.id === id);
        if (idx !== -1) {
          this.data.kbDocuments[idx] = { ...this.data.kbDocuments[idx], ...updates, updatedAt: new Date().toISOString() };
          this.save();
          return this.data.kbDocuments[idx];
        }
        return null;
      },
      delete: (id: string) => {
        const idx = this.data.kbDocuments.findIndex(k => k.id === id);
        if (idx !== -1) {
          this.data.kbDocuments.splice(idx, 1);
          this.save();
          return true;
        }
        return false;
      },
    };
  }

  public get settings() {
    return {
      getAll: () => ({ ...this.data.settings }),
      get: (key: string) => this.data.settings[key],
      set: (key: string, value: any) => {
        this.data.settings[key] = value;
        this.save();
        return value;
      },
    };
  }
}

export const db = new DatabaseStore();
