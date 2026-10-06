import React, { useState } from 'react';
import { CustomerBrief, LeadScoreLevel } from '../../config/leadScoring';
import { CheckCircle2, Send, Edit2, AlertCircle, Sparkles, Building, Phone, Mail, User } from 'lucide-react';
import { Button } from '../ui/Button';

interface BriefCardProps {
  initialBrief: CustomerBrief;
  leadScore: LeadScoreLevel;
  onSubmit: (brief: CustomerBrief) => Promise<any>;
  isSubmitted: boolean;
  leadId?: string | null;
}

export const BriefCard: React.FC<BriefCardProps> = ({
  initialBrief,
  leadScore,
  onSubmit,
  isSubmitted,
  leadId,
}) => {
  const [brief, setBrief] = useState<CustomerBrief>(initialBrief);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brief.contact && !brief.email) {
      setError('Vui lòng nhập Số điện thoại hoặc Email để kỹ sư Vietlabel gửi báo giá.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(brief);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi gửi thông tin');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="my-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 animate-in fade-in">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <h4 className="font-bold text-sm">Yêu cầu báo giá đã được chuyển tiếp!</h4>
        </div>
        <p className="text-xs text-emerald-700 mt-1.5 leading-relaxed">
          Mã hồ sơ: <span className="font-mono font-bold">{leadId || 'VL-PENDING'}</span>. Chuyên viên kỹ thuật Vietlabel đang thẩm định quy cách và sẽ liên hệ trong 2 giờ.
        </p>
      </div>
    );
  }

  return (
    <div className="my-3 rounded-2xl bg-gradient-to-br from-amber-50/50 via-white to-red-50/40 border-2 border-[#BE1E2D]/30 p-4 shadow-sm text-xs sm:text-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-amber-200/60">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#BE1E2D] text-white flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-xs sm:text-sm leading-tight">
              Tóm Tắt Yêu Cầu Sản Xuất (Customer Brief)
            </h4>
            <span className="text-[10px] text-slate-500">
              Kiểm tra thông số trước khi chuyển kỹ sư dự toán
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="text-[#1E4384] hover:text-[#BE1E2D] text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
        >
          <Edit2 className="w-3 h-3" />
          <span>{isEditing ? 'Thu gọn' : 'Chỉnh sửa'}</span>
        </button>
      </div>

      {error && (
        <div className="mb-2.5 p-2 rounded-lg bg-rose-50 text-rose-700 text-xs flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form or Summary View */}
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-semibold text-slate-600 block">Họ tên khách hàng</label>
              <input
                type="text"
                value={brief.fullName || ''}
                onChange={e => setBrief({ ...brief, fullName: e.target.value })}
                placeholder="Nguyễn Văn A"
                className="w-full text-xs p-1.5 border border-slate-300 rounded-md focus:border-[#BE1E2D] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-600 block">Công ty / Thương hiệu</label>
              <input
                type="text"
                value={brief.company || ''}
                onChange={e => setBrief({ ...brief, company: e.target.value })}
                placeholder="Công ty TNHH..."
                className="w-full text-xs p-1.5 border border-slate-300 rounded-md focus:border-[#BE1E2D] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-semibold text-slate-600 block">SĐT / Zalo <span className="text-rose-500">*</span></label>
              <input
                type="text"
                value={brief.contact || ''}
                onChange={e => setBrief({ ...brief, contact: e.target.value })}
                placeholder="0987 654 321"
                className="w-full text-xs p-1.5 border border-slate-300 rounded-md focus:border-[#BE1E2D] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-600 block">Email</label>
              <input
                type="email"
                value={brief.email || ''}
                onChange={e => setBrief({ ...brief, email: e.target.value })}
                placeholder="email@congty.com"
                className="w-full text-xs p-1.5 border border-slate-300 rounded-md focus:border-[#BE1E2D] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-semibold text-slate-600 block">Loại sản phẩm <span className="text-rose-500">*</span></label>
              <input
                type="text"
                value={brief.productType || ''}
                onChange={e => setBrief({ ...brief, productType: e.target.value })}
                placeholder="Tem nhãn cuộn decal, hộp cứng..."
                className="w-full text-xs p-1.5 border border-slate-300 rounded-md focus:border-[#BE1E2D] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-600 block">Số lượng dự kiến</label>
              <input
                type="text"
                value={brief.quantity || ''}
                onChange={e => setBrief({ ...brief, quantity: e.target.value })}
                placeholder="Ví dụ: 10,000 tem / 1,000 hộp"
                className="w-full text-xs p-1.5 border border-slate-300 rounded-md focus:border-[#BE1E2D] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-semibold text-slate-600 block">Kích thước</label>
              <input
                type="text"
                value={brief.dimensions || ''}
                onChange={e => setBrief({ ...brief, dimensions: e.target.value })}
                placeholder="Dài x Rộng x Cao (cm/mm)"
                className="w-full text-xs p-1.5 border border-slate-300 rounded-md focus:border-[#BE1E2D] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-600 block">Chất liệu / Gia công</label>
              <input
                type="text"
                value={brief.material || ''}
                onChange={e => setBrief({ ...brief, material: e.target.value })}
                placeholder="Decal nhựa PP, giấy Ivory, cán màng..."
                className="w-full text-xs p-1.5 border border-slate-300 rounded-md focus:border-[#BE1E2D] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-slate-600 block">Môi trường sử dụng / Bề mặt dán</label>
            <input
              type="text"
              value={brief.innerProductOrSurface || ''}
              onChange={e => setBrief({ ...brief, innerProductOrSurface: e.target.value })}
              placeholder="Can nhớt HDPE, chai thủy tinh, đồ đông lạnh, chịu nhiệt..."
              className="w-full text-xs p-1.5 border border-slate-300 rounded-md focus:border-[#BE1E2D] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-semibold text-slate-600 block">Thời gian cần nhận hàng</label>
              <input
                type="text"
                value={brief.deadline || ''}
                onChange={e => setBrief({ ...brief, deadline: e.target.value })}
                placeholder="Trong 5 ngày, tuần tới..."
                className="w-full text-xs p-1.5 border border-slate-300 rounded-md focus:border-[#BE1E2D] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-600 block">Khu vực giao hàng</label>
              <input
                type="text"
                value={brief.deliveryLocation || ''}
                onChange={e => setBrief({ ...brief, deliveryLocation: e.target.value })}
                placeholder="TP. HCM, Bình Dương, Đồng Nai..."
                className="w-full text-xs p-1.5 border border-slate-300 rounded-md focus:border-[#BE1E2D] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting}
              className="bg-[#BE1E2D] hover:bg-[#D04210]"
            >
              <Send className="w-3.5 h-3.5 mr-1" />
              <span>{isSubmitting ? 'Đang gửi...' : 'Gửi cho nhân viên'}</span>
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-1.5">
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-slate-700">
            {brief.fullName && (
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate"><strong>Tên:</strong> {brief.fullName}</span>
              </div>
            )}
            {brief.company && (
              <div className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate"><strong>Cty:</strong> {brief.company}</span>
              </div>
            )}
            {brief.contact && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate"><strong>SĐT/Zalo:</strong> {brief.contact}</span>
              </div>
            )}
            {brief.email && (
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="truncate"><strong>Email:</strong> {brief.email}</span>
              </div>
            )}
          </div>

          <div className="pt-1.5 border-t border-slate-200/60 grid grid-cols-2 gap-x-2 gap-y-1 text-slate-700">
            <div>
              <span className="text-slate-500">Sản phẩm:</span> <strong>{brief.productType || 'Chưa rõ'}</strong>
            </div>
            {brief.quantity && (
              <div>
                <span className="text-slate-500">Số lượng:</span> <strong>{brief.quantity}</strong>
              </div>
            )}
            {brief.dimensions && (
              <div>
                <span className="text-slate-500">Kích thước:</span> <span>{brief.dimensions}</span>
              </div>
            )}
            {brief.material && (
              <div>
                <span className="text-slate-500">Chất liệu:</span> <span>{brief.material}</span>
              </div>
            )}
            {brief.innerProductOrSurface && (
              <div className="col-span-2">
                <span className="text-slate-500">Bề mặt/môi trường:</span> <span>{brief.innerProductOrSurface}</span>
              </div>
            )}
            {brief.deadline && (
              <div>
                <span className="text-slate-500">Tiến độ:</span> <span>{brief.deadline}</span>
              </div>
            )}
            {brief.deliveryLocation && (
              <div>
                <span className="text-slate-500">Giao tại:</span> <span>{brief.deliveryLocation}</span>
              </div>
            )}
          </div>

          <div className="pt-2.5 mt-2 border-t border-slate-200/60 flex items-center justify-between">
            <span className="text-[10px] text-slate-500">
              {leadScore === 'HOT' ? '🔥 Yêu cầu ưu tiên cao' : '⚡ Báo giá trong 2 giờ'}
            </span>

            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="bg-[#BE1E2D] hover:bg-[#D04210] font-bold text-xs"
            >
              <Send className="w-3.5 h-3.5 mr-1" />
              <span>{isSubmitting ? 'Đang gửi...' : 'Gửi cho nhân viên'}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
