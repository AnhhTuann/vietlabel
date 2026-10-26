import { fileToBase64 } from './fileEncoding';

export interface ContactFormData {
  fullName: string;
  company: string;
  email: string;
  phone?: string;
  productInterest?: string;
  quantity?: string;
  message: string;
  honeypot?: string; // spam protection
}

export interface JobApplicationData {
  jobId: string;
  fullName: string;
  email: string;
  phone: string;
  coverLetter?: string;
}

export async function submitContact(data: ContactFormData): Promise<{ success: boolean; message: string; trackingId?: string }> {
  // Honeypot spam check
  if (data.honeypot && data.honeypot.trim() !== '') {
    // Silently drop bot submissions
    return { success: true, message: 'Yêu cầu đã được gửi thành công.', trackingId: 'AP-SPAM-000' };
  }

  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: data.fullName,
      company: data.company,
      email: data.email,
      phone: data.phone,
      type: data.productInterest || 'Hộp giấy & Tem nhãn',
      quantity: data.quantity,
      description: data.message,
    }),
  });

  const result = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(result.error || 'Không thể gửi yêu cầu đến máy chủ. Vui lòng thử lại.');
  }

  return {
    success: true,
    message: 'Yêu cầu báo giá đã được chuyển đến bộ phận dự toán kỹ thuật Vietlabel. Chúng tôi sẽ liên hệ trong 2 giờ.',
    trackingId: result.trackingId,
  };
}

export async function submitJobApplication(
  data: JobApplicationData,
  cvFile: File,
): Promise<{ success: boolean; message: string }> {
  const uploadResponse = await fetch('/api/upload/cv', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: cvFile.name,
      fileBase64: await fileToBase64(cvFile),
    }),
  });
  const uploadResult = await uploadResponse.json().catch(() => ({}));
  if (!uploadResponse.ok) {
    throw new Error(uploadResult.error || 'Không thể tải CV lên máy chủ.');
  }

  const response = await fetch('/api/applications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jobId: data.jobId,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      coverLetter: data.coverLetter,
      uploadId: uploadResult.uploadId,
      cvFileName: cvFile.name,
    }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || 'Không thể gửi hồ sơ ứng tuyển.');
  }
  return result;
}

export const api = {
  get: async (url: string) => {
    const res = await fetch(`/api${url}`);
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    return { data };
  },
  post: async (url: string, body: any) => {
    const res = await fetch(`/api${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    return { data };
  },
  put: async (url: string, body: any) => {
    const res = await fetch(`/api${url}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    return { data };
  },
  delete: async (url: string) => {
    const res = await fetch(`/api${url}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    return { data };
  }
};
