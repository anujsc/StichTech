import { z } from 'zod';

// ─── Shared regex ─────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^(\+91|0)?[6-9]\d{9}$/;

// ─── Schemas ──────────────────────────────────────────────────────────────────

export const REGISTER_SCHEMA = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),

  identifier: z
    .string()
    .trim()
    .min(1, 'Email or mobile number is required')
    .refine(
      (val) => EMAIL_REGEX.test(val) || MOBILE_REGEX.test(val),
      'Please enter a valid email address or 10-digit mobile number — सही email या 10 अंकों का mobile number डालें'
    ),

  pin: z
    .string()
    .regex(/^\d{4,6}$/, 'PIN must be 4 to 6 digits — PIN 4 से 6 अंकों का होना चाहिए'),
});

export const LOGIN_SCHEMA = z.object({
  identifier: z.string().trim().min(1, 'Email or mobile number is required'),
  // Loose validation on login — comparePin handles actual verification
  pin: z.string().min(1, 'PIN is required'),
});

// ─── Inferred types ───────────────────────────────────────────────────────────

export type RegisterInput = z.infer<typeof REGISTER_SCHEMA>;
export type LoginInput = z.infer<typeof LOGIN_SCHEMA>;
