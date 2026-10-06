import React, { useRef, useEffect, useState } from 'react';
import {
  X,
  Minus,
  Bot,
  UserCheck,
  RotateCcw,
  Send,
  Sparkles,
  PhoneCall,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { MessageBubble } from './MessageBubble';
import { QuickReplies } from './QuickReplies';
import { FileUpload, UploadedFileItem } from './FileUpload';
import { BriefCard } from './BriefCard';
import { RatingBox } from './RatingBox';
import { CONTACT_CONFIG } from '../../config/contact';
import { cn } from '../../lib/utils';

interface ChatWindowProps {
  onClose: () => void;
  isOpen: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ onClose, isOpen }) => {
  const {
    sessionId,
    messages,
    isLoading,
    isStreaming,
    streamingText,
    extractedBrief,
    leadScore,
    needHuman,
    briefReady,
    isBriefSubmitted,
    briefLeadId,
    sendMessage,
    retryLastMessage,
    resetChat,
    submitBrief,
    setNeedHuman,
    triggerHandoff,
  } = useChat();

  const [inputMessage, setInputMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<UploadedFileItem[]>([]);
  const [showHandoffPrompt, setShowHandoffPrompt] = useState(false);
  const [handoffPhone, setHandoffPhone] = useState('');
  const [isSubmittingHandoff, setIsSubmittingHandoff] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenHandoff = () => {
    if (extractedBrief.contact) {
      triggerHandoff();
    } else {
      setShowHandoffPrompt(true);
    }
  };

  const handleConfirmHandoff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handoffPhone.trim()) return;
    setIsSubmittingHandoff(true);
    try {
      await triggerHandoff(handoffPhone.trim());
      setShowHandoffPrompt(false);
      setHandoffPhone('');
    } finally {
      setIsSubmittingHandoff(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      textareaRef.current?.focus();
    }
  }, [isOpen, messages, streamingText, briefReady]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Auto-resize textarea
  const handleInputResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleSend = () => {
    if ((!inputMessage.trim() && attachedFiles.length === 0) || isLoading) return;

    sendMessage(inputMessage, attachedFiles);
    setInputMessage('');
    setAttachedFiles([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-window-title"
      className={cn(
        "fixed z-50 flex flex-col bg-white shadow-2xl transition-all duration-300 overflow-hidden",
        // Mobile: full-screen bottom-sheet
        "inset-0 md:inset-auto md:bottom-24 md:right-6 md:w-[410px] md:h-[630px] md:rounded-2xl md:border md:border-slate-200/90"
      )}
    >
      {/* 1. Header */}
      <div className="bg-[#1E4384] text-white p-3.5 sm:px-4 flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#BE1E2D] to-red-400 flex items-center justify-center text-white shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            {/* Online pulsing dot */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#1E4384] animate-pulse" />
          </div>

          <div>
            <h3 id="chat-window-title" className="font-bold text-sm leading-tight flex items-center gap-1.5">
              <span>Trợ lý AI Vietlabel</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </h3>
            <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
              Đang trực tuyến 24/7
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          {/* Escalate button */}
          <button
            type="button"
            onClick={handleOpenHandoff}
            className="flex items-center gap-1 text-[11px] font-semibold bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded-md transition-colors cursor-pointer mr-1"
            title="Chuyển sang chuyên viên thật qua Telegram / Hotline"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Gặp nhân viên</span>
          </button>

          {/* Reset chat */}
          <button
            type="button"
            onClick={resetChat}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Cuộc trò chuyện mới"
            aria-label="Cuộc trò chuyện mới"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Close / Minimize */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Đóng khung chat (Esc)"
            aria-label="Đóng khung chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. Persistent disclaimer banner */}
      <div className="bg-amber-50 border-b border-amber-200/80 px-3 py-1.5 text-[11px] text-amber-900 flex items-center justify-between shrink-0 font-medium">
        <span>⚠️ Tư vấn sơ bộ bởi AI. Báo giá chính thức do nhân viên xác nhận.</span>
      </div>

      {/* 2.1 Handoff Phone Input Prompt */}
      {showHandoffPrompt && (
        <form onSubmit={handleConfirmHandoff} className="bg-red-50 border-b border-red-200 p-3 text-xs shrink-0 animate-in fade-in">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-[#1E4384] flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#BE1E2D]" />
              Kết nối ngay với chuyên viên phụ trách:
            </span>
            <button type="button" onClick={() => setShowHandoffPrompt(false)} className="text-slate-400 hover:text-slate-600 p-1">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-slate-600 mb-2">
            Hệ thống sẽ gửi thông báo ưu tiên trực tiếp vào nhóm Sales Telegram để nhân viên gọi lại ngay.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              required
              value={handoffPhone}
              onChange={(e) => setHandoffPhone(e.target.value)}
              placeholder="Nhập Số điện thoại / Zalo của anh/chị..."
              className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:border-[#BE1E2D] focus:outline-none"
            />
            <button
              type="submit"
              disabled={isSubmittingHandoff}
              className="px-3 py-1.5 bg-[#BE1E2D] hover:bg-[#D04210] text-white rounded-lg font-bold text-xs shrink-0 cursor-pointer disabled:opacity-50"
            >
              {isSubmittingHandoff ? 'Đang gửi...' : 'Gửi yêu cầu'}
            </button>
          </div>
        </form>
      )}

      {/* 3. Escalate / Human Help Callout if needed */}
      {needHuman && (
        <div className="bg-gradient-to-r from-red-50 to-amber-50 border-b border-red-200 p-2.5 text-xs shrink-0 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#1E4384] flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-[#BE1E2D]" />
              Kỹ sư dự toán Vietlabel sẵn sàng:
            </span>
            <span className="text-[10px] text-slate-500">{CONTACT_CONFIG.workingHours}</span>
          </div>

          <div className="mt-2 flex gap-2">
            <a
              href={`tel:${CONTACT_CONFIG.hotline}`}
              className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 bg-[#1E4384] hover:bg-[#164373] text-white rounded-lg text-xs font-bold transition-colors"
            >
              <PhoneCall className="w-3 h-3 text-amber-400" />
              <span>Gọi {CONTACT_CONFIG.hotlineDisplay}</span>
            </a>

            <a
              href={CONTACT_CONFIG.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
            >
              <MessageCircle className="w-3 h-3" />
              <span>Nhắn Zalo OA</span>
            </a>
          </div>
        </div>
      )}

      {/* 4. Messages Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#F8FAFC]">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            onRetry={msg.isError ? retryLastMessage : undefined}
          />
        ))}

        {/* Real-time Streaming message bubble */}
        {isStreaming && streamingText && (
          <MessageBubble
            message={{
              id: 'streaming',
              role: 'assistant',
              content: streamingText,
              timestamp: 'Vừa xong',
            }}
          />
        )}

        {/* Typing indicator */}
        {isLoading && !streamingText && (
          <div className="flex items-center gap-2 text-xs text-slate-500 py-1 px-2 animate-in fade-in">
            <div className="w-6 h-6 rounded-full bg-[#BE1E2D] text-white flex items-center justify-center">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#BE1E2D] animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#BE1E2D] animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#BE1E2D] animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] text-slate-500 ml-1">Đang soạn câu trả lời...</span>
            </div>
          </div>
        )}

        {/* Customer Brief Card */}
        {briefReady && (
          <BriefCard
            initialBrief={extractedBrief}
            leadScore={leadScore}
            onSubmit={submitBrief}
            isSubmitted={isBriefSubmitted}
            leadId={briefLeadId}
          />
        )}

        {/* Rating Box at end of meaningful conversation */}
        {messages.length >= 4 && (
          <RatingBox sessionId={sessionId} />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 5. Quick Replies Chips */}
      {messages.length <= 3 && !isLoading && (
        <div className="border-t border-slate-200/60 bg-white">
          <QuickReplies onSelect={(reply) => sendMessage(reply)} disabled={isLoading} />
        </div>
      )}

      {/* 6. Input Area */}
      <div className="p-3 border-t border-slate-200 bg-white shrink-0">
        <FileUpload
          files={attachedFiles}
          onFilesChange={setAttachedFiles}
          disabled={isLoading}
        />

        <div className="mt-1 flex items-end gap-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputMessage}
            onChange={handleInputResize}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Nhập câu hỏi hoặc yêu cầu (ví dụ: cần 20.000 hộp thực phẩm)..."
            className="flex-1 resize-none max-h-32 text-xs sm:text-sm p-2.5 border border-slate-300 rounded-xl focus:border-[#BE1E2D] focus:ring-1 focus:ring-[#BE1E2D] focus:outline-none"
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={(!inputMessage.trim() && attachedFiles.length === 0) || isLoading}
            aria-label="Gửi tin nhắn"
            className="p-2.5 bg-[#BE1E2D] hover:bg-[#D04210] disabled:bg-slate-300 text-white rounded-xl transition-all hover:scale-105 active:scale-95 disabled:pointer-events-none cursor-pointer shrink-0 shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Privacy Note */}
        <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 px-1">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            Bảo mật thông tin dự án
          </span>
          <a
            href="/gioi-thieu#bao-mat"
            className="hover:underline hover:text-slate-600 flex items-center gap-0.5"
          >
            Chính sách bảo mật
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
