import { Router } from 'express';
import { register, login, refresh, logout } from '@/controllers/authController';
import { isAuthenticated } from '@/middleware/index';

const router = Router();

// POST /api/auth/register — public
router.post('/register', register);

// POST /api/auth/login — public, Passport invoked manually inside controller
router.post('/login', login);

// POST /api/auth/refresh — public, refresh token validated inside controller
router.post('/refresh', refresh);

// POST /api/auth/logout — protected, req.user needed for tokenVersion increment
router.post('/logout', isAuthenticated, logout);

export default router;
