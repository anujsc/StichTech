import type { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '@/middleware/asyncHandler';
import { sendSuccess, sendError, sendPaginatedSuccess } from '@/utils/response';
import Course from '@/models/Course';
import type { ICourseDocument } from '@/models/Course';
import { z } from 'zod';
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


// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN COURSE CONTROLLERS
// ═══════════════════════════════════════════════════════════════════════════════

import Enrollment from '@/models/Enrollment';
import {
  adminListQuerySchema,
  adminCreateCourseSchema,
  adminUpdateCourseSchema,
  adminCourseIdParamSchema,
  adminAddModuleSchema,
  adminUpdateModuleSchema,
  adminAddVideoSchema,
  adminUpdateVideoSchema,
  adminModuleVideoParamSchema,
  adminVideoParamSchema,
} from '@/validators/courseValidators';

// ─── adminGetAllCourses ───────────────────────────────────────────────────────
/**
 * GET /api/admin/courses
 * Admin endpoint — returns paginated list of all courses with filtering.
 * Shows all non-deleted courses by default.
 */

export const adminGetAllCourses = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Validate query parameters
    const validation = adminListQuerySchema.safeParse(req.query);
    
    if (!validation.success) {
      const errors = validation.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      sendError(res, 'Invalid query parameters — गलत query parameters', 400, errors);
      return;
    }

    const { page, limit, status, search } = validation.data;

    // Build filter object
    const filter: Record<string, unknown> = {
      isDeleted: false,
    };

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Query database with instructor populated
    const courses = await Course.find(filter)
      .populate('instructor', 'name email profilePicUrl')
      .sort({ createdAt: -1 })
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

// ─── adminCreateCourse ────────────────────────────────────────────────────────
/**
 * POST /api/admin/courses
 * Admin endpoint — creates a new course (starts as draft with empty modules).
 */

export const adminCreateCourse = asyncHandler( 
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Validate body
    const validation = adminCreateCourseSchema.safeParse(req.body);
    
    if (!validation.success) {
      const errors = validation.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      sendError(res, 'Invalid course data — गलत course डेटा', 400, errors);
      return;
    }

    const { title, description, price, discountedPrice, language, level, thumbnailColour } = validation.data;

    // Create new course
    const course = await Course.create({
      title,
      description,
      price,
      discountedPrice,
      language,
      level,
      thumbnailColour,
      instructor: (req.user as any)._id,
      status: 'draft',
      modules: [],
    });

    sendSuccess(
      res,
      course,
      'Course created successfully — कोर्स बन गया',
      201
    );
  }
);

// ─── adminUpdateCourse ────────────────────────────────────────────────────────
/**
 * PUT /api/admin/courses/:id
 * Admin endpoint — updates course details.
 * If title is updated, slug is regenerated automatically by pre-save middleware.
 */

export const adminUpdateCourse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Validate params
    const paramsValidation = adminCourseIdParamSchema.safeParse(req.params);
    
    if (!paramsValidation.success) {
      sendError(res, 'Invalid course ID format — गलत course ID', 400);
      return;
    }

    // Validate body
    const bodyValidation = adminUpdateCourseSchema.safeParse(req.body);
    
    if (!bodyValidation.success) {
      const errors = bodyValidation.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      sendError(res, 'Invalid course data — गलत course डेटा', 400, errors);
      return;
    }

    const { id } = paramsValidation.data;
    const updateData = bodyValidation.data;

    // Find course
    const course = await Course.findById(id);

    if (!course) {
      sendError(res, 'Course not found — कोर्स नहीं मिला', 404);
      return;
    }

    // Update fields
    if (updateData.title !== undefined) course.title = updateData.title;
    if (updateData.description !== undefined) course.description = updateData.description;
    if (updateData.price !== undefined) course.price = updateData.price;
    if (updateData.discountedPrice !== undefined) {
      course.discountedPrice = updateData.discountedPrice === null ? undefined : updateData.discountedPrice;
    }
    if (updateData.language !== undefined) course.language = updateData.language;
    if (updateData.level !== undefined) course.level = updateData.level;
    if (updateData.thumbnailColour !== undefined) course.thumbnailColour = updateData.thumbnailColour;
    if (updateData.status !== undefined) course.status = updateData.status;

    // Validate discountedPrice < price if both are present
    if (course.discountedPrice !== undefined && course.discountedPrice >= course.price) {
      sendError(
        res,
        'Discounted price must be less than regular price — डिस्काउंट कीमत मूल कीमत से कम होनी चाहिए',
        400
      );
      return;
    }

    // Save (pre-save middleware will regenerate slug if title changed)
    await course.save();

    sendSuccess(res, course, 'Course updated successfully — कोर्स अपडेट हो गया');
  }
);

