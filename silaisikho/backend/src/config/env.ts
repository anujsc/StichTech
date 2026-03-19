import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // CORS — required for frontend communication
  CORS_ORIGIN: z
    .string()
    .default('http://localhost:5173')
    .refine(
      (val) => {
        // Allow single URL or comma-separated list of URLs
        const origins = val.split(',').map((o) => o.trim());
        return origins.every((origin) => {
          try {
            new URL(origin);
            return true;
          } catch {
            return false;
          }
        });
      },
      { message: 'CORS_ORIGIN must be a valid URL or comma-separated list of URLs' }
    ),

  // Database — required now (Phase 2.1)
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),

  // JWT — required from Phase 3.2 onwards
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT access secret must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT refresh secret must be at least 32 characters — must be different from access secret'),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('30d'),

  // Google OAuth — required when OAuth is implemented
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z.string().optional(),

  // Email — required when email service is implemented
  EMAIL_USER: z.string().optional(),
  EMAIL_APP_PASSWORD: z.string().optional(),

  // Cloudinary — required when video upload is implemented
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  CLOUDINARY_UPLOAD_PRESET: z.string().optional(),

  // Razorpay — required when payments are implemented
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),

  // Frontend
  FRONTEND_URL: z.string().optional(),
});

const refinedSchema = envSchema.refine(
  (data) => data.JWT_ACCESS_SECRET !== data.JWT_REFRESH_SECRET,
  {
    message:
      'JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be different values — using the same secret for both tokens allows a refresh token to be used as an access token',
    path: ['JWT_REFRESH_SECRET'],
  }
);

const parsed = refinedSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment configuration. Check your .env file.');
}

export const env = parsed.data;
