import type { Request, Response, NextFunction } from 'express';
import cloudinary from '@/config/cloudinary';
import { env } from '@/config/env';
import Course from '@/models/Course';
import { sendSuccess, sendError } from '@/utils/response';
import { uploadUrlQuerySchema } from '@/validators/courseValidators';

// ─── Get Upload URL ───────────────────────────────────────────────────────────
// GET /api/admin/videos/upload-url
// Requires: isAuthenticated + isAdmin
// Returns signed upload parameters for direct Cloudinary upload

export async function getUploadUrl(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // 1. Validate query parameters
    const validation = uploadUrlQuerySchema.safeParse(req.query);
    
    if (!validation.success) {
      const errors = validation.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      
      sendError(res, 'Invalid query parameters — गलत query parameters', 400, errors);
      return;
    }
    
    const { courseId, moduleId, videoId } = validation.data;
    
    // 2. Verify that the video exists
    const course = await Course.findById(courseId);
    
    if (!course) {
      sendError(res, 'Course not found — कोर्स नहीं मिला', 404);
      return;
    }
    
    const module = course.modules.id(moduleId);
    
    if (!module) {
      sendError(res, 'Module not found — मॉड्यूल नहीं मिला', 404);
      return;
    }
    
    const video = module.videos.id(videoId);
    
    if (!video) {
      sendError(res, 'Video not found — वीडियो नहीं मिला', 404);
      return;
    }
    
    // 3. Generate signed upload token
    const timestamp = Math.round(Date.now() / 1000);
    const context = `courseId=${courseId}|moduleId=${moduleId}|videoId=${videoId}`;
    
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        upload_preset: env.CLOUDINARY_UPLOAD_PRESET,
        context,
        eager: 'sp_hd',
        eager_async: true,
        notification_url: env.CLOUDINARY_WEBHOOK_URL,
      },
      env.CLOUDINARY_API_SECRET
    );
    
    // 4. Return upload parameters
    sendSuccess(
      res,
      {
        signature,
        timestamp,
        cloudName: env.CLOUDINARY_CLOUD_NAME,
        uploadPreset: env.CLOUDINARY_UPLOAD_PRESET,
        apiKey: env.CLOUDINARY_API_KEY,
        context,
      },
      'Upload URL generated successfully — अपलोड URL सफलतापूर्वक बनाया गया',
      200
    );
  } catch (error) {
    next(error);
  }
}
