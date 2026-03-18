import { Router } from 'express';
import { createAdmin } from '@/controllers/userController';
import { isAuthenticated, isAdmin } from '@/middleware/index';

const router = Router();

// POST /api/admin/users — creates a new admin account (admin only)
router.post('/users', isAuthenticated, isAdmin, createAdmin);

export default router;
