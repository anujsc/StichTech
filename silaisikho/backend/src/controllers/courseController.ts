import type { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '@/middleware/asyncHandler';
import { sendSuccess, sendError, sendPaginatedSuccess } from '@/utils/response';
import Course from '@/models/Course';
import type { ICourseDocument } from '@/models/Course';
import {
  courseListQuerySchema,
  courseSearchQuerySchema,
  courseByIdParamsSchema,
  courseBySlugParamsSchema,
} from '@/validators/courseValidators';

// ─── getAllCourses ────────────────────────────────────────────────────────────
/**
 * GET /api/courses
 * Public endpoint — returns paginated list of published courses with filtering and sorting.
 * Excludes the modules array for performance (catalog view doesn't need full course content).
 */

export const getAllCourses = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Validate query parameters
    const validation = courseListQuerySchema.safeParse(req.query);
    
    if (!validation.success) {
      const errors = validation.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      sendError(res, 'Invalid query parameters — गलत query parameters', 400, errors);
      return;
    }

    const { page, limit, level, language, sort, search } = validation.data;

    // Build filter object
    const filter: Record<string, unknown> = {
      status: 'published',
      isDeleted: false,
    };

    if (level) {
      filter.level = level;
    }

    if (language) {
      filter.language = language;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    // Determine sort option
    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    
    // When using text search, MongoDB returns results sorted by relevance score
    // We ignore the sort parameter when search is present for better UX
    if (!search) {
      switch (sort) {
        case 'price-asc':
          sortOption = { price: 1 };
          break;
        case 'price-desc':
          sortOption = { price: -1 };
          break;
        case 'newest':
        default:
          sortOption = { createdAt: -1 };
          break;
      }
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Query database
    // Exclude modules array for performance — catalog only needs summary data
    const courses = await Course.find(filter)
      .select('-modules')
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    // Count total documents matching filter
    const total = await Course.countDocuments(filter);

    sendPaginatedSuccess(
      res,
      courses,
      'Courses retrieved successfully — कोर्स मिल गए',
      total,
      page,
      limit
    );
  }
);

// ─── getCourseBySlug ──────────────────────────────────────────────────────────
/**
 * GET /api/courses/:slug
 * Public endpoint — returns full course detail by URL slug.
 * Populates instructor and filters out cloudinaryPublicId from non-preview videos.
 */

export const getCourseBySlug = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Validate params
    const validation = courseBySlugParamsSchema.safeParse(req.params);
    
    if (!validation.success) {
      sendError(res, 'Invalid slug format — गलत slug', 400);
      return;
    }

    const { slug } = validation.data;

    // Use static method which already filters by published status and populates instructor
    const course = await Course.findBySlug(slug);

    if (!course) {
      sendError(res, 'Course not found — कोर्स नहीं मिला', 404);
      return;
    }

    // Transform course to hide cloudinaryPublicId from non-preview videos
    const courseObj = course.toObject();

    courseObj.modules = courseObj.modules.map((module: any) => ({
      ...module,
      videos: module.videos.map((video: any) => {
        // If video is not a free preview, remove cloudinaryPublicId
        if (!video.isFreePreview) {
          const { cloudinaryPublicId, ...videoWithoutPublicId } = video;
          return videoWithoutPublicId;
        }
        return video;
      }),
    }));

    sendSuccess(res, courseObj, 'Course retrieved successfully — कोर्स मिल गया');
  }
);

// ─── getCourseById ────────────────────────────────────────────────────────────
/**
 * GET /api/courses/id/:id
 * Protected endpoint (admin only) — returns full course detail by ID.
 * Used for admin preview of draft courses.
 * Does NOT filter out cloudinaryPublicId (admin needs full access).
 */

export const getCourseById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Validate params
    const validation = courseByIdParamsSchema.safeParse(req.params);
    
    if (!validation.success) {
      sendError(res, 'Invalid course ID format — गलत course ID', 400);
      return;
    }

    const { id } = validation.data;

    // Use static method which ignores status/deleted filters and populates instructor
    const course = await Course.adminFindById(id);

    if (!course) {
      sendError(res, 'Course not found — कोर्स नहीं मिला', 404);
      return;
    }

    // Return full course without filtering (admin access)
    sendSuccess(res, course, 'Course retrieved successfully — कोर्स मिल गया');
  }
);

// ─── searchCourses ────────────────────────────────────────────────────────────
/**
 * GET /api/courses/search
 * Public endpoint — text search across course titles and descriptions.
 * Returns paginated results with optional filtering.
 */

export const searchCourses = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Validate query parameters
    const validation = courseSearchQuerySchema.safeParse(req.query);
    
    if (!validation.success) {
      const errors = validation.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      sendError(res, 'Invalid search parameters — गलत search parameters', 400, errors);
      return;
    }

    const { q, page, limit, level, language, sort } = validation.data;

    // Build filter object with text search
    const filter: Record<string, unknown> = {
      status: 'published',
      isDeleted: false,
      $text: { $search: q },
    };

    if (level) {
      filter.level = level;
    }

    if (language) {
      filter.language = language;
    }

    // For text search, MongoDB returns results sorted by relevance score by default
    // We can optionally apply user's sort preference, but relevance is usually better
    let sortOption: Record<string, 1 | -1> = { score: { $meta: 'textScore' } as unknown as 1 };
    
    // If user explicitly wants price sorting, apply it
    if (sort === 'price-asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price-desc') {
      sortOption = { price: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Query database
    const courses = await Course.find(filter)
      .select('-modules')
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    // Count total documents matching filter
    const total = await Course.countDocuments(filter);

    sendPaginatedSuccess(
      res,
      courses,
      'Search results retrieved successfully — खोज के नतीजे मिल गए',
      total,
      page,
      limit
    );
  }
);
