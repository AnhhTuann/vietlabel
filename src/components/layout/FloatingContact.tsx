import React from 'react';
import { Phone, Mail, MessageSquare } from 'lucide-react';

interface FloatingContactProps {
  onOpenQuoteModal: () => void;
}

export const FloatingContact: React.FC<FloatingContactProps> = ({ onOpenQuoteModal }) => {
  const handleScrollToContact = () => {
    const contactElem = document.getElementById('lien-he-section');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    } else {
      onOpenQuoteModal();
    }
  };

  return (
    <div
      className="hidden md:flex fixed bottom-6 right-5 z-40 flex-col items-end gap-2.5"
      role="complementary"
      aria-label="Kênh liên hệ nhanh"
    >
      {/* Button 1: Quick phone call */}
      <a
        href="tel:0868968089"
        className="group flex items-center gap-2 bg-[#1E4384] text-white p-3 rounded-full shadow-lg hover:shadow-xl hover:bg-[#164373] transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BE1E2D]"
        title="Gọi điện hotline: 086 896 8089"
        aria-label="Gọi điện hotline"
      >
        <Phone className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-semibold group-hover:max-w-xs transition-all duration-300 pr-0 group-hover:pr-2">
          086 896 8089
        </span>
      </a>

      {/* Button 2: Quick email */}
      <a
        href="mailto:thien@vietlabel.com.vn"
        className="group flex items-center gap-2 bg-slate-800 text-white p-3 rounded-full shadow-lg hover:shadow-xl hover:bg-slate-700 transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BE1E2D]"
        title="Gửi email nhận báo giá"
        aria-label="Gửi email"
      >
        <Mail className="w-5 h-5 text-sky-400 group-hover:-translate-y-0.5 transition-transform" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-semibold group-hover:max-w-xs transition-all duration-300 pr-0 group-hover:pr-2">
          thien@vietlabel.com.vn
        </span>
      </a>

      {/* Button 3: Send message / Open quote form */}
      <button
        onClick={handleScrollToContact}
        className="group flex items-center gap-2 bg-[#BE1E2D] text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-xl hover:shadow-2xl hover:bg-[#D04210] transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        title="Gửi tin nhắn hoặc yêu cầu báo giá"
        aria-label="Gửi tin nhắn hoặc yêu cầu báo giá"
      >
        <MessageSquare className="w-5 h-5 animate-pulse" />
        <span className="hidden sm:inline whitespace-nowrap text-xs font-bold tracking-wide">
          Báo giá nhanh
        </span>
      </button>
    </div>
  );
};
