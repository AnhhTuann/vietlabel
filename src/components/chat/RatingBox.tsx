import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Check, MessageSquare } from 'lucide-react';
import { chatApi } from '../../services/chatApi';

interface RatingBoxProps {
  sessionId: string;
}

export const RatingBox: React.FC<RatingBoxProps> = ({ sessionId }) => {
  const [rating, setRating] = useState<number | 'like' | 'dislike' | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelectRating = async (selected: number | 'like' | 'dislike') => {
    setRating(selected);
    setShowCommentBox(true);
    // Submit immediately or after comment
    chatApi.submitFeedback({ sessionId, rating: selected });
  };

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating !== null) {
      await chatApi.submitFeedback({ sessionId, rating, comment });
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="py-2 px-3 text-center text-xs text-emerald-600 bg-emerald-50 rounded-xl my-2 flex items-center justify-center gap-1.5 font-medium">
        <Check className="w-3.5 h-3.5" />
        <span>Cảm ơn anh/chị đã đánh giá chất lượng tư vấn!</span>
      </div>
    );
  }

  return (
    <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl my-2 text-xs text-slate-600 space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-slate-700">Đánh giá tư vấn AI:</span>

        {/* 1-5 stars */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleSelectRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(null)}
              className="p-1 hover:scale-110 transition-transform cursor-pointer focus:outline-none"
              aria-label={`${star} sao`}
            >
              <Star
                className={`w-4 h-4 ${
                  (hoverRating !== null ? star <= hoverRating : typeof rating === 'number' && star <= rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {showCommentBox && !isSubmitted && (
        <form onSubmit={handleSendComment} className="pt-2 border-t border-slate-200/60 flex gap-2">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Góp ý thêm để Vietlabel phục vụ tốt hơn..."
            className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:border-[#BE1E2D] focus:outline-none"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-[#1E4384] hover:bg-[#164373] text-white font-medium text-xs cursor-pointer transition-colors"
          >
            Gửi
          </button>
        </form>
      )}
    </div>
  );
};
