import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, CheckCircle2, Send, PhoneCall } from 'lucide-react';
import { Button } from './Button';
import { submitContact } from '../../services/api';

const quoteSchema = z.object({
  fullName: z.string().min(2, 'Vui lòng nhập họ và tên (tối thiểu 2 ký tự)'),
  company: z.string().min(2, 'Vui lòng nhập tên công ty hoặc thương hiệu'),
  email: z.string().email('Địa chỉ email không hợp lệ'),
  phone: z.string().min(9, 'Số điện thoại không hợp lệ (tối thiểu 9 số)'),
  productInterest: z.string().optional(),
  quantity: z.string().optional(),
  message: z.string().min(10, 'Vui lòng mô tả quy cách hoặc yêu cầu (tối thiểu 10 ký tự)'),
  honeypot: z.string().optional(),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProduct?: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  defaultProduct = '',
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [trackingId, setTrackingId] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      productInterest: defaultProduct,
      quantity: '1,000',
    },
  });

  const onSubmit = async (values: QuoteFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await submitContact(values);
      if (res.success) {
        setIsSuccess(true);
        setTrackingId(res.trackingId || '');
        reset();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Tiếp nhận yêu cầu thành công!</h3>
            <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
              Chuyên viên dự toán kỹ thuật Vietlabel sẽ thẩm định quy cách và gửi bảng báo giá chi tiết qua email trong vòng 2 giờ làm việc.
            </p>
            {trackingId && (
              <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700">
                Mã theo dõi: <span className="font-bold text-[#E8531D]">{trackingId}</span>
              </div>
            )}
            <div className="mt-6 flex justify-center gap-3">
              <Button onClick={handleClose} variant="primary">
                Hoàn tất
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#E8531D]">
                BÁO GIÁ NHÀ MÁY B2B
              </span>
              <h3 className="text-xl font-bold text-[#0B2A4A] mt-1">Yêu cầu báo giá & Tư vấn mẫu</h3>
              <p className="text-xs text-slate-500 mt-1">
                Nhận dự toán chi phí sản xuất và tư vấn cấu trúc bao bì tối ưu chi phí hoàn toàn miễn phí.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Anti-spam honeypot */}
              <input
                type="text"
                {...register('honeypot')}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('fullName')}
                    placeholder="Nguyễn Văn A"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#0B2A4A] focus:outline-none focus:ring-1 focus:ring-[#0B2A4A]"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Tên công ty / Thương hiệu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('company')}
                    placeholder="Công ty TNHH Thực phẩm"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#0B2A4A] focus:outline-none focus:ring-1 focus:ring-[#0B2A4A]"
                  />
                  {errors.company && (
                    <p className="mt-1 text-xs text-red-500">{errors.company.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Email nhận báo giá <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="contact@doanhnghiep.vn"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#0B2A4A] focus:outline-none focus:ring-1 focus:ring-[#0B2A4A]"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Số điện thoại / Zalo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    placeholder="0912 345 678"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#0B2A4A] focus:outline-none focus:ring-1 focus:ring-[#0B2A4A]"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Loại sản phẩm quan tâm
                  </label>
                  <select
                    {...register('productInterest')}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:border-[#0B2A4A] focus:outline-none focus:ring-1 focus:ring-[#0B2A4A]"
                  >
                    <option value="Hộp giấy cao cấp">Hộp giấy cao cấp / Hộp cứng</option>
                    <option value="Túi giấy thời trang">Túi giấy thời trang / Túi Kraft</option>
                    <option value="Túi giấy thực phẩm">Túi giấy bánh mì & thực phẩm</option>
                    <option value="Thùng carton sóng">Thùng carton sóng 3-5-7 lớp</option>
                    <option value="Tem nhãn decal">Tem nhãn Decal cuộn / tờ</option>
                    <option value="Khay giấy định hình">Khay giấy định hình</option>
                    <option value="Kệ trưng bày POSM">Kệ trưng bày POSM</option>
                    <option value="Thẻ cào trúng thưởng">Thẻ cào & Thẻ bài</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Số lượng dự kiến
                  </label>
                  <input
                    type="text"
                    {...register('quantity')}
                    placeholder="VD: 1,000 - 5,000 chiếc"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#0B2A4A] focus:outline-none focus:ring-1 focus:ring-[#0B2A4A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Mô tả quy cách, kích thước & yêu cầu kỹ thuật <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  {...register('message')}
                  placeholder="Ví dụ: Kích thước 22x16x8cm, carton lạnh bồi giấy Couche 150gsm, in 4 màu cán mờ, ép kim logo..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#0B2A4A] focus:outline-none focus:ring-1 focus:ring-[#0B2A4A]"
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>
                )}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <PhoneCall className="w-4 h-4 text-[#E8531D]" />
                  <span>Hotline hỗ trợ: <strong>(028) 3765 8888</strong></span>
                </div>

                <div className="flex gap-2 w-full sm:w-auto justify-end">
                  <Button type="button" variant="ghost" size="sm" onClick={handleClose}>
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={isSubmitting}
                    icon={<Send className="w-4 h-4" />}
                  >
                    Gửi yêu cầu
                  </Button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
