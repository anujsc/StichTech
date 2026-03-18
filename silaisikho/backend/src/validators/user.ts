import { z } from 'zod';

// ─── Shared regex ─────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^(\+91|0)?[6-9]\d{9}$/;
const PIN_REGEX = /^\d{4,6}$/;

// ─── UPDATE_PROFILE_SCHEMA ────────────────────────────────────────────────────

export const UPDATE_PROFILE_SCHEMA = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters — नाम कम से कम 2 अक्षर का होना चाहिए')
      .max(100, 'Name cannot exceed 100 characters')
      .optional(),
    profilePicUrl: z
      .string()
      .trim()
      .url('Please enter a valid image URL')
      .optional(),
  })
  .refine(
    (data) => data.name !== undefined || data.profilePicUrl !== undefined,
    'At least one field must be provided to update — कम से कम एक फील्ड बदलें'
  );

// ─── CHANGE_PIN_SCHEMA ────────────────────────────────────────────────────────

export const CHANGE_PIN_SCHEMA = z
  .object({
    currentPin: z.string().min(1, 'Current PIN is required — मौजूदा PIN डालें'),
    newPin: z.string().regex(PIN_REGEX, 'New PIN must be 4 to 6 digits — नया PIN 4 से 6 अंकों का होना चाहिए'),
    confirmPin: z.string().min(1, 'Please confirm your new PIN — नया PIN दोबारा डालें'),
  })
  .refine(
    (data) => data.newPin === data.confirmPin,
    { message: 'PINs do not match — दोनों PIN एक जैसे होने चाहिए', path: ['confirmPin'] }
  )
  .refine(
    (data) => data.newPin !== data.currentPin,
    { message: 'New PIN must be different from current PIN — नया PIN पुराने PIN से अलग होना चाहिए', path: ['newPin'] }
  );

// ─── CREATE_ADMIN_SCHEMA ──────────────────────────────────────────────────────

export const CREATE_ADMIN_SCHEMA = z.object({
  name: z.string().trim().min(2).max(100),
  identifier: z
    .string()
    .trim()
    .min(1, 'Email or mobile number is required')
    .refine(
      (val) => EMAIL_REGEX.test(val) || MOBILE_REGEX.test(val),
      'Please enter a valid email address or 10-digit mobile number — सही email या 10 अंकों का mobile number डालें'
    ),
  pin: z.string().regex(PIN_REGEX, 'PIN must be 4 to 6 digits — PIN 4 से 6 अंकों का होना चाहिए'),
});

// ─── Inferred types ───────────────────────────────────────────────────────────

export type UpdateProfileInput = z.infer<typeof UPDATE_PROFILE_SCHEMA>;
export type ChangePinInput = z.infer<typeof CHANGE_PIN_SCHEMA>;
export type CreateAdminInput = z.infer<typeof CREATE_ADMIN_SCHEMA>;
