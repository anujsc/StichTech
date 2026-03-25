import { Router } from 'express';
import { isAuthenticated, isAdmin } from '@/middleware/auth';
import {
  adminGetAllCourses,
  adminCreateCourse,
  adminUpdateCourse,
  adminDeleteCourse,
  adminPublishCourse,
  adminUnpublishCourse,
  adminAddModule,
  adminUpdateModule,
  adminDeleteModule,
  adminAddVideo,
  adminUpdateVideo,
  adminDeleteVideo,
  adminToggleFreePreview,
} from '@/controllers/courseController';
import {
  getAdminDashboardStats,
  getAdminStudents,
} from '@/controllers/adminController';
import { getUploadUrl } from '@/controllers/videos.controller';

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

// ─── Module Management ────────────────────────────────────────────────────────
router.post('/courses/:courseId/modules', adminAddModule);
router.put('/courses/:courseId/modules/:moduleId', adminUpdateModule);
router.delete('/courses/:courseId/modules/:moduleId', adminDeleteModule);

// ─── Video Management ─────────────────────────────────────────────────────────
router.get('/videos/upload-url', getUploadUrl);
router.post('/courses/:courseId/modules/:moduleId/videos', adminAddVideo);
router.put('/courses/:courseId/modules/:moduleId/videos/:videoId', adminUpdateVideo);
router.delete('/courses/:courseId/modules/:moduleId/videos/:videoId', adminDeleteVideo);
router.patch('/courses/:courseId/modules/:moduleId/videos/:videoId/preview', adminToggleFreePreview);

// ─── Student Management ───────────────────────────────────────────────────────
router.get('/students', getAdminStudents);

export default router;
