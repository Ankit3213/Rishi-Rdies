import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { config } from './config';
import { authRouter } from './auth/routes';
import { connectDatabase } from './db';

export const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: config.CLIENT_ORIGINS }));
app.use(express.json({ limit: '16kb' }));
app.use(rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: 'draft-8', legacyHeaders: false }));

app.get('/health', async (_request, response, next) => {
  try {
    await (await connectDatabase()).command({ ping: 1 });
    return response.json({ status: 'ok' });
  } catch (error) {
    return next(error);
  }
});

app.use('/auth', authRouter);
app.use((_request, response) => response.status(404).json({ error: { code: 'NOT_FOUND', message: 'The requested endpoint was not found.' } }));
app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  console.error('Request failed', error instanceof Error ? error.message : 'Unknown error');
  return response.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'The request could not be completed.' } });
});
