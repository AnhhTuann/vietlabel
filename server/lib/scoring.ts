export type LeadScore = 'HOT' | 'WARM' | 'COLD';

export interface LeadScoringInput {
  fullName?: string;
  contact?: string; // SĐT / Zalo / Email
  email?: string;
  productType?: string;
  quantity?: number | string;
  dimensions?: string;
  material?: string;
  deadline?: string;
  hasDesignFile?: boolean | string;
  attachments?: Array<any>;
  needHuman?: boolean;
}

export interface LeadScoreResult {
  score: LeadScore;
  points: number;
  reasons: string[];
  isHot: boolean;
  needsHandoff: boolean;
}

export function computeLeadScore(data: LeadScoringInput): LeadScoreResult {
  let points = 0;
  const reasons: string[] = [];

  const hasContact = Boolean(
    (data.contact && data.contact.trim().length >= 8) ||
    (data.email && data.email.includes('@'))
  );

  const hasProduct = Boolean(data.productType && data.productType.trim().length >= 2);

  // Parse quantity
  const qtyStr = String(data.quantity || '').replace(/\D/g, '');
  const qtyNum = parseInt(qtyStr, 10);
  const isHighVolume = !isNaN(qtyNum) && qtyNum >= 5000;
  const isMediumVolume = !isNaN(qtyNum) && qtyNum >= 1000;

  // Check deadline
  const deadlineStr = (data.deadline || '').toLowerCase();
  const isUrgentDeadline =
    deadlineStr.includes('gấp') ||
    deadlineStr.includes('hôm nay') ||
    deadlineStr.includes('ngày mai') ||
    deadlineStr.includes('2 ngày') ||
    deadlineStr.includes('3 ngày') ||
    deadlineStr.includes('tuần này');

  // Check design file
  const hasDesign = Boolean(
    data.hasDesignFile === true ||
    data.hasDesignFile === 'yes' ||
    (data.attachments && data.attachments.length > 0)
  );

  if (hasContact) {
    points += 35;
    reasons.push('Đã cung cấp liên hệ SĐT/Zalo/Email');
  }

  if (hasProduct) {
    points += 20;
    reasons.push(`Đã xác định loại sản phẩm (${data.productType})`);
  }

  if (isHighVolume) {
    points += 25;
    reasons.push(`Số lượng quy mô lớn (${qtyNum.toLocaleString('vi-VN')} đơn vị)`);
  } else if (isMediumVolume) {
    points += 15;
    reasons.push(`Số lượng tiêu chuẩn (${qtyNum.toLocaleString('vi-VN')} đơn vị)`);
  }

  if (hasDesign) {
    points += 15;
    reasons.push('Đã có sẵn file thiết kế in ấn');
  }

  if (isUrgentDeadline) {
    points += 20;
    reasons.push('Tiến độ sản xuất gấp (< 7 ngày)');
  }

  if (data.needHuman) {
    points += 25;
    reasons.push('Khách hàng yêu cầu hỗ trợ trực tiếp từ nhân viên');
  }

  // Determination rules:
  // HOT: đủ trường bắt buộc + có liên hệ + (số lượng >= ngưỡng hoặc deadline < 7 ngày hoặc đã có file thiết kế) hoặc yêu cầu gặp người
  let score: LeadScore = 'COLD';
  let isHot = false;

  if (data.needHuman && hasContact) {
    score = 'HOT';
    isHot = true;
  } else if (hasContact && hasProduct && (isHighVolume || isUrgentDeadline || hasDesign || points >= 65)) {
    score = 'HOT';
    isHot = true;
  } else if (hasContact || hasProduct || isMediumVolume || points >= 30) {
    score = 'WARM';
  } else {
    score = 'COLD';
  }

  return {
    score,
    points,
    reasons,
    isHot,
    needsHandoff: isHot || Boolean(data.needHuman),
  };
}
