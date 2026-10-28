import { Router, Request, Response } from 'express';
import { db } from '../db/store.js';
import { authService, AuthenticatedRequest } from '../services/authService.js';

// We need a simple UUID generator since uuid might not be installed, or we can use crypto
import crypto from 'crypto';

export const cmsRouter = Router();

// CATEGORIES
cmsRouter.get('/categories', async (req: Request, res: Response) => {
  res.json(await db.categories.list());
});

// Bug #4 fix: require ADMIN or MANAGER for all write operations
cmsRouter.post('/categories', authService.middleware, authService.requireRole(['ADMIN', 'MANAGER']), async (req: AuthenticatedRequest, res: Response) => {
  const { name, slug, parentId, order } = req.body;
  if (!name || !slug) return res.status(400).json({ error: 'Tên và slug là bắt buộc.' });
  const newCat = await db.categories.create({
    id: `cat_${crypto.randomUUID()}`,
    name,
    slug,
    parentId,
    order: order || 0
  });
  res.json(newCat);
});

cmsRouter.put('/categories/:id', authService.middleware, authService.requireRole(['ADMIN', 'MANAGER']), async (req: AuthenticatedRequest, res: Response) => {
  const updated = await db.categories.update(req.params.id, req.body);
  if (updated) res.json(updated);
  else res.status(404).json({ error: 'Not found' });
});

cmsRouter.delete('/categories/:id', authService.middleware, authService.requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  const success = await db.categories.delete(req.params.id);
  res.json({ success });
});

// PRODUCTS
cmsRouter.get('/products', async (req: Request, res: Response) => {
  res.json(await db.products.list());
});

cmsRouter.post('/products', authService.middleware, authService.requireRole(['ADMIN', 'MANAGER']), async (req: AuthenticatedRequest, res: Response) => {
  const { categoryId, name, slug, description, images, specs, isActive } = req.body;
  if (!categoryId || !name || !slug) return res.status(400).json({ error: 'categoryId, tên và slug là bắt buộc.' });
  const newProd = await db.products.create({
    id: `prod_${crypto.randomUUID()}`,
    categoryId,
    name,
    slug,
    description: description || '',
    images: images || [],
    specs: specs || {},
    isActive: isActive !== undefined ? isActive : true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  res.json(newProd);
});

cmsRouter.put('/products/:id', authService.middleware, authService.requireRole(['ADMIN', 'MANAGER']), async (req: AuthenticatedRequest, res: Response) => {
  const updated = await db.products.update(req.params.id, req.body);
  if (updated) res.json(updated);
  else res.status(404).json({ error: 'Not found' });
});

cmsRouter.delete('/products/:id', authService.middleware, authService.requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  const success = await db.products.delete(req.params.id);
  res.json({ success });
});

// POSTS (News)
cmsRouter.get('/posts', async (req: Request, res: Response) => {
  res.json(await db.posts.list());
});

cmsRouter.post('/posts', authService.middleware, authService.requireRole(['ADMIN', 'MANAGER']), async (req: AuthenticatedRequest, res: Response) => {
  const { title, slug, summary, content, imageUrl, category, status } = req.body;
  if (!title) return res.status(400).json({ error: 'Tiêu đề là bắt buộc.' });
  const newPost = await db.posts.create({
    id: `post_${crypto.randomUUID()}`,
    title,
    slug: slug || title?.toLowerCase().replace(/ /g, '-'),
    summary: summary || '',
    content: content || '',
    imageUrl: imageUrl || '',
    category: category || 'Tin tức',
    status: status || 'DRAFT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  res.json(newPost);
});

cmsRouter.put('/posts/:id', authService.middleware, authService.requireRole(['ADMIN', 'MANAGER']), async (req: AuthenticatedRequest, res: Response) => {
  const updated = await db.posts.update(req.params.id, req.body);
  if (updated) res.json(updated);
  else res.status(404).json({ error: 'Not found' });
});

cmsRouter.delete('/posts/:id', authService.middleware, authService.requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  const success = await db.posts.delete(req.params.id);
  res.json({ success });
});

// JOBS (Careers)
cmsRouter.get('/jobs', async (req: Request, res: Response) => {
  res.json(await db.jobs.list());
});

cmsRouter.post('/jobs', authService.middleware, authService.requireRole(['ADMIN', 'MANAGER']), async (req: AuthenticatedRequest, res: Response) => {
  const { title, department, location, type, description, requirements, benefits, status, deadline } = req.body;
  if (!title) return res.status(400).json({ error: 'Tiêu đề là bắt buộc.' });
  const newJob = await db.jobs.create({
    id: `job_${crypto.randomUUID()}`,
    title,
    department: department || 'Sản xuất',
    location: location || 'Nhà máy',
    type: type || 'Toàn thời gian',
    description: description || '',
    requirements: requirements || '',
    benefits: benefits || '',
    status: status || 'OPEN',
    deadline: deadline || new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  res.json(newJob);
});

cmsRouter.put('/jobs/:id', authService.middleware, authService.requireRole(['ADMIN', 'MANAGER']), async (req: AuthenticatedRequest, res: Response) => {
  const updated = await db.jobs.update(req.params.id, req.body);
  if (updated) res.json(updated);
  else res.status(404).json({ error: 'Not found' });
});

cmsRouter.delete('/jobs/:id', authService.middleware, authService.requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  const success = await db.jobs.delete(req.params.id);
  res.json({ success });
});
