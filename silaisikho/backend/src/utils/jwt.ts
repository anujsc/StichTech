import jwt from 'jsonwebtoken';
import { env } from '@/config/env';
import type { JwtAccessPayload, JwtRefreshPayload, AuthTokens, TokenVerificationResult } from '@/types/jwt';
import type { IUserDocument } from '@/models/User';

// ─── Private helper ───────────────────────────────────────────────────────────

function parseExpiryToSeconds(expiry: string): number {
  const unit = expiry.slice(-1);
  const value = parseInt(expiry.slice(0, -1), 10);
  if (isNaN(value)) return 900;
  switch (unit) {
    case 's': return value;
    case 'm': return value * 60;
    case 'h': return value * 3600;
    case 'd': return value * 86400;
    default:  return 900;
  }
}

// ─── generateAccessToken ──────────────────────────────────────────────────────

export function generateAccessToken(user: IUserDocument): Promise<string> {
  const payload: Omit<JwtAccessPayload, 'iat' | 'exp'> = {
    userId: (user._id as unknown as string).toString(),
    identifier: user.email ?? (user.mobileNumber as string),
    identifierType: user.email !== undefined ? 'email' : 'mobile',
    role: user.role,
  };

  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRY as unknown as number }, (err, token) => {
      if (err) { reject(err); return; }
      if (token === undefined) { reject(new Error('Failed to generate access token')); return; }
      resolve(token);
    });
  });
}

// ─── generateRefreshToken ─────────────────────────────────────────────────────

export function generateRefreshToken(user: IUserDocument): Promise<string> {
  const payload: Omit<JwtRefreshPayload, 'iat' | 'exp'> = {
    userId: (user._id as unknown as string).toString(),
    tokenVersion: user.tokenVersion,
  };

  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRY as unknown as number }, (err, token) => {
      if (err) { reject(err); return; }
      if (token === undefined) { reject(new Error('Failed to generate refresh token')); return; }
      resolve(token);
    });
  });
}

// ─── generateAuthTokens ───────────────────────────────────────────────────────

export async function generateAuthTokens(user: IUserDocument): Promise<AuthTokens> {
  const [accessToken, refreshToken] = await Promise.all([
    generateAccessToken(user),
    generateRefreshToken(user),
  ]);

  const expiresIn: number = parseExpiryToSeconds(env.JWT_ACCESS_EXPIRY);

  return { accessToken, refreshToken, expiresIn };
}

// ─── verifyAccessToken ────────────────────────────────────────────────────────

export function verifyAccessToken(token: string): TokenVerificationResult {
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtAccessPayload;
    return { success: true, payload };
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return { success: false, error: 'Token expired — please refresh' };
    }
    if (err instanceof jwt.JsonWebTokenError) {
      return { success: false, error: 'Invalid token' };
    }
    return { success: false, error: 'Token verification failed' };
  }
}

// ─── verifyRefreshToken ───────────────────────────────────────────────────────

export function verifyRefreshToken(token: string): Promise<JwtRefreshPayload> {
  return new Promise<JwtRefreshPayload>((resolve, reject) => {
    jwt.verify(token, env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) { reject(err); return; }
      resolve(decoded as JwtRefreshPayload);
    });
  });
}
