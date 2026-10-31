import crypto from 'crypto';
import pool from './config/db.js';

// bcryptjs or bcrypt, whichever is installed
let bcrypt;
try { bcrypt = (await import('bcryptjs')).default; }
catch { bcrypt = (await import('bcrypt')).default; }

const [, , email = 'admin@zerich.com', password = 'ChangeMe@123', name = 'ZeRich Admin'] = process.argv;

const [cols] = await pool.query('SHOW COLUMNS FROM users');
const names = cols.map((c) => c.Field);

const pwCol = names.includes('password_hash') ? 'password_hash' : 'password';
const nameCol = names.includes('full_name') ? 'full_name' : 'name';
const idCol = cols.find((c) => c.Field === 'id');
const idIsAuto = idCol?.Extra?.includes('auto_increment');

// the admin routes need a role column
if (!names.includes('role')) {
  await pool.query(
    "ALTER TABLE users ADD COLUMN role ENUM('admin','client','student') NOT NULL DEFAULT 'client'"
  );
  console.log('Added missing role column');
}

const hash = await bcrypt.hash(password, 10);
const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);

if (existing.length) {
  await pool.query(
    `UPDATE users SET ${pwCol} = ?, ${nameCol} = ?, role = 'admin' WHERE email = ?`,
    [hash, name, email]
  );
  console.log(`Updated existing user ${email} (password reset, role = admin)`);
} else if (idIsAuto) {
  await pool.query(
    `INSERT INTO users (${nameCol}, email, ${pwCol}, role) VALUES (?, ?, ?, 'admin')`,
    [name, email, hash]
  );
  console.log(`Created admin ${email}`);
} else {
  await pool.query(
    `INSERT INTO users (id, ${nameCol}, email, ${pwCol}, role) VALUES (?, ?, ?, ?, 'admin')`,
    [crypto.randomUUID(), name, email, hash]
  );
  console.log(`Created admin ${email}`);
}

await pool.end();