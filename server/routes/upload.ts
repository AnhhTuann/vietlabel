import { Router, Request, Response } from 'express';

export const uploadRouter = Router();

const ALLOWED_EXTENSIONS = ['.pdf', '.ai', '.png', '.jpg', '.jpeg', '.eps', '.cdr', '.svg'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

uploadRouter.post('/', (req: Request, res: Response) => {
  const { fileName, fileSize, fileBase64 } = req.body;

  if (!fileName) {
    return res.status(400).json({ error: 'Tên file không hợp lệ.' });
  }

  const ext = (fileName.substring(fileName.lastIndexOf('.')) || '').toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return res.status(400).json({
      error: `Định dạng ${ext} không được hỗ trợ. Vui lòng tải file PDF, AI, PNG, JPG, EPS hoặc CDR.`,
    });
  }

  if (fileSize && fileSize > MAX_SIZE_BYTES) {
    return res.status(400).json({
      error: 'Dung lượng file vượt quá giới hạn 10MB.',
    });
  }

  // Simulated secure upload reference URL
  const fileId = `file_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
  const fileUrl = `/uploads/${fileId}`;

  return res.json({
    success: true,
    file: {
      id: fileId,
      name: fileName,
      size: fileSize || 0,
      url: fileUrl,
      uploadedAt: new Date().toISOString(),
    },
  });
});
