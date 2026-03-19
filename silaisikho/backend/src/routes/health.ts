import { Router, type Request, type Response } from 'express';
import mongoose from 'mongoose';
import { env } from '@/config/env';

const router = Router();

// ─── GET /api/health ──────────────────────────────────────────────────────────
// Health check endpoint for deployment platforms and monitoring services.

router.get('/', async (req: Request, res: Response): Promise<void> => {
  const status = {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    database:
      mongoose.connection.readyState === 1
        ? 'connected'
        : mongoose.connection.readyState === 2
          ? 'connecting'
          : 'disconnected',
    version: process.env.npm_package_version ?? 'unknown',
  };

  // If database is not connected, return 503 Service Unavailable
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({
      success: false,
      message: 'Service unavailable — database not connected',
      status,
    });
    return;
  }

  // Database is connected, return 200 OK
  res.status(200).json({
    success: true,
    message: 'Service is healthy — सर्विस ठीक है',
    status,
  });
});

export default router;
