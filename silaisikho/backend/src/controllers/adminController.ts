import type { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '@/middleware/asyncHandler';
import { sendSuccess, sendError, sendPaginatedSuccess } from '@/utils/response';
import Course from '@/models/Course';
import User from '@/models/User';
import Enrollment from '@/models/Enrollment';
import { adminStudentListQuerySchema } from '@/validators/courseValidators';

// ─── getAdminDashboardStats ───────────────────────────────────────────────────
/**
 * GET /api/admin/dashboard
 * Admin endpoint — returns dashboard statistics.
 * Includes: total students, revenue, courses, videos, recent enrollments.
 */

export const getAdminDashboardStats = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // 1. Total Students (unique userIds in Enrollment collection)
    const totalStudents = await Enrollment.distinct('userId').then((ids) => ids.length);

    // 2. Total Revenue (sum of amountPaid across all enrollments)
    const revenueResult = await Enrollment.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$amountPaid' },
        },
      },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // 3. Total Courses (non-deleted courses)
    const totalCourses = await Course.countDocuments({ isDeleted: false });

    // 4. Total Videos (sum of totalVideos across all non-deleted courses)
    const videosResult = await Course.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalVideos' },
        },
      },
    ]);
    const totalVideos = videosResult.length > 0 ? videosResult[0].total : 0;

    // 5. Recent Enrollments (last 10 enrollments with user and course details)
    const recentEnrollments = await Enrollment.find()
      .sort({ enrolledAt: -1 })
      .limit(10)
      .populate('userId', 'name email profilePicUrl')
      .populate('courseId', 'title slug')
      .lean();

    // Return stats
    sendSuccess(
      res,
      {
        totalStudents,
        totalRevenue,
        totalCourses,
        totalVideos,
        recentEnrollments,
      },
      'Dashboard stats retrieved successfully — Dashboard stats मिल गए'
    );
  }
);

// ─── getAdminStudents ─────────────────────────────────────────────────────────
/**
 * GET /api/admin/students
 * Admin endpoint — returns paginated list of students with enrollment stats.
 * Supports search by name or email.
 */

export const getAdminStudents = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Validate query parameters
    const validation = adminStudentListQuerySchema.safeParse(req.query);
    
    if (!validation.success) {
      const errors = validation.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      sendError(res, 'Invalid query parameters — गलत query parameters', 400, errors);
      return;
    }

    const { page, limit, search } = validation.data;

    // Build aggregation pipeline
    const pipeline: any[] = [
      // Match students only
      { $match: { role: 'student' } },
    ];

    // Add search filter if provided
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        },
      });
    }

    // Lookup enrollments
    pipeline.push({
      $lookup: {
        from: 'enrollments',
        localField: '_id',
        foreignField: 'userId',
        as: 'enrollments',
      },
    });

    // Add computed fields
    pipeline.push({
      $addFields: {
        enrollmentCount: { $size: '$enrollments' },
        totalPaid: { $sum: '$enrollments.amountPaid' },
        lastEnrollmentDate: { $max: '$enrollments.enrolledAt' },
      },
    });

    // Project only needed fields
    pipeline.push({
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        mobileNumber: 1,
        profilePicUrl: 1,
        enrollmentCount: 1,
        totalPaid: 1,
        lastEnrollmentDate: 1,
        createdAt: 1,
      },
    });

    // Sort by enrollment count descending
    pipeline.push({ $sort: { enrollmentCount: -1, createdAt: -1 } });

    // Get total count before pagination
    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await User.aggregate(countPipeline);
    const total = countResult.length > 0 ? countResult[0].total : 0;

    // Add pagination
    const skip = (page - 1) * limit;
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    // Execute aggregation
    const students = await User.aggregate(pipeline);

    sendPaginatedSuccess(
      res,
      students,
      'Students retrieved successfully — Students मिल गए',
      total,
      page,
      limit
    );
  }
);
