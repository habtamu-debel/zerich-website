import { Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import pool from '../../config/db.js';

const router = Router();
router.use(requireAuth, requireRole('admin'));

async function safeCount(query) {
  try {
    const [[row]] = await pool.query(query);
    return Number(Object.values(row)[0] ?? 0);
  } catch (err) {
    console.warn('stats query skipped:', err.message);
    return 0;
  }
}

router.get('/', async (req, res) => {
  const [totalLeads, newLeads, weekLeads, totalProjects, totalModules] = await Promise.all([
    safeCount('SELECT COUNT(*) AS v FROM leads'),
    safeCount("SELECT COUNT(*) AS v FROM leads WHERE status = 'new'"),
    safeCount('SELECT COUNT(*) AS v FROM leads WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'),
    safeCount('SELECT COUNT(*) AS v FROM client_projects'),
    safeCount('SELECT COUNT(*) AS v FROM training_modules'),
  ]);
  res.json({ totalLeads, newLeads, weekLeads, totalProjects, totalModules });
});

export default router;