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
