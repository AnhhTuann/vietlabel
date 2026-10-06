import React from 'react';
import { Bot, Phone, MessageCircle, MessageSquare } from 'lucide-react';
import { CONTACT_CONFIG } from '../../config/contact';

interface SpeedDialProps {
  isOpen: boolean;
  onOpenAiChat: () => void;
  onClose: () => void;
}

export const SpeedDial: React.FC<SpeedDialProps> = ({ isOpen, onOpenAiChat, onClose }) => {
  if (!isOpen) return null;

  const actions = [
    {
      id: 'ai-chat',
      label: 'Trợ lý AI tư vấn 24/7',
      sublabel: 'Tư vấn thông số & dự toán',
      icon: Bot,
      bgColor: 'bg-gradient-to-r from-[#BE1E2D] to-red-500 text-white',
      badge: 'Trí tuệ nhân tạo',
      badgeColor: 'bg-amber-100 text-amber-900',
      onClick: () => {
        onClose();
        onOpenAiChat();
      },
    },
    {
      id: 'zalo',
      label: 'Nhắn Zalo Official',
      sublabel: 'Gửi file in & nhận mẫu thực tế',
      icon: MessageCircle,
      bgColor: 'bg-blue-600 text-white hover:bg-blue-700',
      badge: 'Zalo OA',
      badgeColor: 'bg-blue-100 text-blue-800',
      href: CONTACT_CONFIG.zaloUrl,
      isExternal: true,
    },
    {
      id: 'messenger',
      label: 'Chat Facebook Messenger',
      sublabel: 'Phản hồi trong 5 phút',
      icon: MessageSquare,
      bgColor: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white',
      badge: 'Fanpage',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      href: CONTACT_CONFIG.messengerUrl,
      isExternal: true,
    },
    {
      id: 'hotline',
      label: `Gọi ${CONTACT_CONFIG.hotlineDisplay}`,
      sublabel: 'Hotline kỹ sư dự toán',
      icon: Phone,
      bgColor: 'bg-[#1E4384] text-white hover:bg-[#164373]',
      badge: '24/7',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      href: `tel:${CONTACT_CONFIG.hotline}`,
    },
  ];

  return (
    <div
      className="flex flex-col items-end gap-3 mb-3 animate-in fade-in slide-in-from-bottom-5 duration-200"
      role="menu"
      aria-label="Kênh liên hệ đa kênh"
    >
      {actions.map((item, idx) => {
        const Icon = item.icon;
        const content = (
          <div className="flex items-center gap-2.5 group cursor-pointer">
            {/* Tooltip Label */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200/90 shadow-md text-slate-800 group-hover:scale-105 transition-all">
              <span className="text-xs font-bold whitespace-nowrap">{item.label}</span>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </div>

            {/* Icon Circle */}
            <div
              className={`w-11 h-11 rounded-full ${item.bgColor} shadow-lg flex items-center justify-center group-hover:scale-110 active:scale-95 transition-all border border-white/20`}
            >
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );

        if (item.href) {
          return (
            <a
              key={item.id}
              href={item.href}
              target={item.isExternal ? '_blank' : undefined}
              rel={item.isExternal ? 'noopener noreferrer' : undefined}
              onClick={onClose}
              role="menuitem"
              aria-label={item.label}
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              {content}
            </a>
          );
        }

        return (
          <button
            key={item.id}
            type="button"
            onClick={item.onClick}
            role="menuitem"
            aria-label={item.label}
            style={{ animationDelay: `${idx * 40}ms` }}
          >
            {content}
          </button>
        );
      })}
    </div>
  );
};
