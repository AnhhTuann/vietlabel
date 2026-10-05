import { Router, Request, Response } from 'express';
import { db } from '../db/store';

// We need a simple UUID generator since uuid might not be installed, or we can use crypto
import crypto from 'crypto';

export const cmsRouter = Router();

// CATEGORIES
cmsRouter.get('/categories', (req: Request, res: Response) => {
  res.json(db.categories.list());
});

cmsRouter.post('/categories', (req: Request, res: Response) => {
  const { name, slug, parentId, order } = req.body;
  const newCat = db.categories.create({
    id: `cat_${crypto.randomUUID()}`,
    name,
    slug,
    parentId,
    order: order || 0
  });
  res.json(newCat);
});

cmsRouter.delete('/categories/:id', (req: Request, res: Response) => {
  const success = db.categories.delete(req.params.id);
  res.json({ success });
});

// PRODUCTS
cmsRouter.get('/products', (req: Request, res: Response) => {
  res.json(db.products.list());
});

cmsRouter.post('/products', (req: Request, res: Response) => {
  const { categoryId, name, slug, description, images, specs, isActive } = req.body;
  const newProd = db.products.create({
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

cmsRouter.put('/products/:id', (req: Request, res: Response) => {
  const updated = db.products.update(req.params.id, req.body);
  if (updated) res.json(updated);
  else res.status(404).json({ error: 'Not found' });
});

cmsRouter.delete('/products/:id', (req: Request, res: Response) => {
  const success = db.products.delete(req.params.id);
  res.json({ success });
});

// POSTS (News)
cmsRouter.get('/posts', (req: Request, res: Response) => {
  res.json(db.posts.list());
});

cmsRouter.post('/posts', (req: Request, res: Response) => {
  const { title, slug, summary, content, imageUrl, category, status } = req.body;
  const newPost = db.posts.create({
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

cmsRouter.put('/posts/:id', (req: Request, res: Response) => {
  const updated = db.posts.update(req.params.id, req.body);
  if (updated) res.json(updated);
  else res.status(404).json({ error: 'Not found' });
});

cmsRouter.delete('/posts/:id', (req: Request, res: Response) => {
  const success = db.posts.delete(req.params.id);
  res.json({ success });
});

// JOBS (Careers)
cmsRouter.get('/jobs', (req: Request, res: Response) => {
  res.json(db.jobs.list());
});

cmsRouter.post('/jobs', (req: Request, res: Response) => {
  const { title, department, location, type, description, requirements, benefits, status, deadline } = req.body;
  const newJob = db.jobs.create({
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

cmsRouter.put('/jobs/:id', (req: Request, res: Response) => {
  const updated = db.jobs.update(req.params.id, req.body);
  if (updated) res.json(updated);
  else res.status(404).json({ error: 'Not found' });
});

cmsRouter.delete('/jobs/:id', (req: Request, res: Response) => {
  const success = db.jobs.delete(req.params.id);
  res.json({ success });
});
