import pool from '../../config/db.js';

export async function getLeads(req, res) {
  const { status, industry } = req.query;
  let sql = 'SELECT * FROM system_leads WHERE 1=1';
  const params = [];
  if (status) { sql += ' AND status = ?'; params.push(status); }
  if (industry) { sql += ' AND industry = ?'; params.push(industry); }
  sql += ' ORDER BY created_at DESC';
  const [rows] = await pool.query(sql, params);
  res.json(rows);
}

export async function updateLeadStatus(req, res) {
  const { id } = req.params;
  const { status, notes } = req.body;
  await pool.query(
    'UPDATE system_leads SET status = ?, admin_notes = ? WHERE id = ?',
    [status, notes, id]
  );
  res.json({ success: true });
}