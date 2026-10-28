import compression from 'compression';
import express, { NextFunction, Request, Response } from 'express';
import { adminRouter } from './routes/admin';
import { applicationsRouter } from './routes/applications';
import { chatRouter } from './routes/chat';
import { cmsRouter } from './routes/cms';
import { contactRouter } from './routes/contact';
import { feedbackRouter } from './routes/feedback';
import { leadRouter } from './routes/lead';
import { telegramWebhookRouter } from './routes/telegramWebhook';
import { uploadRouter } from './routes/upload';
import { webhookRouter } from './routes/webhook';

export function createHttpApp() {
  const app = express();

  app.use(compression());
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  app.use('/api/chat', chatRouter);
  app.use('/api/lead', leadRouter);
  app.use('/api/upload', uploadRouter);
  app.use('/api/applications', applicationsRouter);
  app.use('/api/feedback', feedbackRouter);
  app.use('/api/contact', contactRouter);
  app.use('/api/webhook', webhookRouter);
  app.use('/api/telegram/webhook', telegramWebhookRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/cms', cmsRouter);

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Vietlabel AI Advisor API',
      timestamp: new Date().toISOString(),
    });
  });

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}
