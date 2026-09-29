import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Bot } from 'lucide-react';
import { SpeedDial } from './SpeedDial';

const WELCOME_PROMPT_KEY = 'vietlabel_welcome_bubble_shown_v1';

interface ChatLauncherProps {
  onOpenAiChat: () => void;
  isChatOpen: boolean;
}

export const ChatLauncher: React.FC<ChatLauncherProps> = ({ onOpenAiChat, isChatOpen }) => {
  const [isDialOpen, setIsDialOpen] = useState(false);
  const [showGreetingBubble, setShowGreetingBubble] = useState(false);

  // Trigger greeting bubble after 8 seconds (only once per session)
  useEffect(() => {
    const hasShown = sessionStorage.getItem(WELCOME_PROMPT_KEY);
    if (!hasShown && !isChatOpen) {
      const timer = setTimeout(() => {
        setShowGreetingBubble(true);
        sessionStorage.setItem(WELCOME_PROMPT_KEY, 'true');
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [isChatOpen]);

  // Hide greeting bubble when chat or dial is opened
  useEffect(() => {
    if (isChatOpen || isDialOpen) {
      setShowGreetingBubble(false);
    }
  }, [isChatOpen, isDialOpen]);

  const toggleDial = () => {
    setIsDialOpen(prev => !prev);
    setShowGreetingBubble(false);
  };

  if (isChatOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-5 z-50 flex flex-col items-end pointer-events-auto">
      {/* 8-second Welcome speech bubble */}
      {showGreetingBubble && (
        <div className="mb-3 max-w-[280px] bg-white border border-slate-200 shadow-xl rounded-2xl p-3.5 text-xs text-slate-800 relative animate-in fade-in slide-in-from-bottom-3 duration-300">
          <button
            type="button"
            onClick={() => setShowGreetingBubble(false)}
            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 p-0.5"
            aria-label="Đóng thông báo"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E8531D] text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-[#0B2A4A] block">Trợ lý AI Vietlabel</span>
              <p className="mt-0.5 text-slate-600 leading-snug">
                Anh/chị đang cần in/làm bao bì gì ạ? Em tư vấn nhanh 24/7!
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowGreetingBubble(false);
                  onOpenAiChat();
                }}
                className="mt-2 text-[11px] font-bold text-[#E8531D] hover:underline cursor-pointer"
              >
                Bắt đầu trò chuyện →
              </button>
            </div>
          </div>

          {/* Speech bubble arrow pointer */}
          <div className="absolute -bottom-2 right-7 w-4 h-4 bg-white border-b border-r border-slate-200 transform rotate-45" />
        </div>
      )}

      {/* Speed Dial Actions */}
      <SpeedDial
        isOpen={isDialOpen}
        onOpenAiChat={onOpenAiChat}
        onClose={() => setIsDialOpen(false)}
      />

      {/* Primary 56px Floating Button */}
      <button
        type="button"
        onClick={toggleDial}
        aria-label={isDialOpen ? 'Đóng menu liên hệ' : 'Mở kênh tư vấn đa kênh'}
        aria-expanded={isDialOpen}
        className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#E8531D] to-orange-500 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center border-2 border-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300 cursor-pointer group"
      >
        {/* Soft pulse glow behind */}
        <span className="absolute inset-0 rounded-full bg-[#E8531D] opacity-40 animate-ping -z-10 [animation-duration:3s]" />

        {isDialOpen ? (
          <X className="w-6 h-6 transition-transform duration-300 rotate-90" />
        ) : (
          <MessageSquare className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" />
        )}

        {/* Badge "1" unread greeting */}
        {!isDialOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white text-[10px] font-black flex items-center justify-center text-white shadow-sm">
            1
          </span>
        )}
      </button>
    </div>
  );
};
