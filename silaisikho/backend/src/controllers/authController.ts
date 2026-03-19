import type { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import User from '@/models/User';
import type { IUserDocument } from '@/models/User';
import { registerUser } from '@/config/passport';
import { generateAuthTokens, verifyRefreshToken, setRefreshTokenCookie, clearRefreshTokenCookie, sanitizeUser, sendSuccess, sendError } from '@/utils/index';
import { REGISTER_SCHEMA, LOGIN_SCHEMA } from '@/validators/auth';
import { asyncHandler } from '@/middleware/asyncHandler';

// ─── register ─────────────────────────────────────────────────────────────────

export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const parsed = REGISTER_SCHEMA.safeParse(req.body);
  if (!parsed.success) {
    sendError(res, 'Validation failed', 400);
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
      sendError(res, message, 409);
      return;
    }
    if (message.includes('PIN')) {
      sendError(res, message, 400);
      return;
    }
    next(err);
    return;
  }

  const { accessToken, refreshToken, expiresIn } = await generateAuthTokens(createdUser);
  setRefreshTokenCookie(res, refreshToken);

  sendSuccess(res, {
    user: sanitizeUser(createdUser),
    accessToken,
    expiresIn,
  }, 'Account created successfully — अकाउंट बन गया', 201);
});

// ─── login ────────────────────────────────────────────────────────────────────

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const parsed = LOGIN_SCHEMA.safeParse(req.body);
  if (!parsed.success) {
    sendError(res, 'Validation failed', 400);
    return;
  }

  // Manual passport.authenticate invocation — keeps auth logic inside the controller
  const authenticate = passport.authenticate(
    'local',
    { session: false },
    async (err: Error | null, user: IUserDocument | false, info: { message?: string } | undefined) => {
      if (err) { next(err); return; }

      if (!user) {
        sendError(res, info?.message ?? 'Invalid credentials — गलत जानकारी', 401);
        return;
      }

      const { accessToken, refreshToken, expiresIn } = await generateAuthTokens(user);
      setRefreshTokenCookie(res, refreshToken);

      sendSuccess(res, {
        user: sanitizeUser(user),
        accessToken,
        expiresIn,
      }, 'Login successful — लॉगिन सफल रहा', 200);
    }
  );

  authenticate(req, res, next);
});

// ─── refresh ──────────────────────────────────────────────────────────────────

export const refresh = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies.refreshToken as string | undefined;

  if (!token) {
    sendError(res, 'No refresh token provided — refresh token नहीं मिला', 401);
    return;
  }

  let userId: string;
  let tokenVersion: number;

  try {
    const payload = await verifyRefreshToken(token);
    userId = payload.userId;
    tokenVersion = payload.tokenVersion;
  } catch {
    sendError(res, 'Refresh token is invalid or expired — refresh token अमान्य या expire हो गया', 401);
    return;
  }

  const user = await User.findById(userId);
  if (!user) {
    sendError(res, 'User not found — यूजर नहीं मिला', 401);
    return;
  }

  if (tokenVersion !== user.tokenVersion) {
    sendError(res, 'Session expired — please log in again — सेशन expire हो गया, कृपया दोबारा लॉगिन करें', 401);
    return;
  }

  const { accessToken, refreshToken: newRefreshToken, expiresIn } = await generateAuthTokens(user);
  setRefreshTokenCookie(res, newRefreshToken);

  sendSuccess(res, { accessToken, expiresIn }, 'Token refreshed', 200);
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

  sendSuccess(res, undefined, 'Logged out successfully — लॉगआउट सफल रहा', 200);
});
