import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './config/db.js';

import authRoutes from './routes/auth.js';
import serviceRoutes from './routes/services.js';
import projectRoutes from './routes/projects.js';
import testimonialRoutes from './routes/testimonials.js';
import leadRoutes from './routes/leads.js';
import settingRoutes from './routes/settings.js';

import leadsRouter from './routes/admin/leads.routes.js';
import projectsRouter from './routes/admin/projects.routes.js';
import trainingRouter from './routes/admin/training.routes.js';
import statsRouter from './routes/admin/stats.routes.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/admin/leads', leadsRouter);
app.use('/api/admin/projects', projectsRouter);
app.use('/api/admin/training', trainingRouter);
app.use('/api/admin/stats', statsRouter);

app.use('/api', (req, res) => res.status(404).json({ message: 'Route not found' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));