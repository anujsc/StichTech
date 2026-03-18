import type { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import User from '@/models/User';
import type { IUserDocument } from '@/models/User';
import { registerUser } from '@/config/passport';
import { generateAuthTokens, verifyRefreshToken, setRefreshTokenCookie, clearRefreshTokenCookie, sanitizeUser } from '@/utils/index';
import { REGISTER_SCHEMA, LOGIN_SCHEMA } from '@/validators/auth';
import { asyncHandler } from '@/middleware/asyncHandler';

// ─── register ─────────────────────────────────────────────────────────────────

export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const parsed = REGISTER_SCHEMA.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: parsed.error.format(),
    });
    return;
  }

  const { name, identifier, pin } = parsed.data;

  let createdUser: IUserDocument;
  try {
    // role is always hardcoded to 'student' — never read from req.body
    createdUser = await registerUser({ name, identifier, pin, role: 'student' });
  } catch (err) {
    const message = (err as Error).message;
    if (message.includes('already exists')) {
      res.status(409).json({ success: false, message });
      return;
    }
    if (message.includes('PIN')) {
      res.status(400).json({ success: false, message });
      return;
    }
    next(err);
    return;
  }

  const { accessToken, refreshToken, expiresIn } = await generateAuthTokens(createdUser);
  setRefreshTokenCookie(res, refreshToken);

  res.status(201).json({
    success: true,
    message: 'Account created successfully — अकाउंट बन गया',
    data: {
      user: sanitizeUser(createdUser),
      accessToken,
      expiresIn,
    },
  });
});

// ─── login ────────────────────────────────────────────────────────────────────

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const parsed = LOGIN_SCHEMA.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: parsed.error.format(),
    });
    return;
  }

  // Manual passport.authenticate invocation — keeps auth logic inside the controller
  const authenticate = passport.authenticate(
    'local',
    { session: false },
    async (err: Error | null, user: IUserDocument | false, info: { message?: string } | undefined) => {
      if (err) { next(err); return; }

      if (!user) {
        res.status(401).json({
          success: false,
          message: info?.message ?? 'Invalid credentials — गलत जानकारी',
        });
        return;
      }

      const { accessToken, refreshToken, expiresIn } = await generateAuthTokens(user);
      setRefreshTokenCookie(res, refreshToken);

      res.status(200).json({
        success: true,
        message: 'Login successful — लॉगिन सफल रहा',
        data: {
          user: sanitizeUser(user),
          accessToken,
          expiresIn,
        },
      });
    }
  );

  authenticate(req, res, next);
});

// ─── refresh ──────────────────────────────────────────────────────────────────

export const refresh = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies.refreshToken as string | undefined;

  if (!token) {
    res.status(401).json({ success: false, message: 'No refresh token provided — refresh token नहीं मिला' });
    return;
  }

  let userId: string;
  let tokenVersion: number;

  try {
    const payload = await verifyRefreshToken(token);
    userId = payload.userId;
    tokenVersion = payload.tokenVersion;
  } catch {
    res.status(401).json({ success: false, message: 'Refresh token is invalid or expired — refresh token अमान्य या expire हो गया' });
    return;
  }

  const user = await User.findById(userId);
  if (!user) {
    res.status(401).json({ success: false, message: 'User not found — यूजर नहीं मिला' });
    return;
  }

  if (tokenVersion !== user.tokenVersion) {
    res.status(401).json({ success: false, message: 'Session expired — please log in again — सेशन expire हो गया, कृपया दोबारा लॉगिन करें' });
    return;
  }

  const { accessToken, refreshToken: newRefreshToken, expiresIn } = await generateAuthTokens(user);
  setRefreshTokenCookie(res, newRefreshToken);

  res.status(200).json({
    success: true,
    message: 'Token refreshed',
    data: { accessToken, expiresIn },
  });
});

// ─── logout ───────────────────────────────────────────────────────────────────

export const logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  clearRefreshTokenCookie(res);

  if (req.user) {
    try {
      await User.findByIdAndUpdate(req.user._id, { $inc: { tokenVersion: 1 } });
    } catch (err) {
      console.error('Failed to increment tokenVersion on logout:', err);
    }
  }

  res.status(200).json({ success: true, message: 'Logged out successfully — लॉगआउट सफल रहा' });
});
