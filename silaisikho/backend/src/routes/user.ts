import { Router } from 'express';
import { getProfile, updateProfile, changePin } from '@/controllers/userController';
import { isAuthenticated, verifyCurrentPin } from '@/middleware/index';

const router = Router();

// GET  /api/users/profile — returns the authenticated user's profile
router.get('/profile', isAuthenticated, getProfile);

// PATCH /api/users/profile — updates name and/or profilePicUrl
router.patch('/profile', isAuthenticated, updateProfile);

// PATCH /api/users/change-pin — verifies current PIN then updates to new PIN
router.patch('/change-pin', isAuthenticated, verifyCurrentPin, changePin);

export default router;
