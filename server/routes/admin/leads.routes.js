import { Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { getLeads, updateLeadStatus } from '../../controllers/admin/leads.controller.js';

const router = Router();
router.use(requireAuth, requireRole('admin'));
router.get('/', getLeads);
router.patch('/:id', updateLeadStatus);

export default router;