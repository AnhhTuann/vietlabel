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
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  coverLetter?: string;
  cvFileName?: string;
  cvFileSize?: number;
}

export async function submitContact(data: ContactFormData): Promise<{ success: boolean; message: string; trackingId?: string }> {
  // Honeypot spam check
  if (data.honeypot && data.honeypot.trim() !== '') {
    // Silently drop bot submissions
    return { success: true, message: 'Yêu cầu đã được gửi thành công.', trackingId: 'AP-SPAM-000' };
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const trackingId = `VL-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Store in localStorage for audit / demo preview if in browser
  try {
    const existing = JSON.parse(localStorage.getItem('vietlabel_inquiries') || '[]');
    existing.unshift({
      ...data,
      trackingId,
      submittedAt: new Date().toISOString(),
    });
    localStorage.setItem('vietlabel_inquiries', JSON.stringify(existing.slice(0, 50)));
  } catch (e) {
    console.error('Storage error', e);
  }

  return {
    success: true,
    message: 'Yêu cầu báo giá đã được chuyển đến bộ phận dự toán kỹ thuật Vietlabel. Chúng tôi sẽ liên hệ trong 2 giờ.',
    trackingId,
  };
}

export async function submitJobApplication(data: JobApplicationData): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 900));

  try {
    const existing = JSON.parse(localStorage.getItem('vietlabel_applications') || '[]');
    existing.unshift({
      ...data,
      submittedAt: new Date().toISOString(),
    });
    localStorage.setItem('vietlabel_applications', JSON.stringify(existing.slice(0, 30)));
  } catch (e) {
    console.error('Storage error', e);
  }

  return {
    success: true,
    message: 'Hồ sơ ứng tuyển đã được gửi thành công đến Phòng Nhân sự Vietlabel.',
  };
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
