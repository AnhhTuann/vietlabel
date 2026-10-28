/**
 * Migration + Seed script
 * Run: npm run db:migrate
 *
 * This script:
 * 1. Creates all tables if they don't exist (idempotent)
 * 2. Seeds CMS content, an initial admin (when configured), settings, and KB documents
 */

import 'dotenv/config';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PRODUCT_CATEGORIES, PRODUCTS_LIST } from '../../src/data/products.js';
import { POSTS_LIST } from '../../src/data/posts.js';
import { JOBS_LIST } from '../../src/data/jobs.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('❌ DATABASE_URL not set. Copy .env.example → .env and configure it.');
  process.exit(1);
}

const pool = new Pool({ connectionString });

async function run() {
  const client = await pool.connect();
  console.log('✅ Connected to PostgreSQL');

  try {
    // ── Create all tables ────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL,
        telegram_user_id TEXT,
        zalo_user_id TEXT,
        active BOOLEAN NOT NULL DEFAULT TRUE,
        failed_login_attempts INTEGER NOT NULL DEFAULT 0,
        locked_until TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS leads (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL UNIQUE,
        status TEXT NOT NULL,
        score TEXT NOT NULL,
        source TEXT NOT NULL,
        customer_name TEXT,
        company TEXT,
        phone TEXT,
        email TEXT,
        industry TEXT,
        product_type TEXT NOT NULL,
        quantity TEXT,
        deadline TEXT,
        has_design_file TEXT,
        brief JSONB NOT NULL DEFAULT '{}',
        missing_fields JSONB NOT NULL DEFAULT '[]',
        assigned_to_id TEXT,
        claimed_by TEXT,
        claimed_at TEXT,
        first_response_at TEXT,
        telegram_message_id INTEGER,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS conversations (
        id TEXT PRIMARY KEY,
        lead_id TEXT NOT NULL,
        session_id TEXT NOT NULL UNIQUE,
        channel TEXT NOT NULL,
        mode TEXT NOT NULL DEFAULT 'BOT',
        human_agent_id TEXT,
        last_message_at TEXT NOT NULL,
        csat INTEGER,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        conversation_id TEXT NOT NULL,
        sender TEXT NOT NULL,
        staff_id TEXT,
        staff_name TEXT,
        text TEXT NOT NULL DEFAULT '',
        attachments JSONB DEFAULT '[]',
        created_at TEXT NOT NULL,
        read_at TEXT,
        is_flagged_wrong BOOLEAN DEFAULT FALSE
      );

      CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY,
        lead_id TEXT NOT NULL,
        author_id TEXT NOT NULL,
        author_name TEXT NOT NULL,
        text TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS lead_events (
        id TEXT PRIMARY KEY,
        lead_id TEXT NOT NULL,
        type TEXT NOT NULL,
        actor_id TEXT,
        actor_name TEXT,
        payload JSONB DEFAULT '{}',
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS notification_logs (
        id TEXT PRIMARY KEY,
        lead_id TEXT NOT NULL,
        channel TEXT NOT NULL,
        status TEXT NOT NULL,
        error TEXT,
        sent_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS kb_documents (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        file_path TEXT NOT NULL,
        content TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'DRAFT',
        updated_at TEXT NOT NULL,
        ingested_at TEXT
      );

      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        parent_id TEXT,
        "order" INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        category_id TEXT NOT NULL,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL DEFAULT '',
        images JSONB NOT NULL DEFAULT '[]',
        specs JSONB NOT NULL DEFAULT '{}',
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        summary TEXT NOT NULL DEFAULT '',
        content TEXT NOT NULL DEFAULT '',
        image_url TEXT,
        category TEXT NOT NULL DEFAULT 'Tin tức',
        status TEXT NOT NULL DEFAULT 'DRAFT',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS jobs (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        department TEXT NOT NULL,
        location TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        requirements TEXT NOT NULL DEFAULT '',
        benefits TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL DEFAULT 'OPEN',
        deadline TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS job_applications (
        id TEXT PRIMARY KEY,
        job_id TEXT NOT NULL,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        cover_letter TEXT NOT NULL DEFAULT '',
        cv_storage_key TEXT NOT NULL UNIQUE,
        cv_file_name TEXT NOT NULL,
        cv_file_size INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'NEW',
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value JSONB NOT NULL
      );

      CREATE TABLE IF NOT EXISTS counters (
        name TEXT PRIMARY KEY,
        value INTEGER NOT NULL DEFAULT 0
      );
    `);
    console.log('✅ All tables created (or already exist)');

    // ── Create indexes ────────────────────────────────────────────────────────
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
      CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score);
      CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
      CREATE INDEX IF NOT EXISTS idx_conversations_session_id ON conversations(session_id);
      CREATE INDEX IF NOT EXISTS idx_conversations_lead_id ON conversations(lead_id);
      CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
      CREATE INDEX IF NOT EXISTS idx_lead_events_lead_id ON lead_events(lead_id);
      CREATE INDEX IF NOT EXISTS idx_notes_lead_id ON notes(lead_id);
    `);
    console.log('✅ Indexes created');

    // ── Seed: lead counter ─────────────────────────────────────────────────────
    await client.query(`
      INSERT INTO counters (name, value) VALUES ('lead_counter', 1001)
      ON CONFLICT (name) DO NOTHING;
    `);

    // ── Seed: default settings ─────────────────────────────────────────────────
    const defaultSettings: Record<string, any> = {
      working_hours: '08:00 - 17:30',
      escalation_minutes: 10,
      hot_threshold_quantity: 5000,
      telegram_enabled: true,
      zalo_enabled: false,
      email_enabled: true,
    };
    for (const [key, value] of Object.entries(defaultSettings)) {
      await client.query(`
        INSERT INTO settings (key, value) VALUES ($1, $2::jsonb)
        ON CONFLICT (key) DO NOTHING;
      `, [key, JSON.stringify(value)]);
    }
    console.log('✅ Settings seeded');

    // ── Seed canonical website content only into empty CMS tables ─────────────
    const now = new Date().toISOString();
    const existingCategories = await client.query('SELECT COUNT(*) FROM categories');
    if (Number(existingCategories.rows[0].count) === 0) {
      for (const [index, category] of PRODUCT_CATEGORIES.entries()) {
        await client.query(`
          INSERT INTO categories (id, name, slug, parent_id, "order")
          VALUES ($1, $2, $3, NULL, $4)
          ON CONFLICT (id) DO NOTHING;
        `, [category.id, category.nameVi, category.slug, index]);
      }
    }

    const existingProducts = await client.query('SELECT COUNT(*) FROM products');
    if (Number(existingProducts.rows[0].count) === 0) {
      for (const product of PRODUCTS_LIST) {
        await client.query(`
          INSERT INTO products (id, category_id, name, slug, description, images, specs, is_active, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, true, $8, $8)
          ON CONFLICT (id) DO NOTHING;
        `, [
          product.id,
          product.categoryId,
          product.nameVi,
          product.slug,
          product.descriptionVi,
          JSON.stringify([...new Set([product.heroImage, ...product.gallery])]),
          JSON.stringify({
            'Chất liệu': product.specs.materialVi,
            'Kích thước': product.specs.dimensionsVi,
            'Kỹ thuật in': product.specs.printTechniqueVi,
            'Gia công': product.specs.finishingVi,
            'Số lượng tối thiểu': product.specs.moq,
            'Thời gian sản xuất': product.specs.leadTimeVi,
          }),
          now,
        ]);
      }
    }

    const existingPosts = await client.query('SELECT COUNT(*) FROM posts');
    if (Number(existingPosts.rows[0].count) === 0) {
      for (const post of POSTS_LIST) {
        const match = post.date.match(/(\d{1,2}) Tháng (\d{1,2}), (\d{4})/);
        const publishedAt = match
          ? new Date(Date.UTC(Number(match[3]), Number(match[2]) - 1, Number(match[1]))).toISOString()
          : now;
        await client.query(`
          INSERT INTO posts (id, title, slug, summary, content, image_url, category, status, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, 'PUBLISHED', $8, $9)
          ON CONFLICT (id) DO NOTHING;
        `, [
          post.id,
          post.titleVi,
          post.slug,
          post.summaryVi,
          post.contentVi.join('\n\n'),
          post.image,
          post.category,
          publishedAt,
          now,
        ]);
      }
    }

    const existingJobs = await client.query('SELECT COUNT(*) FROM jobs');
    if (Number(existingJobs.rows[0].count) === 0) {
      for (const job of JOBS_LIST) {
        const match = job.deadline.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
        const deadline = match
          ? new Date(Date.UTC(Number(match[3]), Number(match[2]) - 1, Number(match[1]))).toISOString()
          : now;
        const status = new Date(deadline).getTime() >= Date.now() ? 'OPEN' : 'CLOSED';
        await client.query(`
          INSERT INTO jobs (id, title, department, location, type, description, requirements, benefits, status, deadline, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $11)
          ON CONFLICT (id) DO NOTHING;
        `, [
          job.id,
          job.titleVi,
          job.departmentVi,
          job.locationVi,
          job.typeVi,
          job.responsibilitiesVi.join('\n'),
          [job.experienceVi, ...job.requirementsVi].join('\n'),
          job.benefitsVi.join('\n'),
          status,
          deadline,
          now,
        ]);
      }
    }
    console.log('✅ CMS content seeded from src/data (only into empty tables)');

    // ── Seed: secure initial admin and disable legacy demo accounts ───────────
    const initialAdminEmail = process.env.INITIAL_ADMIN_EMAIL?.trim().toLowerCase();
    const initialAdminPassword = process.env.INITIAL_ADMIN_PASSWORD;
    if (Boolean(initialAdminEmail) !== Boolean(initialAdminPassword)) {
      throw new Error('Set both INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD to provision an admin.');
    }
    if (
      initialAdminEmail &&
      (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(initialAdminEmail) ||
        Buffer.byteLength(initialAdminPassword ?? '', 'utf8') < 16)
    ) {
      throw new Error('INITIAL_ADMIN_EMAIL must be valid and INITIAL_ADMIN_PASSWORD must be at least 16 bytes.');
    }

    const legacyDemoUsers = [
      { id: 'user_admin_01', email: 'admin@vietlabel.com.vn', role: 'ADMIN' },
      { id: 'user_manager_01', email: 'manager@vietlabel.com.vn', role: 'MANAGER' },
      { id: 'user_sales_01', email: 'sales@vietlabel.com.vn', role: 'SALES' },
    ];
    for (const demoUser of legacyDemoUsers) {
      const result = await client.query(
        'SELECT id FROM users WHERE id = $1 AND email = $2',
        [demoUser.id, demoUser.email]
      );
      if (!result.rows.length) continue;

      await client.query(
        'UPDATE users SET active = false, updated_at = $1 WHERE id = $2 AND email = $3',
        [new Date().toISOString(), demoUser.id, demoUser.email]
      );
      console.warn(`ℹ️  Disabled legacy demo account when present: ${demoUser.email}`);
    }

    if (initialAdminEmail && initialAdminPassword) {
      const configuredAdmin = await client.query(
        'SELECT id, role, active FROM users WHERE email = $1 LIMIT 1',
        [initialAdminEmail]
      );
      if (configuredAdmin.rows[0]) {
        if (configuredAdmin.rows[0].role !== 'ADMIN' || !configuredAdmin.rows[0].active) {
          await client.query(`
            UPDATE users
            SET name = $1, password_hash = $2, role = 'ADMIN', active = true,
                failed_login_attempts = 0, locked_until = NULL, updated_at = $3
            WHERE id = $4;
          `, [
            process.env.INITIAL_ADMIN_NAME?.trim() || 'Vietlabel Administrator',
            bcrypt.hashSync(initialAdminPassword, bcrypt.genSaltSync(12)),
            new Date().toISOString(),
            configuredAdmin.rows[0].id,
          ]);
          console.log('✅ Configured admin account activated');
        } else {
          console.log('ℹ️  Configured admin account is already active');
        }
      } else {
        const now = new Date().toISOString();
        await client.query(`
          INSERT INTO users (id, name, email, password_hash, role, telegram_user_id, active, failed_login_attempts, created_at, updated_at)
          VALUES ($1, $2, $3, $4, 'ADMIN', NULL, true, 0, $5, $5);
        `, [
          crypto.randomUUID(),
          process.env.INITIAL_ADMIN_NAME?.trim() || 'Vietlabel Administrator',
          initialAdminEmail,
          bcrypt.hashSync(initialAdminPassword, bcrypt.genSaltSync(12)),
          now,
        ]);
        console.log('✅ Initial admin account created');
      }
    }

    const existingUsers = await client.query('SELECT COUNT(*) FROM users');
    const activeAdmins = await client.query("SELECT COUNT(*) FROM users WHERE role = 'ADMIN' AND active = true");
    if (!initialAdminEmail && Number(activeAdmins.rows[0].count) === 0) {
      console.warn('⚠️  No active admin. Set INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD, then rerun migration.');
    }
    if (Number(existingUsers.rows[0].count) > 0) console.log('ℹ️  Existing user accounts checked');

    // ── Seed: KB documents from server/knowledge/*.md ─────────────────────────
    const existingKb = await client.query('SELECT COUNT(*) FROM kb_documents');
    if (parseInt(existingKb.rows[0].count) === 0) {
      const knowledgeDir = path.resolve(process.cwd(), 'server/knowledge');
      if (fs.existsSync(knowledgeDir)) {
        const files = fs.readdirSync(knowledgeDir).filter(f => f.endsWith('.md'));
        const now = new Date().toISOString();
        for (const file of files) {
          const content = fs.readFileSync(path.join(knowledgeDir, file), 'utf-8');
          const firstLine = content.split('\n')[0] || file;
          const title = firstLine.replace(/^#*\s*/, '').trim() || file;
          const id = `kb_${file.replace('.md', '')}`;
          await client.query(`
            INSERT INTO kb_documents (id, title, file_path, content, status, updated_at, ingested_at)
            VALUES ($1, $2, $3, $4, 'APPROVED', $5, $5)
            ON CONFLICT (id) DO NOTHING;
          `, [id, title, file, content, now]);
        }
        console.log(`✅ KB documents seeded from server/knowledge/ (${files.length} files)`);
      }
    } else {
      console.log('ℹ️  KB documents already exist, skipping seed');
    }

    // ── Seed: demo lead ───────────────────────────────────────────────────────
    const existingLeads = await client.query('SELECT COUNT(*) FROM leads');
    if (process.env.SEED_DEMO_LEAD === 'true' && parseInt(existingLeads.rows[0].count) === 0) {
      const now = new Date().toISOString();
      const leadId = 'LEAD-MUM8A-1001';
      const convId = 'conv_demo_01';
      const brief = {
        productType: 'Tem nhãn Pop-up gập mở 4 trang',
        quantity: '30.000 tem',
        deadline: 'Cần gấp trong 5 ngày',
        material: 'Decal nhựa PP kháng nước, keo y tế bóc dán 50 lần',
        dimensions: '60 x 90 mm',
        finishing: 'Cán màng mờ, phủ UV định hình logo, bế răng cưa',
      };

      await client.query(`
        INSERT INTO leads (id, code, status, score, source, customer_name, company, phone, email, industry, product_type, quantity, deadline, has_design_file, brief, missing_fields, created_at, updated_at)
        VALUES ($1, '#1001', 'NEEDS_HUMAN', 'HOT', 'web', 'Hoàng Minh Tuấn', 'Công ty Cổ phần Dược phẩm BioPharm', '0988776655', 'tuan.hoang@biopharm.vn', 'Dược phẩm & Y tế', 'Tem nhãn Pop-up gập mở 4 trang', '30.000 tem', 'Cần gấp trong 5 ngày', 'true', $2::jsonb, '[]'::jsonb, $3, $3)
        ON CONFLICT (id) DO NOTHING;
      `, [leadId, JSON.stringify(brief), now]);

      await client.query(`
        INSERT INTO conversations (id, lead_id, session_id, channel, mode, last_message_at, created_at)
        VALUES ($1, $2, 'sess_demo_01', 'web', 'BOT', $3, $3)
        ON CONFLICT (id) DO NOTHING;
      `, [convId, leadId, now]);

      const demoMessages = [
        { id: 'msg_01', sender: 'CUSTOMER', text: 'Bên mình cần đặt 30.000 tem pop-up gập mở cho chai thuốc siro kháng sinh, có thể gấp 4 trang hướng dẫn sử dụng được không?' },
        { id: 'msg_02', sender: 'BOT', text: 'Dạ chào anh Tuấn! Vietlabel hoàn toàn có dây chuyền sản xuất tem Pop-up gập mở đa tầng từ 3 đến 8 trang chuẩn GMP dược phẩm. Tem có thể mở ra đọc hướng dẫn và dán lại nhiều lần bằng lớp keo chuyên dụng.\n\nCho em hỏi kích thước chai thuốc dự kiến và anh đã có sẵn file thiết kế chưa ạ?' },
        { id: 'msg_03', sender: 'CUSTOMER', text: 'Kích thước khoảng 60x90mm, file thiết kế AI bên mình có sẵn rồi, cần giao hàng trong 5 ngày tới tại Bình Dương.' },
        { id: 'msg_04', sender: 'BOT', text: 'Dạ tuyệt vời! Em đã tổng hợp Customer Brief cho anh. Do đơn hàng có số lượng 30.000 tem và tiến độ gấp 5 ngày, em đã kết nối ưu tiên đến Trưởng bộ phận Kinh doanh để báo giá có chiết khấu tốt nhất ngay ạ.' },
      ];

      for (let i = 0; i < demoMessages.length; i++) {
        const m = demoMessages[i];
        const msgTime = new Date(Date.now() - (4 - i) * 3 * 60 * 1000).toISOString();
        await client.query(`
          INSERT INTO messages (id, conversation_id, sender, text, created_at)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (id) DO NOTHING;
        `, [m.id, convId, m.sender, m.text, msgTime]);
      }

      await client.query(`
        INSERT INTO lead_events (id, lead_id, type, payload, created_at)
        VALUES ('ev_01', $1, 'CREATED', '{"source":"web_ai_chat","score":"HOT"}'::jsonb, $2),
               ('ev_02', $1, 'STATUS_CHANGED', '{"from":"NEW","to":"NEEDS_HUMAN","reason":"Lead HOT với số lượng 30.000 tem"}'::jsonb, $2)
        ON CONFLICT (id) DO NOTHING;
      `, [leadId, now]);

      await client.query(`
        INSERT INTO notification_logs (id, lead_id, channel, status, sent_at)
        VALUES ('notif_01', $1, 'telegram', 'SENT', $2)
        ON CONFLICT (id) DO NOTHING;
      `, [leadId, now]);

      // Update counter to 1002
      await client.query(`UPDATE counters SET value = 1002 WHERE name = 'lead_counter';`);

      console.log('✅ Demo lead seeded');
    } else {
      console.log('ℹ️  Leads already exist, skipping demo seed');
    }

    console.log('\n🎉 Migration complete! You can now run: npm run dev\n');
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch(err => {
  console.error('❌ Migration failed:', err.message);
  process.exit(1);
});
