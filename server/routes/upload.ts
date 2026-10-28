import { Router, Request, Response } from 'express';
import crypto from 'node:crypto';
import { del } from '@vercel/blob';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import {
  decodeBase64File,
  isSupportedGeneralFile,
  isValidCvFile,
  MAX_CV_SIZE,
  MAX_GENERAL_UPLOAD_SIZE,
  normalizeUploadName,
  readPrivateUpload,
  savePrivateUpload,
} from '../lib/privateUploads';
import { authService, AuthenticatedRequest } from '../services/authService';

export const uploadRouter = Router();

const ALLOWED_EXTENSIONS = new Set(['.ai', '.png', '.jpg', '.jpeg', '.eps', '.cdr', '.svg', '.pdf']);
const CONTENT_TYPES_BY_EXTENSION: Record<string, string[]> = {
  '.ai': ['application/postscript', 'application/pdf', 'application/illustrator', 'image/vnd.adobe.illustrator', 'application/octet-stream'],
  '.png': ['image/png'],
  '.jpg': ['image/jpeg'],
  '.jpeg': ['image/jpeg'],
  '.eps': ['application/postscript', 'application/eps', 'application/octet-stream'],
  '.cdr': ['application/octet-stream', 'application/x-coreldraw', 'application/x-cdr', 'application/vnd.corel-draw'],
  '.svg': ['image/svg+xml'],
  '.pdf': ['application/pdf'],
  '.doc': ['application/msword', 'application/octet-stream'],
  '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/octet-stream'],
};

uploadRouter.get('/config', (_req: Request, res: Response) => {
  res.json({ directUpload: process.env.VERCEL === '1' });
});

uploadRouter.post('/blob', async (req: Request, res: Response) => {
  if (process.env.VERCEL !== '1') {
    return res.status(404).json({ error: 'Direct uploads are only available on Vercel.' });
  }

  try {
    const body = req.body as HandleUploadBody;
    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const payload = JSON.parse(clientPayload || '{}') as { fileName?: unknown; purpose?: unknown };
        const fileName = normalizeUploadName(payload.fileName);
        const uploadId = pathname.match(/^private-uploads\/([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i)?.[1];
        const extension = fileName ? fileName.slice(fileName.lastIndexOf('.')).toLowerCase() : '';
        const isCv = payload.purpose === 'cv';
        const validExtension = isCv
          ? ['.pdf', '.doc', '.docx'].includes(extension)
          : payload.purpose === 'design' && ALLOWED_EXTENSIONS.has(extension);

        if (!uploadId || !fileName || !validExtension) {
          throw new Error('Invalid upload request');
        }

        return {
          allowedContentTypes: CONTENT_TYPES_BY_EXTENSION[extension],
          maximumSizeInBytes: isCv ? MAX_CV_SIZE : MAX_GENERAL_UPLOAD_SIZE,
          addRandomSuffix: false,
          tokenPayload: JSON.stringify({ uploadId, fileName, purpose: payload.purpose }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const payload = JSON.parse(tokenPayload || '{}') as {
          uploadId?: unknown;
          fileName?: unknown;
          purpose?: unknown;
        };
        const fileName = normalizeUploadName(payload.fileName);
        const uploadId = typeof payload.uploadId === 'string' ? payload.uploadId : '';
        const content = await readPrivateUpload(uploadId);
        const isCv = payload.purpose === 'cv';
        const isValid = fileName && (isCv
          ? content.length <= MAX_CV_SIZE && isValidCvFile(fileName, content)
          : payload.purpose === 'design' && isSupportedGeneralFile(fileName, content));

        if (!isValid) {
          await del(blob.pathname);
          throw new Error('Uploaded file content is invalid');
        }
      },
    });

    return res.json(result);
  } catch (error) {
    console.error('Failed to authorize private blob upload:', error);
    return res.status(400).json({ error: 'Không thể khởi tạo tải file lên. Vui lòng kiểm tra file và thử lại.' });
  }
});

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
      const content = await readPrivateUpload(req.params.id);
      if (!isSupportedGeneralFile(fileName, content)) {
        return res.status(404).json({ error: 'Không tìm thấy file.' });
      }
      return res.attachment(fileName).send(content);
    } catch (error) {
      console.error('Uploaded file not found:', error);
      return res.status(404).json({ error: 'Không tìm thấy file.' });
    }
  },
);
