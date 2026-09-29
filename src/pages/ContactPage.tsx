import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { SEO } from '../lib/seo';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Button } from '../components/ui/Button';
import { submitContact } from '../services/api';

const contactSchema = z.object({
  fullName: z.string().min(2, 'Vui lòng nhập họ và tên'),
  company: z.string().min(2, 'Vui lòng nhập tên công ty hoặc thương hiệu'),
  email: z.string().email('Địa chỉ email không hợp lệ'),
  phone: z.string().min(9, 'Số điện thoại không hợp lệ'),
  productInterest: z.string().optional(),
  quantity: z.string().optional(),
  message: z.string().min(10, 'Vui lòng mô tả yêu cầu bao bì chi tiết'),
  honeypot: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export const ContactPage: React.FC = () => {
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

  const faqs = [
    {
      q: 'Thời gian Vietlabel phản hồi bảng báo giá là bao lâu?',
      a: 'Đối với các quy cách tiêu chuẩn (kích thước, định lượng giấy, số màu in, vật liệu decal), đội ngũ dự toán kỹ thuật sẽ gửi báo giá chi tiết qua email trong vòng 2 giờ làm việc.',
    },
    {
      q: 'Vietlabel có nhận làm mẫu thử thực tế (mockup prototype) trước khi sản xuất hàng loạt không?',
      a: 'Có. Chúng tôi hỗ trợ dựng mẫu CAD 3D và cắt mẫu trắng hoặc in test màu thực tế trên bàn cắt Kongsberg để quý khách kiểm tra độ vừa vặn và phê duyệt trước khi ra bản kẽm đại trà.',
    },
    {
      q: 'Số lượng tối thiểu (MOQ) cho một đơn hàng bao bì & tem nhãn là bao nhiêu?',
      a: 'Tùy theo chủng loại: Tem nhãn cuộn decal từ 1.000 nhãn, Hộp cứng từ 500 chiếc, Hộp mềm & Túi giấy từ 1.000 chiếc, Thùng carton từ 500 thùng.',
    },
  ];

  return (
    <div className="pt-24 pb-20">
      <SEO
        title="Liên Hệ & Yêu Cầu Báo Giá | Vietlabel"
        description="Thông tin liên hệ Công ty Cổ phần Sản xuất Thương mại Vietlabel tại TP. HCM, hotline dự toán B2B 24/7, email và bản đồ chỉ đường."
      />

      {/* Header */}
      <section className="bg-[#0B2A4A] text-white py-16 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 inline-block">
            KẾT NỐI VỚI CHÚNG TÔI
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight [text-wrap:balance]">
            Tư vấn giải pháp & Báo giá nhà máy B2B
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Đội ngũ chuyên viên tư vấn bao bì và kỹ sư kết cấu của Vietlabel luôn sẵn sàng đồng hành cùng doanh nghiệp bạn.
          </p>
        </div>
      </section>

      {/* Main Form & Info Section */}
      <section className="py-16 bg-[#FAFAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Info Column (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-[#0B2A4A]">Trụ sở & Nhà máy sản xuất</h3>

                <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#E8531D] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900 font-semibold">Trụ sở & Nhà máy Vietlabel:</strong>
                      <span>266/6 Lê Thị Riêng, Phường Thới An, TP. Hồ Chí Minh, Việt Nam</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900 font-semibold">Văn phòng kinh doanh & Dự án:</strong>
                      <span>266/6 Lê Thị Riêng, Phường Thới An, TP. Hồ Chí Minh</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[#E8531D] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900 font-semibold">Hotline dự toán 24/7:</strong>
                      <a href="tel:0868968089" className="text-slate-900 font-bold hover:text-[#E8531D]">
                        (+84) 086 896 8089
                      </a>
                      <span className="text-slate-400"> - </span>
                      <a href="tel:02837658888" className="text-slate-900 font-bold hover:text-[#E8531D]">
                        (028) 3765 8888
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#E8531D] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900 font-semibold">Email tiếp nhận yêu cầu:</strong>
                      <a href="mailto:thien@vietlabel.com.vn" className="text-[#0B2A4A] font-medium hover:text-[#E8531D]">
                        thien@vietlabel.com.vn
                      </a>
                      <span className="text-slate-400"> / </span>
                      <a href="mailto:baogia@vietlabel.com.vn" className="text-[#0B2A4A] font-medium hover:text-[#E8531D]">
                        baogia@vietlabel.com.vn
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900 font-semibold">Giờ làm việc:</strong>
                      <span>Thứ Hai - Thứ Bảy: 8:00 - 17:30 (Chủ Nhật nghỉ)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQs Accordion Box */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-[#0B2A4A] flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#E8531D]" />
                  Câu hỏi thường gặp (FAQ)
                </h3>
                <div className="space-y-3 text-xs text-slate-600 divide-y divide-slate-100">
                  {faqs.map((f, i) => (
                    <div key={i} className="pt-3 first:pt-0">
                      <strong className="block text-slate-800 font-semibold mb-1">{f.q}</strong>
                      <p className="leading-relaxed">{f.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Column (7 cols) */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-10 shadow-xl">
                {submitResult?.success ? (
                  <div className="py-12 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
                      <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      Gửi thông tin thành công!
                    </h3>
                    <p className="mt-3 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                      {submitResult.message}
                    </p>
                    {submitResult.trackingId && (
                      <div className="mt-4 p-3 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 inline-block">
                        Mã phiếu yêu cầu: <strong className="text-[#E8531D]">{submitResult.trackingId}</strong>
                      </div>
                    )}
                    <div className="mt-6">
                      <Button variant="primary" onClick={() => setSubmitResult(null)}>
                        Gửi thêm yêu cầu
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-6">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#E8531D]">
                        BIỂU MẪU DỰ TOÁN
                      </span>
                      <h2 className="text-2xl font-bold text-[#0B2A4A] mt-1">
                        Gửi quy cách & yêu cầu sản xuất
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Điền đầy đủ thông tin để kỹ sư dự toán Vietlabel gửi bảng giá chính xác nhất.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Họ và tên <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            {...register('fullName')}
                            placeholder="Nguyễn Văn A"
                            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#0B2A4A] focus:outline-none focus:ring-1 focus:ring-[#0B2A4A]"
                          />
                          {errors.fullName && (
                            <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Tên doanh nghiệp / Thương hiệu <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            {...register('company')}
                            placeholder="Công ty CP Thực phẩm X"
                            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#0B2A4A] focus:outline-none focus:ring-1 focus:ring-[#0B2A4A]"
                          />
                          {errors.company && (
                            <p className="mt-1 text-xs text-red-500">{errors.company.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Email nhận bảng giá <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            {...register('email')}
                            placeholder="contact@doanhnghiep.vn"
                            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#0B2A4A] focus:outline-none focus:ring-1 focus:ring-[#0B2A4A]"
                          />
                          {errors.email && (
                            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Số điện thoại / Zalo <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            {...register('phone')}
                            placeholder="0912 345 678"
                            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#0B2A4A] focus:outline-none focus:ring-1 focus:ring-[#0B2A4A]"
                          />
                          {errors.phone && (
                            <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Dòng sản phẩm cần báo giá
                          </label>
                          <select
                            {...register('productInterest')}
                            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm bg-white focus:border-[#0B2A4A] focus:outline-none focus:ring-1 focus:ring-[#0B2A4A]"
                          >
                            <option value="Hộp giấy cao cấp">Hộp giấy cao cấp / Hộp cứng</option>
                            <option value="Túi giấy thời trang">Túi giấy thời trang & quà tặng</option>
                            <option value="Túi giấy thực phẩm">Túi giấy bánh mì HACCP</option>
                            <option value="Thùng carton sóng">Thùng carton sóng xuất khẩu</option>
                            <option value="Tem nhãn decal">Tem nhãn Decal cuộn & tờ</option>
                            <option value="Khay giấy định hình">Khay giấy định hình chống sốc</option>
                            <option value="Kệ giấy POSM">Kệ giấy trưng bày POSM</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Số lượng dự kiến
                          </label>
                          <input
                            type="text"
                            {...register('quantity')}
                            placeholder="VD: 5,000 - 10,000 cái"
                            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#0B2A4A] focus:outline-none focus:ring-1 focus:ring-[#0B2A4A]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Mô tả chi tiết quy cách, chất liệu & kích thước <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows={4}
                          {...register('message')}
                          placeholder="Ví dụ: Kích thước dài x rộng x cao, loại giấy mong muốn (Ivory, Kraft, Duplex), yêu cầu ép kim, dập nổi, cán màng mờ..."
                          className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#0B2A4A] focus:outline-none focus:ring-1 focus:ring-[#0B2A4A] resize-none"
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
                          className="w-full"
                          isLoading={isSubmitting}
                          icon={<Send className="w-4 h-4" />}
                        >
                          {isSubmitting ? 'Đang gửi thông tin...' : 'Gửi yêu cầu báo giá ngay'}
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Google Maps Iframe */}
          <div className="mt-16 rounded-3xl overflow-hidden border border-slate-200 shadow-md">
            <div className="bg-[#0B2A4A] text-white p-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#E8531D]" />
              <span>Bản đồ vị trí Trụ sở & Nhà máy Vietlabel (Lê Thị Riêng, Q. 12, TP. HCM)</span>
            </div>
            <div className="aspect-[21/7] w-full bg-slate-200">
              <iframe
                title="Bản đồ vị trí Nhà máy Vietlabel"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.043818318859!2d106.62002577586915!3d10.807954958607316!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752be357e62a39%3A0x6a05adfa8e9d3a77!2zS0NOIFTDom4gQsOsbmgsIFTDonkgVGjhuqFuaCwgVMOibiBQaMO6LCBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1711234567890!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
