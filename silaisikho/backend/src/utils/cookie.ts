// cookie helper for auth system

import type { Response } from 'express';
import { env } from '@/config/env';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  maxAge: number;
  path: string;
}

// ─── getRefreshTokenCookieOptions ─────────────────────────────────────────────

export function getRefreshTokenCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    path: '/api/auth/refresh',          // scoped — browser only sends this cookie to the refresh endpoint
  };
}

// ─── setRefreshTokenCookie ────────────────────────────────────────────────────

export function setRefreshTokenCookie(res: Response, token: string): void {
  res.cookie('refreshToken', token, getRefreshTokenCookieOptions());
}

// ─── clearRefreshTokenCookie ──────────────────────────────────────────────────

export function clearRefreshTokenCookie(res: Response): void {
  // path must match exactly — otherwise the browser ignores the clear
  res.clearCookie('refreshToken', { path: getRefreshTokenCookieOptions().path });
}
