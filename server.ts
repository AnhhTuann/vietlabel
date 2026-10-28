import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { testConnection } from './server/db/drizzle';
import { kbService } from './server/services/kbService';
import { createHttpApp } from './server/httpApp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

async function startServer() {
  // Test PostgreSQL connection
  let databaseAvailable = false;
  try {
    await testConnection();
    databaseAvailable = true;
  } catch (err: any) {
    console.error('⚠️ [DB Warning] Could not connect to PostgreSQL:', err.message);
    console.error('Make sure PostgreSQL is running: docker compose up -d postgres');
  }
  if (databaseAvailable) {
    try {
      await kbService.reingest();
    } catch (err) {
      console.error('⚠️ [KB Warning] Could not reload approved knowledge documents:', err);
    }
  }

  const app = createHttpApp();

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
    app.use(express.static(distPath, { maxAge: '1y' }));

    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Vietlabel Full-Stack Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
