import express from 'express';
import path from 'node:path';
import { createHttpApp } from './server/httpApp';

const app = createHttpApp();
const distPath = path.resolve(process.cwd(), 'dist');

app.use(express.static(distPath, { maxAge: '1y' }));
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

export default app;
