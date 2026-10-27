import { Router } from 'express';
import pool from '../config/db.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = Router();
const toBool = (v) => (v === '1' || v === 'true' || v === true || v === 1 ? 1 : 0);

// Public: ?featured=1 for home page
router.get('/', async (req, res) => {
  const where = req.query.featured === '1' ? 'WHERE is_featured = 1' : '';
  const [rows] = await pool.query(
    `SELECT * FROM projects ${where} ORDER BY sort_order, id DESC`
  );
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ message: 'Project not found' });
  res.json(rows[0]);
});

router.post('/', auth, upload.single('image'), async (req, res) => {
  const { title, category, description, link, is_featured, sort_order } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });

  const image = req.file ? `/uploads/${req.file.filename}` : null;
  const [r] = await pool.query(
    `INSERT INTO projects (title, category, description, image, link, is_featured, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [title, category || null, description || null, image, link || null,
     toBool(is_featured), sort_order || 0]
  );
  res.status(201).json({ id: r.insertId });
});

router.put('/:id', auth, upload.single('image'), async (req, res) => {
  const { title, category, description, link, is_featured, sort_order } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });

  const image = req.file ? `/uploads/${req.file.filename}` : null;
  await pool.query(
    `UPDATE projects SET title=?, category=?, description=?, image=COALESCE(?, image),
     link=?, is_featured=?, sort_order=? WHERE id=?`,
    [title, category || null, description || null, image, link || null,
     toBool(is_featured), sort_order || 0, req.params.id]
  );
  res.json({ message: 'Project updated' });
});

router.delete('/:id', auth, async (req, res) => {
  await pool.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
  res.json({ message: 'Project deleted' });
});

export default router;