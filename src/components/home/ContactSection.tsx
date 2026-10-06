import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { submitContact } from '../../services/api';

const contactSchema = z.object({
  fullName: z.string().min(2, 'Vui lòng nhập họ và tên (tối thiểu 2 ký tự)'),
  company: z.string().min(2, 'Vui lòng nhập tên công ty hoặc thương hiệu'),
  email: z.string().email('Địa chỉ email không hợp lệ'),
  phone: z.string().min(9, 'Số điện thoại không hợp lệ (tối thiểu 9 số)'),
  productInterest: z.string().optional(),
  quantity: z.string().optional(),
  message: z.string().min(10, 'Vui lòng mô tả yêu cầu bao bì (tối thiểu 10 ký tự)'),
  honeypot: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export const ContactSection: React.FC = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
    trackingId?: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      productInterest: 'Hộp giấy cao cấp',
      quantity: '1,000 - 5,000',
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const res = await submitContact(values);
      setSubmitResult(res);
      if (res.success) {
        reset();
      }
    } catch (err) {
      setSubmitResult({
        success: false,
        message: 'Có lỗi xảy ra khi kết nối máy chủ. Vui lòng gọi trực tiếp hotline: (028) 3765 8888.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="lien-he-section" className="py-24 bg-[#FAFAFC] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Column: Greeting, Factory Info & Imagery (5 cols) */}
            <div className="lg:col-span-5 bg-[#1E4384] text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    BÁO GIÁ NHANH TRONG 2 GIỜ
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 leading-snug">
                    {t('contact.title')}
                  </h2>
                  <p className="mt-3 text-sm text-slate-300 leading-relaxed [text-wrap:balance]">
                    {t('contact.subtitle')}
                  </p>
                </div>

                <div className="pt-4 space-y-4 text-xs sm:text-sm text-slate-300">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#BE1E2D] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-semibold">Trụ sở & Nhà máy Vietlabel:</strong>
                      <span>266/6 Lê Thị Riêng, Phường Thới An, TP. Hồ Chí Minh, Việt Nam</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[#BE1E2D] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-semibold">{t('contact.hotline')}:</strong>
                      <a href="tel:0868968089" className="hover:text-amber-400 text-white font-bold">
                        (+84) 086 896 8089
                      </a>
                      <span className="text-slate-400"> / </span>
                      <a href="tel:02837658888" className="hover:text-amber-400 text-white font-bold">
                        (028) 3765 8888
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#BE1E2D] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-semibold">Email nhận hồ sơ thầu & báo giá:</strong>
                      <a href="mailto:thien@vietlabel.com.vn" className="hover:text-amber-400 text-white">
                        thien@vietlabel.com.vn
                      </a>
                      <span className="text-slate-400"> / </span>
                      <a href="mailto:baogia@vietlabel.com.vn" className="hover:text-amber-400 text-white">
                        baogia@vietlabel.com.vn
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                    <div>{t('contact.working_hours')}</div>
                  </div>
                </div>
              </div>

              {/* Decorative factory thumbnail */}
              <div className="relative z-10 mt-8 pt-6 border-t border-slate-700/80">
                <div className="relative rounded-xl overflow-hidden aspect-[16/8] bg-slate-900 border border-slate-700">
                  <img
                    src="/images/vietlabel/factory-5s.webp"
                    alt="Nhà máy và quy trình 5S chuẩn quốc tế của Vietlabel"
                    className="w-full h-full object-cover object-center opacity-90"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                    <span className="text-[11px] font-medium text-slate-200 flex items-center gap-1.5">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Nhà máy vận hành quy trình chuẩn 5S & G7 Master
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact & Quotation Form (7 cols) */}
            <div className="lg:col-span-7 p-8 sm:p-12">
              {submitResult?.success ? (
                <div className="py-12 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {t('contact.success_title')}
                  </h3>
                  <p className="mt-3 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    {submitResult.message}
                  </p>
                  {submitResult.trackingId && (
                    <div className="mt-5 inline-block p-3 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono text-slate-700">
                      Mã phiếu yêu cầu: <strong className="text-[#BE1E2D]">{submitResult.trackingId}</strong>
                    </div>
                  )}
                  <div className="mt-8">
                    <Button onClick={() => setSubmitResult(null)} variant="primary">
                      Gửi thêm yêu cầu khác
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* Anti-spam honeypot */}
                  <input
                    type="text"
                    {...register('honeypot')}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {submitResult && !submitResult.success && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-700">
                      <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                      <span>{submitResult.message}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        {t('contact.full_name')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('fullName')}
                        placeholder={t('contact.full_name_placeholder')}
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#1E4384] focus:outline-none focus:ring-1 focus:ring-[#1E4384] transition-colors"
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        {t('contact.company')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('company')}
                        placeholder={t('contact.company_placeholder')}
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#1E4384] focus:outline-none focus:ring-1 focus:ring-[#1E4384] transition-colors"
                      />
                      {errors.company && (
                        <p className="mt-1 text-xs text-red-500">{errors.company.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        {t('contact.email')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        {...register('email')}
                        placeholder={t('contact.email_placeholder')}
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#1E4384] focus:outline-none focus:ring-1 focus:ring-[#1E4384] transition-colors"
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        {t('contact.phone')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        {...register('phone')}
                        placeholder={t('contact.phone_placeholder')}
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#1E4384] focus:outline-none focus:ring-1 focus:ring-[#1E4384] transition-colors"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        {t('contact.product_interest')}
                      </label>
                      <select
                        {...register('productInterest')}
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm bg-white focus:border-[#1E4384] focus:outline-none focus:ring-1 focus:ring-[#1E4384] transition-colors"
                      >
                        <option value="Hộp giấy cao cấp">Hộp giấy cao cấp / Hộp cứng</option>
                        <option value="Túi giấy thời trang">Túi giấy thời trang & Quà tặng</option>
                        <option value="Túi giấy thực phẩm">Túi giấy bánh mì & Thực phẩm</option>
                        <option value="Thùng carton sóng">Thùng carton sóng xuất khẩu</option>
                        <option value="Tem nhãn Decal">Tem nhãn Decal cuộn & tờ</option>
                        <option value="Khay giấy định hình">Khay giấy định hình</option>
                        <option value="Kệ trưng bày POSM">Kệ trưng bày POSM</option>
                        <option value="Thẻ cào & Thẻ bài">Thẻ cào & Thẻ bài thông minh</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        {t('contact.quantity')}
                      </label>
                      <input
                        type="text"
                        {...register('quantity')}
                        placeholder="VD: 5,000 - 10,000 sản phẩm"
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#1E4384] focus:outline-none focus:ring-1 focus:ring-[#1E4384] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {t('contact.message')} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      {...register('message')}
                      placeholder={t('contact.message_placeholder')}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#1E4384] focus:outline-none focus:ring-1 focus:ring-[#1E4384] transition-colors resize-none"
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>
                    )}
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full sm:w-auto"
                      isLoading={isSubmitting}
                      icon={<Send className="w-4 h-4" />}
                    >
                      {isSubmitting ? t('contact.sending') : t('contact.submit')}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
