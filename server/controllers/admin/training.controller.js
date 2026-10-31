import pool from '../../config/db.js';

const parseLinks = (v) => {
  if (Array.isArray(v)) return v;
  try { return JSON.parse(v || '[]'); } catch { return []; }
};

export async function getModules(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT m.*,
              (SELECT COUNT(*) FROM enrollments e WHERE e.module_id = m.id) AS enrolled
       FROM training_modules m
       ORDER BY m.created_at DESC`
    );
    res.json(rows.map((m) => ({ ...m, lesson_links: parseLinks(m.lesson_links) })));
  } catch (err) {
    console.error('getModules:', err.message);
    res.status(500).json({ message: err.message });
  }
}

export async function createModule(req, res) {
  try {
    const { title, description, lesson_links } = req.body;
    if (!title?.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }
    const links = Array.isArray(lesson_links)
      ? lesson_links.map((l) => String(l).trim()).filter(Boolean)
      : [];

    await pool.query(
      'INSERT INTO training_modules (id, title, description, lesson_links) VALUES (UUID(), ?, ?, ?)',
      [title.trim(), description?.trim() || null, JSON.stringify(links)]
    );
    res.status(201).json({ success: true });
  } catch (err) {
    console.error('createModule:', err.message);
    res.status(500).json({ message: err.message });
  }
}

export async function getEnrollments(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT e.*, u.name AS full_name, u.email
       FROM enrollments e
       JOIN users u ON u.id = e.student_id
       WHERE e.module_id = ?
       ORDER BY e.enrolled_at DESC`,
      [req.params.moduleId]
    );
    res.json(rows);
  } catch (err) {
    console.error('getEnrollments:', err.message);
    res.status(500).json({ message: err.message });
  }
}