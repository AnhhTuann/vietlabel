import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, MessageCircle, FileSpreadsheet, Package, MapPin } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MobileBottomNavProps {
  onOpenQuoteModal: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenQuoteModal }) => {
  const location = useLocation();

  const isCurrent = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-[env(safe-area-inset-bottom)]"
      aria-label="Thanh điều hướng nhanh trên di động"
    >
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {/* Item 1: Gọi điện trực tiếp */}
        <a
          href="tel:0868968089"
          className="flex flex-col items-center justify-center text-center py-1 group focus-visible:outline-none"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-active:scale-95 transition-transform">
            <Phone className="w-4 h-4 fill-emerald-600/20" />
          </div>
          <span className="text-[10px] font-semibold text-slate-700 mt-0.5">Gọi ngay</span>
        </a>

        {/* Item 2: Chat Zalo */}
        <a
          href="https://zalo.me/0868968089"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center text-center py-1 group focus-visible:outline-none"
        >
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-active:scale-95 transition-transform">
            <MessageCircle className="w-4 h-4 fill-blue-600/20" />
          </div>
          <span className="text-[10px] font-semibold text-slate-700 mt-0.5">Zalo</span>
        </a>

        {/* Item 3: Báo giá nhanh (Nút trung tâm nổi bật) */}
        <button
          onClick={onOpenQuoteModal}
          className="flex flex-col items-center justify-center -mt-4 group focus-visible:outline-none"
          aria-label="Yêu cầu báo giá nhanh"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#BE1E2D] to-red-500 text-white shadow-lg shadow-red-500/30 flex items-center justify-center group-active:scale-90 transition-transform border-2 border-white">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-[#BE1E2D] mt-0.5">Báo giá</span>
        </button>

        {/* Item 4: Danh mục sản phẩm */}
        <Link
          to="/san-pham"
          className={cn(
            "flex flex-col items-center justify-center text-center py-1 group focus-visible:outline-none transition-colors",
            isCurrent('/san-pham') ? "text-[#1E4384]" : "text-slate-600"
          )}
        >
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center group-active:scale-95 transition-transform",
            isCurrent('/san-pham') ? "bg-slate-100 text-[#1E4384]" : "bg-slate-50 text-slate-500"
          )}>
            <Package className="w-4 h-4" />
          </div>
          <span className={cn(
            "text-[10px] mt-0.5",
            isCurrent('/san-pham') ? "font-bold text-[#1E4384]" : "font-semibold text-slate-700"
          )}>
            Sản phẩm
          </span>
        </Link>

        {/* Item 5: Liên hệ & Nhà máy */}
        <Link
          to="/lien-he"
          className={cn(
            "flex flex-col items-center justify-center text-center py-1 group focus-visible:outline-none transition-colors",
            isCurrent('/lien-he') ? "text-[#1E4384]" : "text-slate-600"
          )}
        >
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center group-active:scale-95 transition-transform",
            isCurrent('/lien-he') ? "bg-slate-100 text-[#1E4384]" : "bg-slate-50 text-slate-500"
          )}>
            <MapPin className="w-4 h-4" />
          </div>
          <span className={cn(
            "text-[10px] mt-0.5",
            isCurrent('/lien-he') ? "font-bold text-[#1E4384]" : "font-semibold text-slate-700"
          )}>
            Liên hệ
          </span>
        </Link>
      </div>
    </nav>
  );
};
