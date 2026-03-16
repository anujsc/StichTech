import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

// TODO: import connectDB from './config/db'
// TODO: import app from './app'
// TODO: import { env } from './config/env'

const app = express();

// TODO: Register middleware (helmet, cors, morgan, cookieParser, express.json)
// TODO: Register routes
// TODO: Register global error handler

const PORT = process.env.PORT || 5000;

// TODO: connectDB().then(() => {
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// });

export default app;
