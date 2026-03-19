import rateLimit from 'express-rate-limit';
import type { Request, RequestHandler } from 'express';
import { env } from '@/config/env';

// ─── globalRateLimiter ────────────────────────────────────────────────────────
// Protects the entire API from volumetric abuse.
// 300 requests per IP per 15 minutes is generous for normal usage but blocks attacks.

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests — बहुत ज़्यादा requests हो गई। कुछ देर बाद try करें',
  },
  handler: ((req: Request, res, next) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests — बहुत ज़्यादा requests हो गई। कुछ देर बाद try करें',
    });
  }) as RequestHandler,
  keyGenerator: (req: Request): string => {
    return req.ip ?? 'unknown';
  },
});

// ─── authRateLimiter ──────────────────────────────────────────────────────────
// Stricter limit for register and login endpoints.
// 10 attempts per IP per 15 minutes. Only counts failed attempts.
// An attacker trying PINs is blocked after 10 failed attempts.

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    success: false,
    message: 'Too many login attempts — बहुत बार गलत try किया। 15 मिनट बाद try करें',
  },
  handler: ((req: Request, res, next) => {
    res.status(429).json({
      success: false,
      message: 'Too many login attempts — बहुत बार गलत try किया। 15 मिनट बाद try करें',
    });
  }) as RequestHandler,
  keyGenerator: (req: Request): string => {
    return req.ip ?? 'unknown';
  },
});

// ─── changePinRateLimiter ─────────────────────────────────────────────────────
// Strictest limit for PIN change endpoint.
// 5 attempts per IP per hour. Only counts failed attempts.
// If an attacker has a stolen token they get at most 5 attempts.

export const changePinRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    success: false,
    message: 'Too many PIN change attempts — PIN बदलने की बहुत ज़्यादा कोशिश हो गई। 1 घंटे बाद try करें',
  },
  handler: ((req: Request, res, next) => {
    res.status(429).json({
      success: false,
      message: 'Too many PIN change attempts — PIN बदलने की बहुत ज़्यादा कोशिश हो गई। 1 घंटे बाद try करें',
    });
  }) as RequestHandler,
  keyGenerator: (req: Request): string => {
    return req.ip ?? 'unknown';
  },
});
