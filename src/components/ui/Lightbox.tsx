import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

export interface LightboxItem {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
}

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  items: LightboxItem[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  onClose,
  items,
  currentIndex,
  onNavigate,
}) => {
  const currentItem = items[currentIndex];

  const handlePrev = useCallback(() => {
    onNavigate((currentIndex - 1 + items.length) % items.length);
  }, [currentIndex, items.length, onNavigate]);

  const handleNext = useCallback(() => {
    onNavigate((currentIndex + 1) % items.length);
  }, [currentIndex, items.length, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || !currentItem) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        className="absolute top-4 inset-x-4 flex items-center justify-between z-10 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-widest text-slate-400">
            {currentIndex + 1} / {items.length}
          </span>
          <h3 className="text-sm font-semibold truncate max-w-md">{currentItem.title}</h3>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Đóng (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Prev button */}
      {items.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
          aria-label="Hình trước"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Main Image content */}
      <div
        className="relative max-w-5xl max-h-[82vh] w-full flex flex-col items-center justify-center p-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative rounded-lg overflow-hidden shadow-2xl bg-neutral-900 border border-white/10 max-h-[70vh] flex items-center justify-center">
          <img
            src={currentItem.image}
            alt={currentItem.title}
            className="max-h-[70vh] w-auto object-contain select-none"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>

        {currentItem.subtitle && (
          <p className="mt-4 text-center text-sm text-slate-300 max-w-2xl px-4 line-clamp-2">
            {currentItem.subtitle}
          </p>
        )}
      </div>

      {/* Next button */}
      {items.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
          aria-label="Hình tiếp theo"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};
