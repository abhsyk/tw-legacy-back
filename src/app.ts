import express from 'express';
import morgan from 'morgan';

const app = express();

// Morgan
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser
app.use(express.json());

export default app;
