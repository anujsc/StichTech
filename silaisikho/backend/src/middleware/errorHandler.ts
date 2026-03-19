import type { Request, Response, NextFunction } from 'express';
import { env } from '@/config/env';
import { sendError } from '@/utils/index';

// ─── AppError ─────────────────────────────────────────────────────────────────
// Extended Error interface for operational vs non-operational errors.

interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

// ─── errorHandler ─────────────────────────────────────────────────────────────
// Production-grade error handler. Must be registered LAST in src/index.ts.
// Express identifies error handlers by the four-parameter signature.

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  // next must be present even if unused — Express requires all 4 params
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  // Determine status code
  const statusCode = err.statusCode ?? 500;

  // Determine message: in production, hide internal details for 500 errors
  const isProduction = env.NODE_ENV === 'production';
  const isUnhandledError = statusCode === 500 && !err.isOperational;

  const message =
    isProduction && isUnhandledError
      ? 'Something went wrong — कुछ गलत हो गया। कृपया दोबारा कोशिश करें'
      : err.message || 'Internal server error';

  // Logging: always log in development, only log 5xx in production
  if (!isProduction || statusCode >= 500) {
    console.error(`[${statusCode}] ${message}`);
    if (err.stack) {
      console.error(err.stack);
    }
  }

  // Send response
  sendError(res, message, statusCode);

  // In development, add stack trace to response
  if (!isProduction) {
    res.status(statusCode).json({
      success: false,
      message,
      stack: err.stack,
    });
  }
}

export default errorHandler;
