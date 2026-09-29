import React from 'react';
import { Bot, User, RefreshCw, FileText, AlertCircle } from 'lucide-react';
import { ChatMessageItem } from '../../services/chatApi';
import { cn } from '../../lib/utils';

interface MessageBubbleProps {
  message: ChatMessageItem;
  onRetry?: () => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onRetry }) => {
  const isUser = message.role === 'user';

  // Helper to render simple markdown with bold, bullet points and linebreaks
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');

    return lines.map((line, lIdx) => {
      // Empty line
      if (!line.trim()) {
        return <div key={lIdx} className="h-2" />;
      }

      // Bullet points
      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
      const cleanLine = isBullet ? line.replace(/^[\s•-]+/, '').trim() : line;

      // Handle **bold**
      const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
      const renderedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-bold">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={pIdx} className="bg-black/10 px-1 py-0.5 rounded font-mono text-xs">{part.slice(1, -1)}</code>;
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={lIdx} className="flex items-start gap-1.5 ml-1 my-0.5">
            <span className="text-[#E8531D] font-bold select-none">•</span>
            <span className="flex-1">{renderedParts}</span>
          </div>
        );
      }

      return (
        <p key={lIdx} className="my-0.5 leading-relaxed">
          {renderedParts}
        </p>
      );
    });
  };

  return (
    <div
      className={cn(
        'flex gap-2.5 max-w-[88%] text-xs sm:text-sm animate-in fade-in slide-in-from-bottom-2 duration-200',
        isUser ? 'ml-auto flex-row-reverse' : 'mr-auto flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white shadow-xs select-none',
          isUser
            ? 'bg-[#0B2A4A]'
            : message.isError
            ? 'bg-rose-500'
            : 'bg-[#E8531D]'
        )}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5" />
        ) : message.isError ? (
          <AlertCircle className="w-3.5 h-3.5" />
        ) : (
          <Bot className="w-4 h-4" />
        )}
      </div>

      {/* Bubble Container */}
      <div className="flex flex-col">
        <div
          className={cn(
            'px-3.5 py-2.5 rounded-2xl shadow-xs break-words',
            isUser
              ? 'bg-[#0B2A4A] text-white rounded-tr-xs'
              : message.isError
              ? 'bg-rose-50 text-rose-900 border border-rose-200 rounded-tl-xs'
              : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
          )}
        >
          {renderFormattedText(message.content)}

          {/* Attachments if any */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 pt-2 border-t border-white/20 flex flex-wrap gap-1.5">
              {message.attachments.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/10 text-xs font-mono"
                >
                  <FileText className="w-3 h-3 text-amber-300" />
                  <span className="truncate max-w-[120px]">{file.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Timestamp and action */}
        <div
          className={cn(
            'flex items-center gap-2 mt-1 text-[10px] text-slate-400',
            isUser ? 'justify-end pr-1' : 'justify-start pl-1'
          )}
        >
          <span>{message.timestamp}</span>

          {message.isError && onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-1 text-xs text-[#E8531D] hover:underline font-semibold cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Thử lại</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
