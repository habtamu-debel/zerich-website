import pool from '../../config/db.js';

const STATUSES = ['new', 'contacted', 'qualified', 'closed'];

export async function getLeads(req, res) {
  const { status, service } = req.query;
  let sql = 'SELECT id, name, email, phone, service, message, status, admin_notes, created_at FROM leads WHERE 1=1';
  const params = [];
  if (status) { sql += ' AND status = ?'; params.push(status); }
  if (service) { sql += ' AND service LIKE ?'; params.push(`%${service}%`); }
  sql += ' ORDER BY created_at DESC';
  const [rows] = await pool.query(sql, params);
  res.json(rows);
}

export async function updateLeadStatus(req, res) {
  const { id } = req.params;
  const { status, notes } = req.body;
  if (!STATUSES.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  await pool.query('UPDATE leads SET status = ?, admin_notes = ? WHERE id = ?', [status, notes || null, id]);
  res.json({ success: true });
}