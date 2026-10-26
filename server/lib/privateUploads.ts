import fs from 'node:fs/promises';
import path from 'node:path';

export const MAX_CV_SIZE = 5 * 1024 * 1024;
export const MAX_GENERAL_UPLOAD_SIZE = 10 * 1024 * 1024;
const UPLOAD_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const CV_EXTENSIONS = new Set(['.pdf', '.doc', '.docx']);

export function getUploadDirectory(): string {
  return process.env.UPLOAD_DIR || path.resolve(process.cwd(), 'server/data/uploads');
}

export function getUploadPath(uploadId: string): string {
  if (!UPLOAD_ID_PATTERN.test(uploadId)) {
    throw new Error('Invalid upload id');
  }
  return path.join(getUploadDirectory(), uploadId);
}

export function normalizeUploadName(fileName: unknown): string | null {
  if (typeof fileName !== 'string') return null;
  const safeName = path.basename(fileName.replaceAll('\\', '/'))
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .trim();
  if (!safeName || safeName.length > 255) return null;
  return safeName;
}

export function decodeBase64File(fileBase64: unknown, maxSize: number): Buffer | null {
  if (typeof fileBase64 !== 'string' || fileBase64.length === 0) return null;
  if (fileBase64.length > Math.ceil(maxSize * 4 / 3) + 8 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(fileBase64)) {
    return null;
  }
  const buffer = Buffer.from(fileBase64, 'base64');
  return buffer.length > 0 && buffer.length <= maxSize ? buffer : null;
}

function hasCvSignature(buffer: Buffer, extension: string): boolean {
  if (extension === '.pdf') return buffer.subarray(0, 5).toString('ascii') === '%PDF-';
  if (extension === '.doc') {
    return buffer.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]));
  }
  return extension === '.docx' && buffer.subarray(0, 4).toString('hex') === '504b0304';
}

export function isValidCvFile(fileName: string, buffer: Buffer): boolean {
  const extension = path.extname(fileName).toLowerCase();
  return CV_EXTENSIONS.has(extension) && buffer.length <= MAX_CV_SIZE && hasCvSignature(buffer, extension);
}

export function isSupportedGeneralFile(fileName: string, buffer: Buffer): boolean {
  const extension = path.extname(fileName).toLowerCase();
  if (buffer.length > MAX_GENERAL_UPLOAD_SIZE) return false;
  if (extension === '.pdf' || extension === '.ai') {
    return buffer.subarray(0, 5).toString('ascii') === '%PDF-' || buffer.subarray(0, 10).toString('ascii').startsWith('%!PS-Adobe');
  }
  if (extension === '.eps') return buffer.subarray(0, 10).toString('ascii').startsWith('%!PS-Adobe');
  if (extension === '.png') return buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (extension === '.jpg' || extension === '.jpeg') return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (extension === '.svg') return /^\s*(?:<\?xml[^>]*>\s*)?<svg[\s>]/i.test(buffer.toString('utf8').replace(/^\uFEFF/, ''));
  if (extension === '.cdr') {
    return buffer.subarray(0, 4).toString('ascii') === 'RIFF'
      || buffer.subarray(0, 4).toString('ascii') === 'PK\u0003\u0004'
      || buffer.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]));
  }
  return false;
}

export async function savePrivateUpload(uploadId: string, content: Buffer): Promise<void> {
  const directory = getUploadDirectory();
  await fs.mkdir(directory, { recursive: true, mode: 0o700 });
  await fs.writeFile(getUploadPath(uploadId), content, { flag: 'wx', mode: 0o600 });
}
