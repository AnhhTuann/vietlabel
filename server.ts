import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { chatRouter } from './server/routes/chat';
import { leadRouter } from './server/routes/lead';
import { uploadRouter } from './server/routes/upload';
import { feedbackRouter } from './server/routes/feedback';
import { webhookRouter } from './server/routes/webhook';
import { telegramWebhookRouter } from './server/routes/telegramWebhook';
import { adminRouter } from './server/routes/admin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

async function startServer() {
  const app = express();

  // Basic security and parsing middlewares
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // API Routes
  app.use('/api/chat', chatRouter);
  app.use('/api/lead', leadRouter);
  app.use('/api/upload', uploadRouter);
  app.use('/api/feedback', feedbackRouter);
  app.use('/api/webhook', webhookRouter);
  app.use('/api/telegram/webhook', telegramWebhookRouter);
  app.use('/api/admin', adminRouter);

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Vietlabel AI Advisor API',
      timestamp: new Date().toISOString(),
    });
  });

  if (!isProduction) {
    // Development mode: Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: Number(PORT),
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    // Production mode: Serve dist folder
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));

    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });

  app.listen(PORT, () => {
    console.log(`Vietlabel Full-Stack Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
