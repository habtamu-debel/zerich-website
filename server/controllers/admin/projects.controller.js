import pool from '../../config/db.js';

export async function getProjects(req, res) {
  const [rows] = await pool.query(`
    SELECT cp.*, u.full_name AS client_name
    FROM client_projects cp
    JOIN users u ON u.id = cp.client_id
    ORDER BY cp.created_at DESC
  `);
  res.json(rows);
}

export async function updateProject(req, res) {
  const { id } = req.params;
  const { stage, staging_url, lead_engineer, deployment_date } = req.body;
  await pool.query(
    `UPDATE client_projects
     SET stage = ?, staging_url = ?, lead_engineer = ?, deployment_date = ?
     WHERE id = ?`,
    [stage, staging_url, lead_engineer, deployment_date, id]
  );
  res.json({ success: true });
}