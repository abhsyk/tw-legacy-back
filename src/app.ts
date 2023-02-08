import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import userRoutes from './routes/user';

const app = express();

// Morgan
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Cors
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Body parser
app.use(express.json());

// Routes
app.use('/api/v1/users', userRoutes);

export default app;
