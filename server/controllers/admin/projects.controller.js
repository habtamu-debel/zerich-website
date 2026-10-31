import pool from '../../config/db.js';

const STAGES = [
  'Discovery & Requirements',
  'System Architecture',
  'Full-Stack Development',
  'UAT & Testing',
  'Deployment',
];

// DATE_FORMAT avoids the timezone-shift bug with DATE columns
const COLS = `id, name, client_name, client_user_id, description, stage, staging_url, lead_engineer,
  DATE_FORMAT(deployment_date, '%Y-%m-%d') AS deployment_date, created_at`;

function clean(b) {
  return {
    name: b.name?.trim(),
    client_name: b.client_name?.trim(),
    description: b.description?.trim() || null,
    stage: b.stage || STAGES[0],
    staging_url: b.staging_url?.trim() || null,
    lead_engineer: b.lead_engineer?.trim() || null,
    deployment_date: b.deployment_date || null,
  };
}

function validate(p) {
  if (!p.name) return 'Project name is required';
  if (!p.client_name) return 'Client name is required';
  if (!STAGES.includes(p.stage)) return 'Invalid stage';
  if (p.staging_url && !/^https?:\/\//i.test(p.staging_url)) {
    return 'Staging URL must start with http:// or https://';
  }
  return null;
}

export async function getProjects(req, res) {
  try {
    const [rows] = await pool.query(`SELECT ${COLS} FROM client_projects ORDER BY created_at DESC`);
    res.json(rows);
  } catch (err) {
    console.error('getProjects:', err.message);
    res.status(500).json({ message: err.message });
  }
}

export async function createProject(req, res) {
  try {
    const p = clean(req.body);
    const problem = validate(p);
    if (problem) return res.status(400).json({ message: problem });

    const [result] = await pool.query(
      `INSERT INTO client_projects
       (name, client_name, description, stage, staging_url, lead_engineer, deployment_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [p.name, p.client_name, p.description, p.stage, p.staging_url, p.lead_engineer, p.deployment_date]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error('createProject:', err.message);
    res.status(500).json({ message: err.message });
  }
}

export async function updateProject(req, res) {
  try {
    const p = clean(req.body);
    const problem = validate(p);
    if (problem) return res.status(400).json({ message: problem });

    const [result] = await pool.query(
      `UPDATE client_projects
       SET name = ?, client_name = ?, description = ?, stage = ?,
           staging_url = ?, lead_engineer = ?, deployment_date = ?
       WHERE id = ?`,
      [p.name, p.client_name, p.description, p.stage, p.staging_url, p.lead_engineer, p.deployment_date, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ message: 'Project not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('updateProject:', err.message);
    res.status(500).json({ message: err.message });
  }
}

export async function deleteProject(req, res) {
  try {
    await pool.query('DELETE FROM client_projects WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('deleteProject:', err.message);
    res.status(500).json({ message: err.message });
  }
}