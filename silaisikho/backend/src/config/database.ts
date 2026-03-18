import mongoose from 'mongoose';
import { env } from '@/config/env';

async function connectDB(): Promise<void> {
  await mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    dbName: 'silaisikho',
  });

  mongoose.connection.on('connected', () => {
    console.log(`MongoDB connected successfully — host: ${mongoose.connection.host}`);
  });

  mongoose.connection.on('error', (err: Error) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
}

export default connectDB;
