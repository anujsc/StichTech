import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import type { IUserDocument } from '@/models/User';
import { registerUser } from '@/config/passport';
import { generateAuthTokens, setRefreshTokenCookie, sanitizeUser } from '@/utils/index';
import { asyncHandler } from '@/middleware/asyncHandler';
import { UPDATE_PROFILE_SCHEMA, CHANGE_PIN_SCHEMA, CREATE_ADMIN_SCHEMA } from '@/validators/user';

// ─── getProfile ───────────────────────────────────────────────────────────────
// req.user is already set and passwordHash/tokenVersion already excluded by
// isAuthenticated — no additional DB query needed.

export const getProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    data: { user: sanitizeUser(req.user as IUserDocument) },
  });
});

// ─── updateProfile ────────────────────────────────────────────────────────────

export const updateProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const parsed = UPDATE_PROFILE_SCHEMA.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: parsed.error.format(),
    });
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
    res.status(404).json({ success: false, message: 'User not found — यूजर नहीं मिला' });
    return;
  }

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully — प्रोफ़ाइल अपडेट हो गई',
    data: { user: sanitizeUser(updatedUser) },
  });
});

// ─── changePin ────────────────────────────────────────────────────────────────
// Runs after isAuthenticated + verifyCurrentPin — current PIN already confirmed.

export const changePin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const parsed = CHANGE_PIN_SCHEMA.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: parsed.error.format(),
    });
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
    res.status(404).json({ success: false, message: 'User not found — यूजर नहीं मिला' });
    return;
  }

  // Issue fresh tokens for the current session — user stays logged in on this device
  const { accessToken, refreshToken, expiresIn } = await generateAuthTokens(updatedUser);
  setRefreshTokenCookie(res, refreshToken);

  res.status(200).json({
    success: true,
    message: 'PIN changed successfully — PIN बदल गया. All other sessions are now logged out.',
    data: { accessToken, expiresIn },
  });
});

// ─── createAdmin ──────────────────────────────────────────────────────────────
// Runs after isAuthenticated + isAdmin — only confirmed admins reach here.

export const createAdmin = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const parsed = CREATE_ADMIN_SCHEMA.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: parsed.error.format(),
    });
    return;
  }

  const { name, identifier, pin } = parsed.data;

  let newAdmin: IUserDocument;
  try {
    // role is always hardcoded to 'admin' — never read from req.body
    newAdmin = await registerUser({ name, identifier, pin, role: 'admin' });
  } catch (err) {
    const message = (err as Error).message;
    if (message.includes('already exists')) {
      res.status(409).json({ success: false, message });
      return;
    }
    next(err);
    return;
  }

  res.status(201).json({
    success: true,
    message: 'Admin account created successfully — admin अकाउंट बन गया',
    data: { user: sanitizeUser(newAdmin) },
  });
});
