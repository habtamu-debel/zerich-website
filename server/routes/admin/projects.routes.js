import { Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import {
  getProjects, createProject, updateProject, deleteProject,
} from '../../controllers/admin/projects.controller.js';

const router = Router();
router.use(requireAuth, requireRole('admin'));
router.get('/', getProjects);
router.post('/', createProject);
router.patch('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;