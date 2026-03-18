import type { Request, Response, NextFunction } from 'express';
import { env } from '@/config/env';

// ─── errorHandler ─────────────────────────────────────────────────────────────
// Must be registered LAST in src/index.ts — Express identifies error handlers
// by the four-parameter signature.

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // next must be present even if unused — Express requires all 4 params
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  console.error(err.stack);

  const statusCode = (err as Error & { statusCode?: number }).statusCode ?? 500;

  const body: Record<string, unknown> = {
    success: false,
    message: err.message || 'Internal server error',
  };

  if (env.NODE_ENV === 'development') {
    body.stack = err.stack;
  }

  res.status(statusCode).json(body);
}

export default errorHandler;
