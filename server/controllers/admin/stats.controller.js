import pool from '../../config/db.js';

async function count(sql) {
  try {
    const [[row]] = await pool.query(sql);
    return Number(row.c);
  } catch (err) {
    console.warn('stats query skipped:', err.message);
    return 0;
  }
}

export async function getStats(req, res) {
  const [totalLeads, newLeads, leadsThisWeek, activeProjects, trainingModules] = await Promise.all([
    count('SELECT COUNT(*) AS c FROM leads'),
    count("SELECT COUNT(*) AS c FROM leads WHERE status = 'new'"),
    count('SELECT COUNT(*) AS c FROM leads WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'),
    count("SELECT COUNT(*) AS c FROM client_projects WHERE stage <> 'Deployment'"),
    count('SELECT COUNT(*) AS c FROM training_modules'),
  ]);
  res.json({ totalLeads, newLeads, leadsThisWeek, activeProjects, trainingModules });
}