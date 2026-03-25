import { Router } from 'express';
import { isAuthenticated, isAdmin } from '@/middleware/auth';
import {
  adminGetAllCourses,
  adminCreateCourse,
  adminUpdateCourse,
  adminDeleteCourse,
  adminPublishCourse,
  adminUnpublishCourse,
} from '@/controllers/courseController';
import {
  getAdminDashboardStats,
  getAdminStudents,
} from '@/controllers/adminController';

const router = Router();

// Apply authentication and admin middleware to all routes
router.use(isAuthenticated, isAdmin);

// ─── Dashboard ────────────────────────────────────────────────────────────────
router.get('/dashboard', getAdminDashboardStats);

// ─── Course Management ────────────────────────────────────────────────────────
router.get('/courses', adminGetAllCourses);
router.post('/courses', adminCreateCourse);
router.put('/courses/:id', adminUpdateCourse);
router.delete('/courses/:id', adminDeleteCourse);
router.patch('/courses/:id/publish', adminPublishCourse);
router.patch('/courses/:id/unpublish', adminUnpublishCourse);

// ─── Student Management ───────────────────────────────────────────────────────
router.get('/students', getAdminStudents);

export default router;
