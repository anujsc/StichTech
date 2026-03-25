import type { Request, Response } from 'express';
import crypto from 'crypto';
import { env } from '@/config/env';
import Course from '@/models/Course';

// ─── Cloudinary Webhook Handler ───────────────────────────────────────────────
// POST /api/webhooks/cloudinary
// No authentication — security via signature verification
// Receives notification when Cloudinary finishes transcoding a video

export async function cloudinaryWebhook(
  req: Request,
  res: Response
): Promise<void> {
  try {
    // 1. Verify signature
    const signature = req.headers['x-cld-signature'] as string;
    
    if (!signature) {
      res.status(401).send('Missing signature');
      return;
    }
    
    const body = req.body.toString();
    const expectedSignature = crypto
      .createHmac('sha256', env.CLOUDINARY_API_SECRET)
      .update(body)
      .digest('hex');
    
    if (signature !== expectedSignature) {
      res.status(401).send('Invalid signature');
      return;
    }
    
    // 2. Parse the webhook payload
    const payload = JSON.parse(body);
    
    // 3. Check event type — only process video completion events
    if (payload.notification_type !== 'upload' || payload.resource_type !== 'video') {
      res.status(200).send('Ignored — not a video upload event');
      return;
    }
    
    // 4. Extract data
    const publicId = payload.public_id;
    const duration = Math.round(payload.duration || 0);
    const context = payload.context?.custom || {};
    
    // Parse context string (format: "courseId=xxx|moduleId=yyy|videoId=zzz")
    const contextStr = Object.keys(context).join('|');
    const contextParts: Record<string, string> = {};
    
    contextStr.split('|').forEach((part) => {
      const [key, value] = part.split('=');
      if (key && value) {
        contextParts[key] = value;
      }
    });
    
    const { courseId, moduleId, videoId } = contextParts;
    
    if (!courseId || !moduleId || !videoId) {
      res.status(400).send('Missing context parameters');
      return;
    }
    
    // 5. Find and update the video document
    const course = await Course.findById(courseId);
    
    if (!course) {
      res.status(404).send('Course not found');
      return;
    }
    
    const module = course.modules.id(moduleId);
    
    if (!module) {
      res.status(404).send('Module not found');
      return;
    }
    
    const video = module.videos.id(videoId);
    
    if (!video) {
      res.status(404).send('Video not found');
      return;
    }
    
    // 6. Idempotency check — if video already has cloudinaryPublicId, skip
    if (video.cloudinaryPublicId && video.cloudinaryPublicId === publicId) {
      res.status(200).send('Already processed');
      return;
    }
    
    // 7. Update video document
    video.cloudinaryPublicId = publicId;
    video.durationSeconds = duration;
    
    // Save will trigger pre-save middleware to recalculate totalDurationSeconds
    await course.save();
    
    res.status(200).send('Webhook processed successfully');
  } catch (error) {
    console.error('Cloudinary webhook error:', error);
    res.status(500).send('Internal server error');
  }
}
