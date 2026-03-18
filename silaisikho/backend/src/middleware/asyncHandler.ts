import type { Request, Response, NextFunction } from 'express';

// ─── Types ────────────────────────────────────────────────────────────────────

type AsyncRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | Promise<Response> | void;

// ─── asyncHandler ─────────────────────────────────────────────────────────────
// Wraps async route handlers so unhandled rejections are forwarded to Express's
// global error handler automatically — eliminates try-catch boilerplate.

export function asyncHandler(fn: AsyncRouteHandler) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export default asyncHandler;
