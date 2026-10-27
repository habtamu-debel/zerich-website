import pool from '../../config/db.js';

export async function getModules(req, res) {
  const [rows] = await pool.query('SELECT * FROM training_modules ORDER BY created_at DESC');
  res.json(rows);
}

export async function createModule(req, res) {
  const { title, description, lesson_links } = req.body;
  await pool.query(
    'INSERT INTO training_modules (id, title, description, lesson_links) VALUES (UUID(), ?, ?, ?)',
    [title, description, JSON.stringify(lesson_links)]
  );
  res.json({ success: true });
}

export async function getEnrollments(req, res) {
  const { moduleId } = req.params;
  const [rows] = await pool.query(
    `SELECT e.*, u.full_name, u.email
     FROM enrollments e JOIN users u ON u.id = e.student_id
     WHERE e.module_id = ?`,
    [moduleId]
  );
  res.json(rows);
}