// ─── adminDeleteCourse ────────────────────────────────────────────────────────
/**
 * DELETE /api/admin/courses/:id
 * Admin endpoint — deletes a course.
 * Soft delete if enrollments exist, hard delete otherwise.
 */

export const adminDeleteCourse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Validate params
    const validation = adminCourseIdParamSchema.safeParse(req.params);
    
    if (!validation.success) {
      sendError(res, 'Invalid course ID format — गलत course ID', 400);
      return;
    }

    const { id } = validation.data;

    // Find course
    const course = await Course.findById(id);

    if (!course) {
      sendError(res, 'Course not found — कोर्स नहीं मिला', 404);
      return;
    }

    // Check for enrollments
    const enrollmentsCount = await Enrollment.countDocuments({ courseId: course._id });

    if (enrollmentsCount > 0) {
      // Soft delete
      course.isDeleted = true;
      course.status = 'draft'; // Set to draft instead of 'archived' since status enum doesn't include archived
      await course.save();

      sendSuccess(
        res,
        { deletedCount: 0, softDeleted: true },
        `Course soft deleted (${enrollmentsCount} enrollments exist) — कोर्स soft delete हो गया (${enrollmentsCount} enrollments हैं)`
      );
    } else {
      // Hard delete
      await Course.findByIdAndDelete(id);

      sendSuccess(
        res,
        { deletedCount: 1, softDeleted: false },
        'Course permanently deleted — कोर्स permanently delete हो गया'
      );
    }
  }
);

// ─── adminPublishCourse ───────────────────────────────────────────────────────
/**
 * PATCH /api/admin/courses/:id/publish
 * Admin endpoint — publishes a course.
 * Requires at least one video to be present.
 */

export const adminPublishCourse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Validate params
    const validation = adminCourseIdParamSchema.safeParse(req.params);
    
    if (!validation.success) {
      sendError(res, 'Invalid course ID format — गलत course ID', 400);
      return;
    }

    const { id } = validation.data;

    // Find course
    const course = await Course.findById(id);

    if (!course) {
      sendError(res, 'Course not found — कोर्स नहीं मिला', 404);
      return;
    }

    // Check if course has at least one video
    if (course.totalVideos === 0) {
      sendError(
        res,
        'Cannot publish a course with no videos — बिना वीडियो के कोर्स publish नहीं हो सकता',
        400
      );
      return;
    }

    // Publish course
    course.status = 'published';
    await course.save();

    sendSuccess(res, course, 'Course published successfully — कोर्स publish हो गया');
  }
);

// ─── adminUnpublishCourse ─────────────────────────────────────────────────────
/**
 * PATCH /api/admin/courses/:id/unpublish
 * Admin endpoint — unpublishes a course (sets to draft).
 */

export const adminUnpublishCourse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Validate params
    const validation = adminCourseIdParamSchema.safeParse(req.params);
    
    if (!validation.success) {
      sendError(res, 'Invalid course ID format — गलत course ID', 400);
      return;
    }

    const { id } = validation.data;

    // Find course
    const course = await Course.findById(id);

    if (!course) {
      sendError(res, 'Course not found — कोर्स नहीं मिला', 404);
      return;
    }

    // Unpublish course
    course.status = 'draft';
    await course.save();

    sendSuccess(res, course, 'Course unpublished successfully — कोर्स unpublish हो गया');
  }
);


// ═══════════════════════════════════════════════════════════════════════════════
// MODULE CONTROLLERS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── adminAddModule ───────────────────────────────────────────────────────────
/**
 * POST /api/admin/courses/:courseId/modules
 * Admin endpoint — adds a new module to a course.
 */

export const adminAddModule = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Validate params
    const paramsValidation = adminModuleVideoParamSchema.safeParse(req.params);
    
    if (!paramsValidation.success) {
      sendError(res, 'Invalid parameters — गलत parameters', 400);
      return;
    }

    // Validate body
    const bodyValidation = adminAddModuleSchema.safeParse(req.body);
    
    if (!bodyValidation.success) {
      const errors = bodyValidation.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      sendError(res, 'Invalid module data — गलत module डेटा', 400, errors);
      return;
    }

    const { courseId } = paramsValidation.data;
    const { title, sortOrder } = bodyValidation.data;

    // Find course
    const course = await Course.findById(courseId);

    if (!course) {
      sendError(res, 'Course not found — कोर्स नहीं मिला', 404);
      return;
    }

    // Create new module
    const newModule = {
      title,
      sortOrder,
      videos: [],
    };

    // Push to modules array
    course.modules.push(newModule as any);

    // Save course (pre-save middleware will recalculate totals)
    await course.save();

    sendSuccess(res, course, 'Module added successfully — मॉड्यूल जोड़ा गया', 201);
  }
);

