import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  decodeBase64File,
  isSupportedGeneralFile,
  isValidCvFile,
  normalizeUploadName,
} from '../server/lib/privateUploads';

describe('private upload validation', () => {
  it('accepts PDF CV content and rejects extension/signature mismatches', () => {
    const pdf = Buffer.from('%PDF-1.7\nresume');
    assert.equal(isValidCvFile('resume.pdf', pdf), true);
    assert.equal(isValidCvFile('resume.docx', pdf), false);
    assert.equal(isValidCvFile('resume.exe', pdf), false);
  });

  it('rejects unsupported or empty base64 payloads', () => {
    assert.equal(decodeBase64File('', 100), null);
    assert.equal(decodeBase64File('not base64!', 100), null);
    assert.equal(decodeBase64File(Buffer.alloc(101).toString('base64'), 100), null);
    assert.deepEqual(decodeBase64File(Buffer.from('content').toString('base64'), 100), Buffer.from('content'));
  });

  it('normalizes client file names without allowing path components', () => {
    assert.equal(normalizeUploadName('../../resume.pdf'), 'resume.pdf');
    assert.equal(normalizeUploadName(''), null);
    assert.equal(normalizeUploadName('a'.repeat(256) + '.pdf'), null);
  });

  it('validates actual image bytes for general uploads', () => {
    const png = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0]);
    assert.equal(isSupportedGeneralFile('art.png', png), true);
    assert.equal(isSupportedGeneralFile('art.png', Buffer.from('not an image')), false);
  });
});
