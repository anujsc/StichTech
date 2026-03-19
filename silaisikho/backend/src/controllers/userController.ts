import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import type { IUserDocument } from '@/models/User';
import { generateAuthTokens, setRefreshTokenCookie, sanitizeUser, sendSuccess, sendError } from '@/utils/index';
import { asyncHandler } from '@/middleware/asyncHandler';
import { UPDATE_PROFILE_SCHEMA, CHANGE_PIN_SCHEMA } from '@/validators/user';

// ─── getProfile ───────────────────────────────────────────────────────────────
// req.user is already set and passwordHash/tokenVersion already excluded by
// isAuthenticated — no additional DB query needed.

export const getProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  sendSuccess(res, { user: sanitizeUser(req.user as IUserDocument) }, 'Profile retrieved', 200);
});

// ─── updateProfile ────────────────────────────────────────────────────────────

export const updateProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const parsed = UPDATE_PROFILE_SCHEMA.safeParse(req.body);
  if (!parsed.success) {
    sendError(res, 'Validation failed', 400);
    return;
  }

  const { name, profilePicUrl } = parsed.data;

  // Build update object — only include fields present in the request
  const update: Partial<Pick<IUserDocument, 'name' | 'profilePicUrl'>> = {};
  if (name !== undefined) update.name = name;
  if (profilePicUrl !== undefined) update.profilePicUrl = profilePicUrl;

  const updatedUser = await User.findByIdAndUpdate(
    (req.user as IUserDocument)._id,
    { $set: update },
    { new: true, select: '-passwordHash -tokenVersion' }
  ) as IUserDocument | null;

  if (!updatedUser) {
    sendError(res, 'User not found — यूजर नहीं मिला', 404);
    return;
  }

  sendSuccess(res, { user: sanitizeUser(updatedUser) }, 'Profile updated successfully — प्रोफ़ाइल अपडेट हो गई', 200);
});

// ─── changePin ────────────────────────────────────────────────────────────────
// Runs after isAuthenticated + verifyCurrentPin — current PIN already confirmed.

export const changePin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const parsed = CHANGE_PIN_SCHEMA.safeParse(req.body);
  if (!parsed.success) {
    sendError(res, 'Validation failed', 400);
    return;
  }

  const { newPin } = parsed.data;
  const newPasswordHash = await bcrypt.hash(newPin, 12);

  // Increment tokenVersion — invalidates all existing refresh tokens on other devices
  await User.findByIdAndUpdate(
    (req.user as IUserDocument)._id,
    { $set: { passwordHash: newPasswordHash }, $inc: { tokenVersion: 1 } },
    { runValidators: false }
  );

  // Fetch updated user to get the new tokenVersion for fresh token generation
  const updatedUser = await User.findById((req.user as IUserDocument)._id) as IUserDocument | null;
  if (!updatedUser) {
    sendError(res, 'User not found — यूजर नहीं मिला', 404);
    return;
  }

  // Issue fresh tokens for the current session — user stays logged in on this device
  const { accessToken, refreshToken, expiresIn } = await generateAuthTokens(updatedUser);
  setRefreshTokenCookie(res, refreshToken);

  sendSuccess(res, { accessToken, expiresIn }, 'PIN changed successfully — PIN बदल गया. All other sessions are now logged out.', 200);
});
