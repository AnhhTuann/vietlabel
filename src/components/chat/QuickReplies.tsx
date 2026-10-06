import React from 'react';
import { Tag, Sparkles, UserCheck, Calculator } from 'lucide-react';

interface QuickRepliesProps {
  onSelect: (reply: string) => void;
  disabled?: boolean;
}

const QUICK_OPTIONS = [
  { label: 'Tem nhãn cuộn decal', icon: Tag, query: 'Em muốn tư vấn in tem nhãn decal cuộn dán bao bì sản phẩm' },
  { label: 'Tư vấn hộp giấy', icon: Sparkles, query: 'Em muốn tư vấn in hộp giấy cao cấp (hộp cứng / hộp mềm)' },
  { label: 'Tư vấn túi giấy', icon: Tag, query: 'Em muốn tư vấn in túi giấy Kraft thân thiện môi trường' },
  { label: 'Thùng carton', icon: Tag, query: 'Em muốn tư vấn sản xuất thùng carton sóng chống thấm' },
  { label: 'Xin báo giá nhanh', icon: Calculator, query: 'Anh/chị hỗ trợ báo giá và gửi mẫu thử bao bì giúp em nhé' },
  { label: 'Nói chuyện với nhân viên', icon: UserCheck, query: 'Em muốn kết nối trực tiếp với chuyên viên tư vấn Vietlabel' },
];

export const QuickReplies: React.FC<QuickRepliesProps> = ({ onSelect, disabled }) => {
  return (
    <div className="flex flex-wrap gap-1.5 py-2 px-3">
      {QUICK_OPTIONS.map((item, idx) => {
        const Icon = item.icon;
        return (
          <button
            key={idx}
            disabled={disabled}
            onClick={() => onSelect(item.query)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium bg-slate-100 hover:bg-red-50 hover:text-[#BE1E2D] text-slate-700 border border-slate-200/80 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            <Icon className="w-3 h-3 text-[#BE1E2D]" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
