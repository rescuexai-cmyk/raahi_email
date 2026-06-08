import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import emailRoutes from './routes/email.routes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.corsOrigins,
      methods: ['GET', 'POST'],
    })
  );
  app.use(express.json({ limit: '32kb' }));

  app.use('/assets', express.static(path.resolve(__dirname, '../public')));

  app.use('/api/email', emailRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
