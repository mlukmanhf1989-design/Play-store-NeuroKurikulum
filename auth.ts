import crypto from 'node:crypto';
import { pool, initDatabase } from './db';

export type AuthUser = {
  id: string;
  username: string;
  name: string;
  email?: string;
  role: string;
  roleLabel: string;
  avatar: string;
  institutionName: string;
  joinedDate: string;
  studentLimit?: number;
  canReviewAllAccounts: boolean;
  canDeleteRecords: boolean;
  canPurgeAllDatabase: boolean;
  description?: string;
  isTrial?: boolean;
};

const roleLabels: Record<string,string> = {
  lembaga: 'Lembaga Pendidikan',
  peneliti: 'Peneliti Pendidikan & Neuropsikologi',
  psikolog: 'Psikolog Perkembangan & Neuropsikologi',
  kurikulum: 'Pengembang Kurikulum & Diferensiasi',
  superadmin: 'Server Utama (Root Administrator)',
};

function env(name: string) {
  return process.env[name] || '';
}

function authSecret() {
  const secret = env('AUTH_SECRET');
  if (!secret || secret.length < 32) throw new Error('AUTH_SECRET harus diatur dan minimal 32 karakter.');
  return secret;
}

export function hashPassword(password: string, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, expected] = stored.split(':');
  if (!salt || !expected) return false;
  const actual = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(actual, 'hex'), Buffer.from(expected, 'hex'));
}

function sign(payload: object) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', authSecret()).update(body).digest('base64url');
  return `${body}.${sig}`;
}

function verify(token: string) {
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expected = crypto.createHmac('sha256', authSecret()).update(body).digest('base64url');
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!payload.exp || payload.exp < Math.floor(Date.now()/1000)) return null;
    return payload;
  } catch { return null; }
}

function publicUser(row: any, roleOverride?: string): AuthUser {
  const role = roleOverride || row.role;
  const privileged = ['superadmin','kurikulum','psikolog','peneliti'].includes(role);
  return {
    id: row.id,
    username: row.username,
    name: row.name,
    email: row.email || '',
    role,
    roleLabel: roleLabels[role] || role,
    avatar: row.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    institutionName: row.institution_name || 'Lembaga Mandiri',
    joinedDate: row.created_at ? new Date(row.created_at).toISOString().slice(0,10) : new Date().toISOString().slice(0,10),
    studentLimit: row.is_trial ? 1 : (role === 'lembaga' ? 3 : undefined),
    canReviewAllAccounts: privileged,
    canDeleteRecords: privileged,
    canPurgeAllDatabase: role === 'superadmin',
    description: row.description || `Akun ${roleLabels[role] || role}.`,
    isTrial: Boolean(row.is_trial),
  };
}

function adminUser(): AuthUser {
  return {
    id: 'usr-root-master',
    username: env('ADMIN_USERNAME'),
    name: 'Server Utama / Root Administrator',
    role: 'superadmin',
    roleLabel: roleLabels.superadmin,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    institutionName: 'Master Server',
    joinedDate: '2026-09-06',
    canReviewAllAccounts: true,
    canDeleteRecords: true,
    canPurgeAllDatabase: true,
    description: 'Akun server utama yang dikelola melalui environment variables.',
    isTrial: false,
  };
}

export async function login(username: string, password: string) {
  await initDatabase();
  const normalized = username.trim().toLowerCase();
  if (normalized === env('ADMIN_USERNAME').trim().toLowerCase() && password === env('ADMIN_PASSWORD')) {
    const user = adminUser();
    return { user, token: sign({ sub: user.id, role: user.role, exp: Math.floor(Date.now()/1000) + 60*60*12 }) };
  }
  const result = await pool.query(
    `SELECT id,username,password_hash,name,role,institution_name,email,city,is_trial,created_at,active
     FROM users WHERE LOWER(username)=LOWER($1) AND active=TRUE LIMIT 1`,
    [username.trim()]
  );
  const row = result.rows[0];
  if (!row || !verifyPassword(password, row.password_hash)) return null;
  const user = publicUser(row);
  return { user, token: sign({ sub: user.id, role: user.role, exp: Math.floor(Date.now()/1000) + 60*60*12 }) };
}

