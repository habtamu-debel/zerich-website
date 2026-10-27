import { Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { getProjects, updateProject } from '../../controllers/admin/projects.controller.js';

const router = Router();
router.use(requireAuth, requireRole('admin'));
router.get('/', getProjects);
router.patch('/:id', updateProject);

export default router;