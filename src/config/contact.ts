export interface ContactConfig {
  companyName: string;
  companyShortName: string;
  hotline: string;
  hotlineDisplay: string;
  landline: string;
  landlineDisplay: string;
  email: string;
  salesEmail: string;
  zaloId: string;
  zaloUrl: string;
  messengerUsername: string;
  messengerUrl: string;
  address: string;
  factoryAddress: string;
  workingHours: string;
  supportHoursNotice: string;
}

export const CONTACT_CONFIG: ContactConfig = {
  companyName: 'Công ty Cổ phần Sản xuất Thương mại Vietlabel',
  companyShortName: 'Vietlabel Packaging',
  hotline: import.meta.env.VITE_HOTLINE || '0868968089',
  hotlineDisplay: '(+84) 086 896 8089',
  landline: '02837658888',
  landlineDisplay: '(028) 3765 8888',
  email: 'thien@vietlabel.com.vn',
  salesEmail: 'baogia@vietlabel.com.vn',
  zaloId: import.meta.env.VITE_ZALO_OA_ID || '0868968089',
  zaloUrl: import.meta.env.VITE_ZALO_URL || 'https://zalo.me/0868968089',
  messengerUsername: import.meta.env.VITE_FB_PAGE_USERNAME || 'vietlabel.vn',
  messengerUrl: import.meta.env.VITE_MESSENGER_URL || 'https://m.me/vietlabel.vn',
  address: '266/6 Lê Thị Riêng, Phường Thới An, TP. Hồ Chí Minh, Việt Nam',
  factoryAddress: '266/6 Lê Thị Riêng, Phường Thới An, TP. Hồ Chí Minh',
  workingHours: '8:00 - 17:30 (Thứ 2 - Thứ 7)',
  supportHoursNotice: 'Kỹ sư dự toán trực tiếp hỗ trợ 8h00 - 18h00 (T2 - T7). Ngoài giờ, AI sẽ ghi nhận và gửi phản hồi ngay đầu giờ sáng.',
};