export async function register(input: { name:string; username:string; password:string; token:string; role:string; city?:string; email?:string }) {
  await initDatabase();
  const registrationToken = env('REGISTER_TOKEN');
  if (!registrationToken || input.token !== registrationToken) throw new Error('Token registrasi tidak valid.');
  if (!['lembaga','peneliti','psikolog'].includes(input.role)) throw new Error('Peran registrasi tidak diizinkan.');
  if (!/^[a-zA-Z0-9._-]{4,32}$/.test(input.username)) throw new Error('Username 4-32 karakter: huruf, angka, titik, garis bawah atau strip.');
  if (input.password.length < 8) throw new Error('Password minimal 8 karakter.');
  if (input.name.trim().length < 2) throw new Error('Nama wajib diisi.');
  const id = `usr-${crypto.randomUUID()}`;
  try {
    const result = await pool.query(
      `INSERT INTO users(id,username,password_hash,name,role,institution_name,email,city)
       VALUES($1,$2,$3,$4,$5,$4,$6,$7)
       RETURNING id,username,name,role,institution_name,email,city,created_at,is_trial`,
      [id, input.username.trim(), hashPassword(input.password), input.name.trim(), input.role, input.email?.trim().toLowerCase() || '', input.city?.trim() || '']
    );
    const user = publicUser(result.rows[0]);
    return { user, token: sign({ sub: user.id, role: user.role, exp: Math.floor(Date.now()/1000) + 60*60*12 }) };
  } catch (e:any) {
    if (e?.code === '23505') throw new Error('Username sudah digunakan.');
    throw e;
  }
}

export async function authenticateHeader(header?: string): Promise<AuthUser | null> {
  if (!header?.startsWith('Bearer ')) return null;
  const payload = verify(header.slice(7));
  if (!payload?.sub) return null;
  if (payload.sub === 'usr-root-master') return adminUser();
  await initDatabase();
  const result = await pool.query(
    `SELECT id,username,name,role,institution_name,email,city,is_trial,created_at,active FROM users WHERE id=$1 AND active=TRUE`,
    [payload.sub]
  );
  return result.rows[0] ? publicUser(result.rows[0]) : null;
}

export async function listUsers() {
  await initDatabase();
  const result = await pool.query(
    `SELECT id,username,name,role,institution_name,email,city,is_trial,created_at,active FROM users ORDER BY created_at DESC`
  );
  return result.rows.map(publicUser);
}

export async function deleteUser(id: string) {
  await initDatabase();
  const result = await pool.query(`DELETE FROM users WHERE id=$1 RETURNING id`, [id]);
  return result.rowCount === 1;
}

export async function purgeUsers() {
  await initDatabase();
  const result = await pool.query(`DELETE FROM users RETURNING id`);
  return result.rowCount || 0;
}


export async function startTrial(input: { name: string; email: string; ipAddress: string }) {
  await initDatabase();
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const ipAddress = (input.ipAddress || '').trim();
  if (name.length < 2) throw new Error('Nama lembaga/peneliti/psikolog wajib diisi.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Email tidak valid.');
  if (!ipAddress) throw new Error('Alamat IP tidak dapat diverifikasi. Silakan coba lagi.');
  const existing = await pool.query(
    `SELECT email, ip_address FROM trial_access WHERE LOWER(email)=LOWER($1) OR ip_address=$2 LIMIT 1`,
    [email, ipAddress]
  );
  if (existing.rows[0]) throw new Error('Uji coba gratis sudah pernah digunakan. Satu uji coba hanya berlaku untuk satu email atau satu alamat IP.');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const id = `trial-${crypto.randomUUID()}`;
    const username = `trial_${crypto.randomBytes(6).toString('hex')}`;
    const password = crypto.randomBytes(24).toString('base64url');
    await client.query(
      `INSERT INTO users(id,username,password_hash,name,role,institution_name,email,city,is_trial)
       VALUES($1,$2,$3,$4,'lembaga',$4,$5,'',TRUE)`,
      [id, username, hashPassword(password), name, email]
    );
    await client.query(
      `INSERT INTO trial_access(id,user_id,email,ip_address) VALUES($1,$2,$3,$4)`,
      [`trial-access-${crypto.randomUUID()}`, id, email, ipAddress]
    );
    await client.query('COMMIT');
    const user: AuthUser = {
      id, username, name, email, role:'lembaga', roleLabel:roleLabels.lembaga,
      avatar:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      institutionName:name, joinedDate:new Date().toISOString().slice(0,10),
      studentLimit:1, canReviewAllAccounts:false, canDeleteRecords:false, canPurgeAllDatabase:false,
      description:'Akun Uji Coba Gratis — maksimal 1 siswa.', isTrial:true
    };
    return { user, token: sign({ sub:user.id, role:user.role, exp:Math.floor(Date.now()/1000)+60*60*4 }) };
  } catch (e:any) {
    await client.query('ROLLBACK');
    if (e?.code === '23505') throw new Error('Uji coba gratis sudah pernah digunakan untuk email atau alamat IP ini.');
    throw e;
  } finally { client.release(); }
}
