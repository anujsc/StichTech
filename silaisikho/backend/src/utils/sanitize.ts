import type { IUserDocument } from '@/models/User';

// ─── sanitizeUser ─────────────────────────────────────────────────────────────
// Strips passwordHash, tokenVersion, and __v from any user document before
// sending it in a response. Call this on every user object in every response.

export function sanitizeUser(user: IUserDocument): Record<string, unknown> {
  return {
    id: (user._id as unknown as string).toString(),
    name: user.name,
    email: user.email,
    mobileNumber: user.mobileNumber,
    profilePicUrl: user.profilePicUrl,
    role: user.role,
    authProvider: user.authProvider,
  };
}
