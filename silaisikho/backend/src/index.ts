import express, { Application } from 'express';
import cors from 'cors';
import type { CorsOptions } from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { env } from '@/config/env';
import connectDB from '@/config/database';
import { configurePassport } from '@/config/passport';
import { errorHandler, globalRateLimiter } from '@/middleware/index';
import authRouter from '@/routes/auth';
import userRouter from '@/routes/user';
import adminRouter from '@/routes/admin';
import courseRouter from '@/routes/courses';
import healthRouter from '@/routes/health';

// Import models before any route registration — order reflects reference dependency chain
import '@/models/User';
import '@/models/Course';
import '@/models/Enrollment';
import '@/models/VideoProgress';
import '@/models/OtpSession';

const app: Application = express();

// ─── 1. Trust proxy configuration ──────────────────────────────────────────────
// When behind a reverse proxy, read real client IP from X-Forwarded-For header
app.set('trust proxy', 1);

// ─── 2. Configure Passport strategies ──────────────────────────────────────────
configurePassport();

// ─── 3. Global rate limiter — must be first middleware ────────────────────────
app.use(globalRateLimiter);

// ─── 4. Body parsing middleware with size limits ──────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── 5. CORS configuration ────────────────────────────────────────────────────
const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean | string) => void): void => {
    // Parse allowed origins from env
    const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());

    // Allow requests without origin (e.g., Postman, curl)
    if (!origin) {
      callback(null, true);
      return;
    }

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    // Origin not allowed
    callback(new Error('Not allowed by CORS policy — यह origin allowed नहीं है'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// ─── 6. Security middleware ───────────────────────────────────────────────────
app.use(helmet());

// ─── 7. Request logging ───────────────────────────────────────────────────────
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ─── 8. Cookie parsing ────────────────────────────────────────────────────────
app.use(cookieParser());

// ─── 9. Passport initialise (no session) ──────────────────────────────────────
app.use(passport.initialize());

// ─── 10. Health check route — mounted before feature routes ──────────────────
app.use('/api/health', healthRouter);

// ─── 11. Feature routes ───────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/courses', courseRouter);

// ─── 12. Global error handler — must be last ──────────────────────────────────
app.use(errorHandler);

// ─── Bootstrap ────────────────────────────────────────────────────────────────
async function bootstrap(): Promise<void> {
  await connectDB();

  app.listen(Number(env.PORT), () => {
    console.log(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
  });
}

bootstrap();

export default app;
