import { Router } from 'express';
import express from 'express';
import { cloudinaryWebhook } from '@/controllers/webhooks.controller';

const router = Router();

// ─── Cloudinary Webhook ───────────────────────────────────────────────────────
// This route must receive raw body for signature verification
// No authentication middleware — security via signature verification

router.post(
  '/cloudinary',
  express.raw({ type: 'application/json' }),
  cloudinaryWebhook
);

export default router;
