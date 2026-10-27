import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import pool from '../config/db.js';
import auth from '../middleware/auth.js';

const router = Router();

const leadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { message: 'Too many requests. Please try again later.' },
});

// Public: contact / free consultation form
router.post('/', leadLimiter, async (req, res) => {
  const { name, email, phone, service, message } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  await pool.query(
    'INSERT INTO leads (name, email, phone, service, message) VALUES (?, ?, ?, ?, ?)',
    [name.trim(), email.trim(), phone || null, service || null, message || null]
  );
  res.status(201).json({ message: 'Thank you! We will contact you soon.' });
});

// Admin
router.get('/', auth, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM leads ORDER BY created_at DESC');
  res.json(rows);
});

router.patch('/:id/status', auth, async (req, res) => {
  const { status } = req.body;
  if (!['new', 'contacted', 'closed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  await pool.query('UPDATE leads SET status = ? WHERE id = ?', [status, req.params.id]);
  res.json({ message: 'Status updated' });
});

router.delete('/:id', auth, async (req, res) => {
  await pool.query('DELETE FROM leads WHERE id = ?', [req.params.id]);
  res.json({ message: 'Lead deleted' });
});

export default router;