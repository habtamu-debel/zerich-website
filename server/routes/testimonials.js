import { Router } from 'express';
import pool from '../config/db.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = Router();
const toBool = (v) => (v === '0' || v === 'false' || v === false || v === 0 ? 0 : 1);

router.get('/', async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM testimonials WHERE is_active = 1 ORDER BY id DESC'
  );
  res.json(rows);
});

router.get('/admin/all', auth, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM testimonials ORDER BY id DESC');
  res.json(rows);
});

router.post('/', auth, upload.single('photo'), async (req, res) => {
  const { name, role, company, message, rating, is_active } = req.body;
  if (!name || !message) return res.status(400).json({ message: 'Name and message are required' });

  const photo = req.file ? `/uploads/${req.file.filename}` : null;
  const [r] = await pool.query(
    `INSERT INTO testimonials (name, role, company, message, rating, photo, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, role || null, company || null, message,
     Math.min(5, Math.max(1, Number(rating) || 5)), photo, toBool(is_active)]
  );
  res.status(201).json({ id: r.insertId });
});

router.put('/:id', auth, upload.single('photo'), async (req, res) => {
  const { name, role, company, message, rating, is_active } = req.body;
  if (!name || !message) return res.status(400).json({ message: 'Name and message are required' });

  const photo = req.file ? `/uploads/${req.file.filename}` : null;
  await pool.query(
    `UPDATE testimonials SET name=?, role=?, company=?, message=?, rating=?,
     photo=COALESCE(?, photo), is_active=? WHERE id=?`,
    [name, role || null, company || null, message,
     Math.min(5, Math.max(1, Number(rating) || 5)), photo, toBool(is_active), req.params.id]
  );
  res.json({ message: 'Testimonial updated' });
});

router.delete('/:id', auth, async (req, res) => {
  await pool.query('DELETE FROM testimonials WHERE id = ?', [req.params.id]);
  res.json({ message: 'Testimonial deleted' });
});

export default router;