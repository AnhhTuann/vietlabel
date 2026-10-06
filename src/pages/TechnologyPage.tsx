import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ZoomIn,
  ArrowRight,
} from 'lucide-react';
import { SEO } from '../lib/seo';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Button } from '../components/ui/Button';
import { MACHINES_LIST } from '../data/machines';
import { Lightbox, type LightboxItem } from '../components/ui/Lightbox';

export const TechnologyPage: React.FC = () => {
  const { onOpenQuoteModal } = useOutletContext<{ onOpenQuoteModal: (prod?: string) => void }>();
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const lightboxItems: LightboxItem[] = MACHINES_LIST.map((m) => ({
    id: m.id,
    title: m.name,
    subtitle: `${m.origin} - Công suất: ${m.capacityVi}`,
    image: m.image,
  }));

  const steps = [
    {
      step: '01',
      title: 'Thiết kế kết cấu & Dựng mẫu 3D',
      desc: 'Sử dụng phần mềm ArtiosCAD thiết kế khuôn bế. Cắt mẫu mockup thực tế bằng máy Kongsberg để kiểm tra độ vừa vặn sản phẩm.',
    },
    {
      step: '02',
      title: 'Chế bản điện tử & Ghi kẽm CTP',
      desc: 'Xuất kẽm nhiệt CTP Kodak công nghệ laser độ phân giải 2400 dpi, đảm bảo hạt trâm sắc nét và cân bằng thang xám G7.',
    },
    {
      step: '03',
      title: 'In Offset UV chuẩn màu G7',
      desc: 'In ấn trên máy Heidelberg Speedmaster XL 6 màu. Hệ thống Inpress Control tự động đo quang phổ và bù trừ màu theo thời gian thực.',
    },
    {
      step: '04',
      title: 'Xử lý hiệu ứng bề mặt cao cấp',
      desc: 'Ép kim nhũ Masterwork, cán màng nhiệt BOPP, phủ bóng cát, phủ UV định hình 3D tạo hiệu ứng thị giác và xúc giác đẳng cấp.',
    },
    {
      step: '05',
      title: 'Bế khuôn & Dán hộp tự động',
      desc: 'Máy bế tự động Bobst Novacut tốc độ 8.000 tờ/giờ. Dán hộp Bobst Expertfold đa năng tốc độ 45.000 hộp/giờ với keo nhiệt bền chặt.',
    },
    {
      step: '06',
      title: 'Kiểm soát KCS & Đóng gói Pallet',
      desc: '100% lô hàng được kiểm tra độ bục, độ kết dính, quét mã vạch kiểm tra số lượng và quấn màng co pallet đạt chuẩn vận chuyển đường biển.',
    },
  ];

  return (
    <div className="pt-24 pb-20">
      <SEO
        title="Công Nghệ & Máy Móc Sản Xuất | Vietlabel"
        description="Chi tiết hệ thống máy in Flexo cuộn, máy in Offset công nghiệp, máy bế tự động và quy trình sản xuất bao bì & tem nhãn 6 bước khép kín của Vietlabel."
      />

      {/* Hero */}
      <section className="bg-[#1E4384] text-white py-16 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 inline-block">
            HẠ TẦNG KỸ THUẬT & CÔNG NGHỆ
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight [text-wrap:balance]">
            Trang thiết bị máy móc hiện đại bậc nhất
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed [text-wrap:balance]">
            Hơn 50 thiết bị chuyên dụng nhập khẩu mới 100% từ Đức, Thụy Sĩ, Nhật Bản tạo nên dây chuyền sản xuất tự động hóa đồng bộ từ khâu chế bản đến xuất xưởng.
          </p>
        </div>
      </section>

      {/* Production Stepper */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            kicker="QUY TRÌNH SẢN XUẤT"
            title="Quy trình 6 bước khép kín đạt chuẩn G7 & ISO"
            subtitle="Mỗi công đoạn đều có quy chuẩn kỹ thuật (SOP) rõ ràng và hồ sơ giám sát chất lượng riêng biệt"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((st) => (
              <div
                key={st.step}
                className="relative p-6 rounded-2xl bg-[#FAFAFC] border border-slate-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-black font-mono text-[#BE1E2D] tracking-tight">
                    {st.step}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-[#1E4384]" />
                </div>
                <h3 className="text-base font-bold text-[#1E4384] mb-2">{st.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Machinery Fleet Table & Cards */}
      <section className="py-20 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            kicker="DANH MỤC THIẾT BỊ"
            title="Hệ thống máy móc chủ lực tại nhà máy"
            subtitle="Nhấp vào hình ảnh để xem chi tiết thông số kỹ thuật và độ phân giải cao"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {MACHINES_LIST.map((m, idx) => (
              <div
                key={m.id}
                className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all"
              >
                <div
                  className="relative aspect-[16/9] bg-slate-900 cursor-pointer group"
                  onClick={() => {
                    setActiveIdx(idx);
                    setLightboxOpen(true);
                  }}
                >
                  <img
                    src={m.image}
                    alt={m.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white group-hover:bg-[#BE1E2D] transition-colors">
                      <ZoomIn className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 bg-[#1E4384] text-white text-[10px] font-bold px-2.5 py-1 rounded">
                    {m.origin}
                  </div>
                </div>

                <div className="p-6">
                  <div className="text-xs font-bold text-[#BE1E2D] uppercase tracking-wider">
                    {currentLang === 'vi' ? m.categoryVi : m.categoryEn}
                  </div>
                  <h3 className="text-lg font-bold text-[#1E4384] mt-1">{m.name}</h3>
                  <div className="mt-2 text-xs font-mono font-semibold text-slate-500">
                    Model: {m.model} | Công suất: {m.capacityVi}
                  </div>

                  <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                    {currentLang === 'vi' ? m.purposeVi : m.purposeEn}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                    {(currentLang === 'vi' ? m.specsVi : m.specsEn).map((sp, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{sp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => onOpenQuoteModal()}
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Đặt lịch tham quan nhà máy thực tế
            </Button>
          </div>
        </div>
      </section>

      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        items={lightboxItems}
        currentIndex={activeIdx}
        onNavigate={setActiveIdx}
      />
    </div>
  );
};
