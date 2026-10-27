import { Router } from 'express';
import pool from '../config/db.js';
import auth from '../middleware/auth.js';

const router = Router();

const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Public: active services
router.get('/', async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM services WHERE is_active = 1 ORDER BY sort_order, id'
  );
  res.json(rows);
});

// Admin: all services (must be before /:slug)
router.get('/admin/all', auth, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM services ORDER BY sort_order, id');
  res.json(rows);
});

// Public: one service by slug
router.get('/:slug', async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM services WHERE slug = ? AND is_active = 1',
    [req.params.slug]
  );
  if (!rows[0]) return res.status(404).json({ message: 'Service not found' });
  res.json(rows[0]);
});

router.post('/', auth, async (req, res) => {
  const { title, short_description, description, icon, sort_order, is_active } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });

  const slug = req.body.slug ? slugify(req.body.slug) : slugify(title);
  const [r] = await pool.query(
    `INSERT INTO services (title, slug, short_description, description, icon, sort_order, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [title, slug, short_description || null, description || null, icon || null,
     sort_order || 0, is_active === 0 || is_active === false ? 0 : 1]
  );
  res.status(201).json({ id: r.insertId, slug });
});

router.put('/:id', auth, async (req, res) => {
  const { title, slug, short_description, description, icon, sort_order, is_active } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });

  await pool.query(
    `UPDATE services SET title=?, slug=?, short_description=?, description=?, icon=?,
     sort_order=?, is_active=? WHERE id=?`,
    [title, slugify(slug || title), short_description || null, description || null,
     icon || null, sort_order || 0, is_active === 0 || is_active === false ? 0 : 1, req.params.id]
  );
  res.json({ message: 'Service updated' });
});

router.delete('/:id', auth, async (req, res) => {
  await pool.query('DELETE FROM services WHERE id = ?', [req.params.id]);
  res.json({ message: 'Service deleted' });
});

export default router;