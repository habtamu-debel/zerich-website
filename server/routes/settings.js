import { Router } from 'express';
import pool from '../config/db.js';
import auth from '../middleware/auth.js';

const router = Router();

// Public: returns { stats_projects: '100+', ... }
router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT setting_key, setting_value FROM settings');
  res.json(Object.fromEntries(rows.map((r) => [r.setting_key, r.setting_value])));
});

// Admin: body is { key: value, ... }
router.put('/', auth, async (req, res) => {
  const entries = Object.entries(req.body || {});
  for (const [key, value] of entries) {
    await pool.query(
      `INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
      [key, String(value)]
    );
  }
  res.json({ message: 'Settings saved' });
});

export default router;