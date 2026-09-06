import pg from 'pg';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!connectionString) {
  console.warn('[Database] DATABASE_URL/POSTGRES_URL belum diatur. Set environment variable PostgreSQL untuk production/Vercel.');
}

const pool = new Pool({
  connectionString,
  ssl: connectionString && !/localhost|127\.0\.0\.1/.test(connectionString) ? { rejectUnauthorized: false } : undefined,
  max: 5,
});

let initialized = false;
let initPromise: Promise<void> | null = null;

export async function initDatabase() {
  if (initialized) return;
  if (initPromise) return initPromise;
  initPromise = (async () => {
    if (!connectionString) throw new Error('DATABASE_URL belum dikonfigurasi.');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS app_store (
        key TEXT PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        institution_name TEXT NOT NULL,
        email TEXT DEFAULT '',
        city TEXT DEFAULT '',
        is_trial BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        active BOOLEAN NOT NULL DEFAULT TRUE
      );
      ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT DEFAULT '';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS is_trial BOOLEAN NOT NULL DEFAULT FALSE;
      CREATE INDEX IF NOT EXISTS users_username_idx ON users (LOWER(username));
      CREATE INDEX IF NOT EXISTS users_email_idx ON users (LOWER(email));
      CREATE TABLE IF NOT EXISTS trial_access (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        email TEXT NOT NULL,
        ip_address TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE UNIQUE INDEX IF NOT EXISTS trial_access_email_uq ON trial_access (LOWER(email));
      CREATE UNIQUE INDEX IF NOT EXISTS trial_access_ip_uq ON trial_access (ip_address) WHERE ip_address <> '';
      CREATE INDEX IF NOT EXISTS trial_access_user_idx ON trial_access (user_id);
    `);
    initialized = true;
  })();
  try { await initPromise; } catch (e) { initPromise = null; throw e; }
}

export async function getStore<T>(key: string, fallback: T): Promise<T> {
  await initDatabase();
  const row = await pool.query('SELECT value FROM app_store WHERE key = $1', [key]);
  if (!row.rows[0]) {
    await setStore(key, fallback);
    return fallback;
  }
  return row.rows[0].value as T;
}

export async function setStore<T>(key: string, value: T) {
  await initDatabase();
  await pool.query(
    `INSERT INTO app_store(key,value,updated_at) VALUES($1,$2::jsonb,NOW())
     ON CONFLICT(key) DO UPDATE SET value=EXCLUDED.value, updated_at=NOW()`,
    [key, JSON.stringify(value)]
  );
}

export async function replaceStore<T>(key: string, value: T) {
  await setStore(key, value);
  return value;
}

export async function databaseInfo() {
  await initDatabase();
  const rows = await pool.query('SELECT key, octet_length(value::text) AS bytes, updated_at FROM app_store ORDER BY key');
  return { engine: 'PostgreSQL', persistent: true, stores: rows.rows };
}

export { pool };
