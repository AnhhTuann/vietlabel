import { Router, Request, Response } from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import {
  decodeBase64File,
  getUploadPath,
  isSupportedGeneralFile,
  isValidCvFile,
  MAX_CV_SIZE,
  MAX_GENERAL_UPLOAD_SIZE,
  normalizeUploadName,
  savePrivateUpload,
} from '../lib/privateUploads';
import { authService, AuthenticatedRequest } from '../services/authService';

export const uploadRouter = Router();

const ALLOWED_EXTENSIONS = new Set(['.ai', '.png', '.jpg', '.jpeg', '.eps', '.cdr', '.svg', '.pdf']);

uploadRouter.post('/', async (req: Request, res: Response) => {
  const fileName = normalizeUploadName(req.body?.fileName);
  if (!fileName) return res.status(400).json({ error: 'Tên file không hợp lệ.' });

  const extension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(extension)) {
    return res.status(400).json({ error: 'Định dạng file không được hỗ trợ.' });
  }

  const content = decodeBase64File(req.body?.fileBase64, MAX_GENERAL_UPLOAD_SIZE);
  if (!content || !isSupportedGeneralFile(fileName, content)) {
    return res.status(400).json({ error: 'Nội dung file không hợp lệ hoặc vượt quá giới hạn 10MB.' });
  }

  try {
    const id = crypto.randomUUID();
    await savePrivateUpload(id, content);
    return res.status(201).json({
      success: true,
      file: {
        id,
        name: fileName,
        size: content.length,
        url: `/api/upload/${id}?name=${encodeURIComponent(fileName)}`,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Failed to store uploaded file:', error);
    return res.status(500).json({ error: 'Không thể lưu file. Vui lòng thử lại.' });
  }
});

uploadRouter.post('/cv', async (req: Request, res: Response) => {
  const fileName = normalizeUploadName(req.body?.fileName);
  if (!fileName) return res.status(400).json({ error: 'Tên file CV không hợp lệ.' });

  const content = decodeBase64File(req.body?.fileBase64, MAX_CV_SIZE);
  if (!content || !isValidCvFile(fileName, content)) {
    return res.status(400).json({ error: 'Chỉ nhận CV PDF/DOC/DOCX hợp lệ, tối đa 5MB.' });
  }

  try {
    const uploadId = crypto.randomUUID();
    await savePrivateUpload(uploadId, content);
    return res.status(201).json({ success: true, uploadId, fileName, fileSize: content.length });
  } catch (error) {
    console.error('Failed to store CV upload:', error);
    return res.status(500).json({ error: 'Không thể lưu CV. Vui lòng thử lại.' });
  }
});

uploadRouter.get(
  '/:id',
  authService.middleware,
  authService.requireRole(['ADMIN', 'MANAGER', 'SALES']),
  async (req: AuthenticatedRequest, res: Response) => {
    const fileName = normalizeUploadName(req.query.name) || 'customer-upload';
    try {
      const uploadPath = getUploadPath(req.params.id);
      await fs.access(uploadPath);
      return res.download(uploadPath, fileName, (error) => {
        if (error) {
          console.error('Failed to download uploaded file:', error);
          if (!res.headersSent) res.status(500).json({ error: 'Không thể tải file.' });
        }
      });
    } catch (error) {
      console.error('Uploaded file not found:', error);
      return res.status(404).json({ error: 'Không tìm thấy file.' });
    }
  },
);
