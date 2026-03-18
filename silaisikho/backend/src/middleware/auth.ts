import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '@/utils/index';
import User from '@/models/User';
import type { IUserDocument } from '@/models/User';

// ─── isAuthenticated ──────────────────────────────────────────────────────────
// Verifies the Bearer token, queries the DB to confirm the account still exists,
// and attaches the user document to req.user.
// passwordHash and tokenVersion are excluded from the returned document.

export async function isAuthenticated(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Authentication required — लॉगिन करें' });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ success: false, message: 'Authentication required — लॉगिन करें' });
    return;
  }

  const result = verifyAccessToken(token);
  if (!result.success) {
    res.status(401).json({ success: false, message: result.error });
    return;
  }

  const user = await User.findById(result.payload.userId).select('-passwordHash -tokenVersion');
  if (!user) {
    res.status(401).json({ success: false, message: 'Account not found — अकाउंट नहीं मिला' });
    return;
  }

  req.user = user;
  next();
}

// ─── isAdmin ──────────────────────────────────────────────────────────────────
/**
 * Checks that the authenticated user has the admin role.
 * MUST always be used after isAuthenticated in the middleware chain — never standalone.
 * isAuthenticated sets req.user; isAdmin reads it.
 */
export function isAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required — लॉगिन करें' });
    return;
  }

  if ((req.user as IUserDocument).role !== 'admin') {
    res.status(403).json({ success: false, message: 'Admin access required — यह काम सिर्फ admin कर सकते हैं' });
    return;
  }

  next();
}

// ─── verifyCurrentPin ─────────────────────────────────────────────────────────
// Confirms the submitted currentPin matches the stored hash before allowing
// a PIN change. Runs after isAuthenticated — req.user is guaranteed to exist.

export async function verifyCurrentPin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required — लॉगिन करें' });
      return;
    }

    const currentPin = req.body.currentPin as string | undefined;
    if (!currentPin || currentPin.trim() === '') {
      res.status(400).json({ success: false, message: 'Current PIN is required — मौजूदा PIN डालें' });
      return;
    }

    const isMatch = await (req.user as IUserDocument).comparePin(currentPin);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Current PIN is incorrect — मौजूदा PIN गलत है' });
      return;
    }

    next();
  } catch (err) {
    next(err);
  }
}
