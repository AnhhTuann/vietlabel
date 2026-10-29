import compression from 'compression';
import express, { NextFunction, Request, Response } from 'express';
// import helmet from 'helmet'; // TODO: Install helmet when npm is working
import { adminRouter } from './routes/admin.js';
import { applicationsRouter } from './routes/applications.js';
import { chatRouter } from './routes/chat.js';
import { cmsRouter } from './routes/cms.js';
import { contactRouter } from './routes/contact.js';
import { feedbackRouter } from './routes/feedback.js';
import { leadRouter } from './routes/lead.js';
import { telegramWebhookRouter } from './routes/telegramWebhook.js';
import { uploadRouter } from './routes/upload.js';
import { webhookRouter } from './routes/webhook.js';

export function createHttpApp() {
  const app = express();

  // Security headers (helmet - temporarily disabled due to npm issues)
  // app.use(helmet({
  //   contentSecurityPolicy: {
  //     directives: {
  //       defaultSrc: ["'self'"],
  //       styleSrc: ["'self'", "'unsafe-inline'"],
  //       scriptSrc: ["'self'"],
  //       imgSrc: ["'self'", "data:", "https:"],
  //       connectSrc: ["'self'"],
  //       fontSrc: ["'self'"],
  //       objectSrc: ["'none'"],
  //       mediaSrc: ["'self'"],
  //       frameSrc: ["'none'"],
  //     },
  //   },
  //   crossOriginEmbedderPolicy: false,
  // }));

  // Manual security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

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
