import express, { Application } from 'express';
import { env } from '@/config/env';
import connectDB from '@/config/database';

// Import models before any route registration — order reflects reference dependency chain
import '@/models/User';
import '@/models/Course';
import '@/models/Enrollment';
import '@/models/VideoProgress';
import '@/models/OtpSession';

const app: Application = express();

// ─── Bootstrap ────────────────────────────────────────────────────────────────
async function bootstrap(): Promise<void> {
  // Database must be connected before the server accepts any requests
  await connectDB();

  app.listen(Number(env.PORT), () => {
    console.log(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
  });
}

bootstrap();

export default app;
