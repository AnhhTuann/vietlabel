import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './pgSchema.js';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    '[DB] DATABASE_URL environment variable is required.\n' +
    'For local dev: copy .env.example to .env and set DATABASE_URL=postgres://vietlabel:vietlabel_local@localhost:5432/vietlabel\n' +
    'Then run: docker compose up -d postgres'
  );
}

const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('[DB] Unexpected pool error:', err.message);
});

export const pgDb = drizzle(pool, { schema });

export async function testConnection(): Promise<void> {
  const client = await pool.connect();
  await client.query('SELECT 1');
  client.release();
  console.log('[DB] PostgreSQL connection OK');
}
