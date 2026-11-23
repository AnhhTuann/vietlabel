import 'dotenv/config';
import { pool } from './drizzle.js';

/**
 * Additive production bootstrap only.
 * This intentionally does NOT run the full seed/admin migration against
 * an existing business database. It only ensures the private upload table
 * required by the free-host durable storage adapter exists.
 */
async function ensureRuntimeSchema() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS private_uploads (
        id UUID PRIMARY KEY,
        content BYTEA NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    console.log('[DB] Runtime storage schema is ready.');
  } finally {
    await pool.end();
  }
}

ensureRuntimeSchema().catch((error) => {
  console.error('[DB] Could not ensure runtime schema:', error);
  process.exitCode = 1;
});
