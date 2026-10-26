import { Router, Request, Response } from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import { z } from 'zod';
import { db } from '../db/store';
import { getUploadPath, isValidCvFile, MAX_CV_SIZE, normalizeUploadName } from '../lib/privateUploads';
import { authService, AuthenticatedRequest } from '../services/authService';

export const applicationsRouter = Router();

const applicationSchema = z.object({
  jobId: z.string().min(1).max(100),
  fullName: z.string().trim().min(2).max(150),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(9).max(30),
  coverLetter: z.string().max(5000).optional().default(''),
  uploadId: z.string().uuid(),
  cvFileName: z.string().min(1).max(255),
});

applicationsRouter.post('/', async (req: Request, res: Response) => {
  const parsed = applicationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Thông tin ứng tuyển chưa hợp lệ.' });
  }

  const fileName = normalizeUploadName(parsed.data.cvFileName);
  if (!fileName) return res.status(400).json({ error: 'Tên file CV không hợp lệ.' });

  try {
    const job = await db.jobs.findById(parsed.data.jobId);
    const deadline = job ? Date.parse(job.deadline) : Number.NaN;
    if (!job || job.status !== 'OPEN' || !Number.isFinite(deadline) || deadline < Date.now()) {
      return res.status(400).json({ error: 'Vị trí tuyển dụng này hiện không nhận hồ sơ.' });
    }

    const storagePath = getUploadPath(parsed.data.uploadId);
    const cv = await fs.readFile(storagePath);
    if (cv.length > MAX_CV_SIZE || !isValidCvFile(fileName, cv)) {
      return res.status(400).json({ error: 'File CV không hợp lệ hoặc vượt quá 5MB.' });
    }

    const application = await db.jobApplications.create({
      id: crypto.randomUUID(),
      jobId: job.id,
      fullName: parsed.data.fullName,
      email: parsed.data.email.toLowerCase(),
      phone: parsed.data.phone,
      coverLetter: parsed.data.coverLetter,
      cvStorageKey: parsed.data.uploadId,
      cvFileName: fileName,
      cvFileSize: cv.length,
      status: 'NEW',
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({
      success: true,
      message: 'Hồ sơ ứng tuyển đã được gửi thành công đến Phòng Nhân sự Vietlabel.',
      applicationId: application.id,
    });
  } catch (error) {
    console.error('Failed to save job application:', error);
    return res.status(500).json({ error: 'Không thể lưu hồ sơ ứng tuyển. Vui lòng thử lại sau.' });
  }
});

applicationsRouter.get(
  '/admin',
  authService.middleware,
  authService.requireRole(['ADMIN', 'MANAGER']),
  async (_req: AuthenticatedRequest, res: Response) => {
    try {
      const applications = await db.jobApplications.list();
      return res.json({
        applications: applications.map(({ cvStorageKey: _storageKey, ...application }) => application),
      });
    } catch (error) {
      console.error('Failed to list job applications:', error);
      return res.status(500).json({ error: 'Không thể tải danh sách hồ sơ ứng tuyển.' });
    }
  },
);

applicationsRouter.get(
  '/admin/:id/cv',
  authService.middleware,
  authService.requireRole(['ADMIN', 'MANAGER']),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const application = await db.jobApplications.findById(req.params.id);
      if (!application) return res.status(404).json({ error: 'Không tìm thấy hồ sơ ứng tuyển.' });
      const storagePath = getUploadPath(application.cvStorageKey);
      await fs.access(storagePath);
      return res.download(storagePath, application.cvFileName, (error) => {
        if (error) {
          console.error('Failed to download application CV:', error);
          if (!res.headersSent) res.status(500).json({ error: 'Không thể tải file CV.' });
        }
      });
    } catch (error) {
      console.error('Failed to locate application CV:', error);
      return res.status(404).json({ error: 'Không tìm thấy file CV.' });
    }
  },
);
