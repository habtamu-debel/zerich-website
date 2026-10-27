import bcrypt from 'bcryptjs';
import pool from '../config/db.js';

const [name, email, password] = process.argv.slice(2);

if (!name || !email || !password) {
  console.log('Usage: node scripts/createAdmin.js "Name" email@example.com "Password"');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 10);
await pool.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hash]);
console.log('Admin created:', email);
process.exit(0);