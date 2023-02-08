import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import app from './app';

// Database connection
const DATABASE = process.env.DATABASE!.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD!
);
mongoose
  .connect(DATABASE)
  .then(() => console.log('> Database connection successful!'));

const port = +process.env.PORT! || 3001;
const server = app.listen(port, () => {
  console.log(`> App running on port ${port}...`);
});

// Unhandled rejection error
process.on('unhandledRejection', (err: any) => {
  console.log('Unhandled Rejection! Shutting down');
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1); // Uncaught Fatal Exception
  });
});
