import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Leaf, Award, Recycle, Sun, TreePine, Droplets, ArrowRight } from 'lucide-react';
import { SEO } from '../lib/seo';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Button } from '../components/ui/Button';

export const SustainabilityPage: React.FC = () => {
  const { onOpenQuoteModal } = useOutletContext<{ onOpenQuoteModal: (prod?: string) => void }>();

  return (
    <div className="pt-24 pb-20">
      <SEO
        title="Phát Triển Bền Vững & Cam Kết Môi Trường | Vietlabel"
        description="Chiến lược chuyển đổi xanh trong sản xuất bao bì & tem nhãn: chứng nhận FSC CoC, mực in gốc thực vật an toàn và quy trình tuần hoàn không rác thải."
      />

      {/* Hero */}
      <section className="bg-[#0B2A4A] text-white py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 inline-block">
            ESG & PHÁT TRIỂN BỀN VỮNG
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight [text-wrap:balance]">
            Cam kết vì một nền kinh tế tuần hoàn xanh
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed [text-wrap:balance]">
            Tại Vietlabel, chúng tôi tin rằng bao bì không chỉ bảo vệ sản phẩm mà còn phải bảo vệ hành tinh xanh. Chúng tôi tiên phong ứng dụng vật liệu sinh học phân hủy tự nhiên và năng lượng sạch vào sản xuất.
          </p>
        </div>
      </section>

      {/* Green Metrics */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100">
              <TreePine className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <div className="text-3xl font-extrabold text-[#0B2A4A]">100%</div>
              <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">Giấy có nguồn gốc FSC</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Truy xuất nguồn gốc rừng trồng hợp pháp</p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100">
              <Recycle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <div className="text-3xl font-extrabold text-[#0B2A4A]">99.2%</div>
              <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">Rác thải giấy được thu hồi</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Tuần hoàn tái sinh thành bột giấy</p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100">
              <Droplets className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <div className="text-3xl font-extrabold text-[#0B2A4A]">85%</div>
              <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">Sử dụng mực in sinh học</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Mực gốc nước & dầu đậu nành an toàn</p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100">
              <Sun className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <div className="text-3xl font-extrabold text-[#0B2A4A]">500 kWp</div>
              <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">Điện mặt trời áp mái</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Giảm 650 tấn CO2 phát thải mỗi năm</p>
            </div>
          </div>
        </div>
      </section>

      {/* Alternating Left-Right Sections */}
      <section className="py-20 bg-[#FAFAFC] space-y-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {/* Row 1: Image Left / Text Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 rounded-3xl overflow-hidden aspect-[4/3] shadow-xl border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop"
                alt="FSC Forest Protection"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                CHỨNG CHỈ QUỐC TẾ FSC® COC
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2A4A] tracking-tight leading-snug">
                Bảo vệ tài nguyên rừng trồng có trách nhiệm
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Chứng chỉ FSC® Chain of Custody (SGSCH-COC-0921) là minh chứng cho việc toàn bộ sản phẩm bao bì giấy của Vietlabel đều có thể truy xuất nguồn gốc chuỗi cung ứng rõ ràng. Chúng tôi không bao giờ thu mua hoặc sử dụng nguyên liệu từ rừng nguyên sinh hoặc vùng khai thác trái phép.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 pt-2">
                <li className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-500" />
                  <span>Đáp ứng quy định chống phá rừng EUDR mới nhất của châu Âu</span>
                </li>
                <li className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-500" />
                  <span>In logo FSC chính thức trực tiếp lên bao bì xuất khẩu của khách hàng</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Row 2: Text Left / Image Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                THAY THẾ NHỰA DÙNG MỘT LẦN
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2A4A] tracking-tight leading-snug">
                Màng tráng phủ sinh học và keo dán phân hủy
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Thay vì sử dụng màng nhựa PE và BOPP khó phân hủy truyền thống, Vietlabel đã ứng dụng công nghệ tráng phủ phân tán gốc nước (Water-based dispersion barrier). Giúp bao bì có khả năng chống thấm nước, kháng dầu mỡ nhưng vẫn phân hủy hoàn toàn trong đất sau 90 đến 180 ngày.
              </p>
              <div className="pt-4">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => onOpenQuoteModal()}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Nhận tư vấn giải pháp bao bì xanh
                </Button>
              </div>
            </div>
            <div className="lg:col-span-6 order-1 lg:order-2 rounded-3xl overflow-hidden aspect-[4/3] shadow-xl border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1574634534894-89d7576c8259?q=80&w=1000&auto=format&fit=crop"
                alt="Biodegradable Kraft Packaging"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
