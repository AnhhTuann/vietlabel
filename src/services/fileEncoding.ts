export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Không thể đọc nội dung file.'));
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('Không thể đọc nội dung file.'));
        return;
      }
      const separator = result.indexOf(',');
      if (separator < 0) {
        reject(new Error('Định dạng file không hợp lệ.'));
        return;
      }
      resolve(result.slice(separator + 1));
    };
    reader.readAsDataURL(file);
  });
}

export async function uploadFileToPrivateBlob(file: File, purpose: 'cv' | 'design'): Promise<string | null> {
  const configResponse = await fetch('/api/upload/config');
  if (!configResponse.ok) throw new Error('Không thể kiểm tra cấu hình tải file.');

  const config = await configResponse.json() as { directUpload?: boolean };
  if (!config.directUpload) return null;

  const uploadId = crypto.randomUUID();
  const { upload } = await import('@vercel/blob/client');
  await upload(`private-uploads/${uploadId}`, file, {
    access: 'private',
    contentType: file.type || 'application/octet-stream',
    handleUploadUrl: '/api/upload/blob',
    clientPayload: JSON.stringify({ fileName: file.name, purpose }),
  });
  return uploadId;
}
