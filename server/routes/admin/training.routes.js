import { Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { getModules, createModule, getEnrollments } from '../../controllers/admin/training.controller.js';

const router = Router();
router.use(requireAuth, requireRole('admin'));
router.get('/', getModules);
router.post('/', createModule);
router.get('/:moduleId/enrollments', getEnrollments);

export default router;