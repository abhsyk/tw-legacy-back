import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user';
import postRoutes from './routes/post';

const app = express();

// Morgan
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Cors
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Body parser
app.use(express.json());
// Cookie parser
app.use(cookieParser());

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);

export default app;
