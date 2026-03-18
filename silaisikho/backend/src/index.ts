import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { env } from '@/config/env';
import connectDB from '@/config/database';
import { configurePassport } from '@/config/passport';
import { errorHandler } from '@/middleware/index';
import authRouter from '@/routes/auth';
import userRouter from '@/routes/user';
import adminRouter from '@/routes/admin';

// Import models before any route registration — order reflects reference dependency chain
import '@/models/User';
import '@/models/Course';
import '@/models/Enrollment';
import '@/models/VideoProgress';
import '@/models/OtpSession';

const app: Application = express();

// ─── 1. Configure Passport strategies ────────────────────────────────────────
configurePassport();

// ─── 2. Core middleware ───────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());

// ─── 3. Passport initialise (no session) ─────────────────────────────────────
app.use(passport.initialize());

// ─── 4. Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/admin', adminRouter);

// ─── 5. Global error handler — must be last ───────────────────────────────────
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