// ─── adminUpdateModule ────────────────────────────────────────────────────────
/**
 * PUT /api/admin/courses/:courseId/modules/:moduleId
 * Admin endpoint — updates module title or sort order.
 */

export const adminUpdateModule = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Validate params
    const paramsValidation = adminModuleVideoParamSchema.safeParse(req.params);
    
    if (!paramsValidation.success) {
      sendError(res, 'Invalid parameters — गलत parameters', 400);
      return;
    }

    // Validate body
    const bodyValidation = adminUpdateModuleSchema.safeParse(req.body);
    
    if (!bodyValidation.success) {
      const errors = bodyValidation.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      sendError(res, 'Invalid module data — गलत module डेटा', 400, errors);
      return;
    }

    const { courseId, moduleId } = paramsValidation.data;
    const updateData = bodyValidation.data;

    // Find course
    const course = await Course.findById(courseId);

    if (!course) {
      sendError(res, 'Course not found — कोर्स नहीं मिला', 404);
      return;
    }

    // Find module
    const module = course.modules.id(moduleId);

    if (!module) {
      sendError(res, 'Module not found — मॉड्यूल नहीं मिला', 404);
      return;
    }

    // Update fields
    if (updateData.title !== undefined) module.title = updateData.title;
    if (updateData.sortOrder !== undefined) module.sortOrder = updateData.sortOrder;

    // Save course
    await course.save();

    sendSuccess(res, course, 'Module updated successfully — मॉड्यूल अपडेट हो गया');
  }
);

// ─── adminDeleteModule ────────────────────────────────────────────────────────
/**
 * DELETE /api/admin/courses/:courseId/modules/:moduleId
 * Admin endpoint — deletes a module (only if it has no videos).
 */

export const adminDeleteModule = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Validate params
    const paramsValidation = adminModuleVideoParamSchema.safeParse(req.params);
    
    if (!paramsValidation.success) {
      sendError(res, 'Invalid parameters — गलत parameters', 400);
      return;
    }

    const { courseId, moduleId } = paramsValidation.data;

    // Find course
    const course = await Course.findById(courseId);

    if (!course) {
      sendError(res, 'Course not found — कोर्स नहीं मिला', 404);
      return;
    }

    // Find module
    const module = course.modules.id(moduleId);

    if (!module) {
      sendError(res, 'Module not found — मॉड्यूल नहीं मिला', 404);
      return;
    }

    // Check if module has videos
    if (module.videos.length > 0) {
      sendError(
        res,
        'Cannot delete module with videos — वीडियो वाले module को नहीं हटा सकते',
        400
      );
      return;
    }

    // Remove module
    course.modules.pull(moduleId);

    // Save course
    await course.save();

    sendSuccess(res, course, 'Module deleted successfully — मॉड्यूल हटा दिया गया');
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
// VIDEO CONTROLLERS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── adminAddVideo ────────────────────────────────────────────────────────────
/**
 * POST /api/admin/courses/:courseId/modules/:moduleId/videos
 * Admin endpoint — adds a new video to a module.
 * cloudinaryPublicId and durationSeconds are set to empty/zero initially.
 */

export const adminAddVideo = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Validate params
    const paramsValidation = adminModuleVideoParamSchema.safeParse(req.params);
    
    if (!paramsValidation.success) {
      sendError(res, 'Invalid parameters — गलत parameters', 400);
      return;
    }

    // Validate body
    const bodyValidation = adminAddVideoSchema.safeParse(req.body);
    
    if (!bodyValidation.success) {
      const errors = bodyValidation.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      sendError(res, 'Invalid video data — गलत video डेटा', 400, errors);
      return;
    }

    const { courseId, moduleId } = paramsValidation.data;
    const { title, description, sortOrder, isFreePreview } = bodyValidation.data;

    // Find course
    const course = await Course.findById(courseId);

    if (!course) {
      sendError(res, 'Course not found — कोर्स नहीं मिला', 404);
      return;
    }

    // Find module
    const module = course.modules.id(moduleId);

    if (!module) {
      sendError(res, 'Module not found — मॉड्यूल नहीं मिला', 404);
      return;
    }

    // Create new video
    const newVideo = {
      title,
      description: description || '',
      sortOrder,
      isFreePreview: isFreePreview || false,
      cloudinaryPublicId: '',
      durationSeconds: 0,
    };

    // Push to videos array
    module.videos.push(newVideo as any);

    // Save course (pre-save middleware will recalculate totals)
    await course.save();

    sendSuccess(res, course, 'Video added successfully — वीडियो जोड़ा गया', 201);
  }
);

