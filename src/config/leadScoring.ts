export type LeadScoreLevel = 'HOT' | 'WARM' | 'COLD';

export interface CustomerBrief {
  fullName?: string;
  company?: string;
  contact?: string; // Phone / Zalo / Email
  email?: string;
  industry?: string; // Thực phẩm, Dược phẩm, Mỹ phẩm, Dầu nhớt, Hóa chất, Đồ uống, Khác
  productType?: string; // Tem nhãn cuộn, Hộp cứng, Túi giấy, Thùng carton, Tem pop-up, POSM...
  innerProductOrSurface?: string; // Chai HDPE, chai thủy tinh, đồ đông lạnh, chịu nhiệt, chống dầu...
  dimensions?: string; // Kích thước mm / cm
  quantity?: number | string; // Số lượng
  material?: string; // Decal nhựa PP, giấy Kraft, Ivory 350gsm, carton sóng E...
  finishing?: string; // Ép kim, cán màng bóng/mờ, UV cát, bế nổi...
  hasDesignFile?: boolean | string; // Đã có file thiết kế chưa
  attachments?: Array<{ name: string; url?: string; size?: number; type?: string }>;
  deadline?: string; // Ngày cần hàng hoặc số ngày
  deliveryLocation?: string; // Địa chỉ nhận hàng
  notes?: string;
  leadScore?: LeadScoreLevel;
}

export interface LeadScoreResult {
  level: LeadScoreLevel;
  score: number;
  reason: string;
  isEscalateRecommended: boolean;
}

export function evaluateLeadScore(brief: Partial<CustomerBrief>): LeadScoreResult {
  let score = 0;
  const reasons: string[] = [];

  // Has contact information (+30 pts)
  if (brief.contact || brief.email) {
    score += 30;
    reasons.push('Đã cung cấp thông tin liên hệ');
  }

  // Has product specification & type (+20 pts)
  if (brief.productType) {
    score += 15;
  }
  if (brief.dimensions || brief.material) {
    score += 10;
  }

  // Quantity factor
  const qtyStr = String(brief.quantity || '').replace(/\D/g, '');
  const qtyNum = parseInt(qtyStr, 10);
  if (!isNaN(qtyNum)) {
    if (qtyNum >= 10000) {
      score += 25;
      reasons.push('Số lượng quy mô lớn (>= 10,000)');
    } else if (qtyNum >= 2000) {
      score += 15;
      reasons.push('Số lượng thương mại (>= 2,000)');
    } else if (qtyNum >= 500) {
      score += 10;
    }
  }

  // Design file ready (+15 pts)
  if (brief.hasDesignFile === true || brief.hasDesignFile === 'yes' || (brief.attachments && brief.attachments.length > 0)) {
    score += 15;
    reasons.push('Đã có sẵn file thiết kế / mẫu in');
  }

  // Urgent deadline (+15 pts)
  const deadlineStr = (brief.deadline || '').toLowerCase();
  const isUrgent = deadlineStr.includes('gấp') || deadlineStr.includes('hôm nay') || deadlineStr.includes('ngày mai') || deadlineStr.includes('3 ngày') || deadlineStr.includes('tuần này');
  if (isUrgent) {
    score += 15;
    reasons.push('Yêu cầu tiến độ sản xuất gấp');
  }

  let level: LeadScoreLevel = 'COLD';
  let isEscalateRecommended = false;

  if (score >= 65 || ((brief.contact || brief.email) && (isUrgent || (brief.attachments && brief.attachments.length > 0) || qtyNum >= 10000))) {
    level = 'HOT';
    isEscalateRecommended = true;
  } else if (score >= 35) {
    level = 'WARM';
    isEscalateRecommended = false;
  } else {
    level = 'COLD';
    isEscalateRecommended = false;
  }

  return {
    level,
    score,
    reason: reasons.join(' · ') || 'Chưa đủ thông tin phân loại',
    isEscalateRecommended,
  };
}
