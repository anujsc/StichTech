import { Router } from 'express';
import {
  getAllCourses,
  getCourseBySlug,
  getCourseById,
  searchCourses,
} from '@/controllers/courseController';
import { isAuthenticated, isAdmin } from '@/middleware/auth';

const router = Router();

// ─── Public Routes ────────────────────────────────────────────────────────────

// GET /api/courses — paginated list with filtering and sorting
router.get('/', getAllCourses);

// GET /api/courses/search — text search
router.get('/search', searchCourses);

// GET /api/courses/:slug — course detail by slug
router.get('/:slug', getCourseBySlug);

// ─── Protected Routes (Admin Only) ────────────────────────────────────────────

// GET /api/courses/id/:id — course detail by ID (admin preview)
router.get('/id/:id', isAuthenticated, isAdmin, getCourseById);

export default router;