// ─── adminUpdateVideo ────────────────────────────────────────────────────────
/**
 * PUT /api/admin/courses/:courseId/modules/:moduleId/videos/:videoId
 * Admin endpoint — updates video metadata (title, description, sortOrder, isFreePreview).
 * cloudinaryPublicId and durationSeconds cannot be modified (reserved for webhook).
 */

export const adminUpdateVideo = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Validate params
    const paramsValidation = adminVideoParamSchema.safeParse(req.params);
    
    if (!paramsValidation.success) {
      sendError(res, 'Invalid parameters — गलत parameters', 400);
      return;
    }

    // Validate body
    const bodyValidation = adminUpdateVideoSchema.safeParse(req.body);
    
    if (!bodyValidation.success) {
      const errors = bodyValidation.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      sendError(res, 'Invalid video data — गलत video डेटा', 400, errors);
      return;
    }

    const { courseId, moduleId, videoId } = paramsValidation.data;
    const updateData = bodyValidation.data;

    // Find course
    const course = await Course.findById(courseId);

    if (!course) {
      sendError(res, 'Course not found — कोर्स नहीं मिला', 404);
      return;
    }

    // Find module
    const module = course.modules.id(moduleId);

    if (!module) {
      sendError(res, 'Module not found — मॉड्यूल नहीं मिला', 404);
      return;
    }

    // Find video
    const video = module.videos.id(videoId);

    if (!video) {
      sendError(res, 'Video not found — वीडियो नहीं मिला', 404);
      return;
    }

    // Update allowed fields
    if (updateData.title !== undefined) video.title = updateData.title;
    if (updateData.description !== undefined) video.description = updateData.description;
    if (updateData.sortOrder !== undefined) video.sortOrder = updateData.sortOrder;
    if (updateData.isFreePreview !== undefined) video.isFreePreview = updateData.isFreePreview;

    // Save course
    await course.save();

    sendSuccess(res, course, 'Video updated successfully — वीडियो अपडेट हो गया');
  }
);

// ─── adminDeleteVideo ────────────────────────────────────────────────────────
/**
 * DELETE /api/admin/courses/:courseId/modules/:moduleId/videos/:videoId
 * Admin endpoint — deletes a video from a module.
 */

export const adminDeleteVideo = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Validate params
    const paramsValidation = adminVideoParamSchema.safeParse(req.params);
    
    if (!paramsValidation.success) {
      sendError(res, 'Invalid parameters — गलत parameters', 400);
      return;
    }

    const { courseId, moduleId, videoId } = paramsValidation.data;

    // Find course
    const course = await Course.findById(courseId);

    if (!course) {
      sendError(res, 'Course not found — कोर्स नहीं मिला', 404);
      return;
    }

    // Find module
    const module = course.modules.id(moduleId);

    if (!module) {
      sendError(res, 'Module not found — मॉड्यूल नहीं मिला', 404);
      return;
    }

    // Find video
    const video = module.videos.id(videoId);

    if (!video) {
      sendError(res, 'Video not found — वीडियो नहीं मिला', 404);
      return;
    }

    // Remove video
    module.videos.pull(videoId);

    // Save course
    await course.save();

    sendSuccess(res, course, 'Video deleted successfully — वीडियो हटा दिया गया');
  }
);

// ─── adminToggleFreePreview ───────────────────────────────────────────────────
/**
 * PATCH /api/admin/courses/:courseId/modules/:moduleId/videos/:videoId/preview
 * Admin endpoint — toggles the free preview flag on a video.
 */

export const adminToggleFreePreview = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Validate params
    const paramsValidation = adminVideoParamSchema.safeParse(req.params);
    
    if (!paramsValidation.success) {
      sendError(res, 'Invalid parameters — गलत parameters', 400);
      return;
    }

    const { courseId, moduleId, videoId } = paramsValidation.data;

    // Find course
    const course = await Course.findById(courseId);

    if (!course) {
      sendError(res, 'Course not found — कोर्स नहीं मिला', 404);
      return;
    }

    // Find module
    const module = course.modules.id(moduleId);

    if (!module) {
      sendError(res, 'Module not found — मॉड्यूल नहीं मिला', 404);
      return;
    }

    // Find video
    const video = module.videos.id(videoId);

    if (!video) {
      sendError(res, 'Video not found — वीडियो नहीं मिला', 404);
      return;
    }

    // Toggle free preview flag
    video.isFreePreview = !video.isFreePreview;

    // Save course
    await course.save();

    sendSuccess(res, { video }, 'Free preview toggled successfully — फ्री प्रीव्यू toggle हो गया');
  }
);
