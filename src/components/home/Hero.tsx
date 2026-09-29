import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, PhoneCall, ChevronLeft, ChevronRight, ShieldCheck, Award } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeroProps {
  onOpenQuoteModal: () => void;
}

const CAROUSEL_SLIDES = [
  {
    id: 1,
    titleVi: 'Tem nhãn cuộn decal công nghiệp chuyên dụng cho ngành Dầu nhớt',
    titleEn: 'Industrial Grade Self-Adhesive Roll Labels for Lubricants & Oils',
    categoryVi: 'Tem nhãn dầu nhớt',
    categoryEn: 'Lubricant Labels',
    image: '/images/vietlabel/label-dau-nhot.webp',
    tag: 'Chống dầu mỡ & Hóa chất',
  },
  {
    id: 2,
    titleVi: 'Tem nhãn Pop-up cấu trúc gấp mở độc quyền mở rộng diện tích thông tin',
    titleEn: 'Multi-Layer Pop-Up Expandable Booklet Labels for Instructions',
    categoryVi: 'Tem nhãn Pop-up',
    categoryEn: 'Pop-Up Labels',
    image: '/images/vietlabel/label-popup.webp',
    tag: 'Đột phá cấu trúc',
  },
  {
    id: 3,
    titleVi: 'Tem nhãn Dược phẩm chuẩn GMP in vi mô chống làm giả tuyệt đối',
    titleEn: 'GMP-Compliant Pharmaceutical Security Labels with Micro-Text',
    categoryVi: 'Tem nhãn Dược phẩm',
    categoryEn: 'Pharma Labels',
    image: '/images/vietlabel/label-duoc-pham.webp',
    tag: 'Chuẩn y tế & GMP',
  },
  {
    id: 4,
    titleVi: 'Tem nhãn Mỹ phẩm cao cấp màng xi bạc ép kim Hologram 7 màu',
    titleEn: 'Luxury Cosmetic Foil-Stamped Holographic Silver Film Labels',
    categoryVi: 'Tem nhãn Mỹ phẩm',
    categoryEn: 'Cosmetic Labels',
    image: '/images/vietlabel/label-my-pham.webp',
    tag: 'Ép kim & Cán màng cát',
  },
  {
    id: 5,
    titleVi: 'Tem nhãn Nông sản & Cà phê OCOP chất liệu Kraft sinh học tự nhiên',
    titleEn: 'Eco Kraft Organic Coffee & Agricultural OCOP Specialty Labels',
    categoryVi: 'Tem nhãn Thực phẩm & OCOP',
    categoryEn: 'Food & OCOP Labels',
    image: '/images/vietlabel/label-cafe-ocop.webp',
    tag: 'Tiêu chuẩn OCOP 4-5 sao',
  },
  {
    id: 6,
    titleVi: 'Dây chuyền in ấn Flexo & Offset tự động hóa công suất 10 triệu nhãn/tháng',
    titleEn: 'High-Speed Automated Flexo & Offset Printing Fleet (10M/month)',
    categoryVi: 'Máy móc & Công nghệ',
    categoryEn: 'Advanced Machinery',
    image: '/images/vietlabel/factory-machine1.jpg',
    tag: 'Độ chuẩn màu G7 Master',
  },
  {
    id: 7,
    titleVi: 'Hộp giấy mềm & Thùng carton sóng bảo vệ hàng hóa xuất khẩu',
    titleEn: 'Custom Folding Cartons & Heavy-Duty Corrugated Export Shippers',
    categoryVi: 'Bao bì hộp & Thùng giấy',
    categoryEn: 'Packaging & Cartons',
    image: '/images/vietlabel/factory-machine2.jpg',
    tag: 'ISO 9001 & FSC',
  },
];

export const Hero: React.FC<HeroProps> = ({ onOpenQuoteModal }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
  };

  return (
    <section className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center bg-[#071C33] overflow-hidden pt-24 pb-16">
      {/* Background with measured contrast scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/vietlabel/hero-banner.webp"
          alt="Vietlabel Manufacturing Facility & Industrial Fleet"
          className="w-full h-full object-cover object-center opacity-30 scale-105 transform motion-safe:transition-transform motion-safe:duration-1000"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=2000&auto=format&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071C33] via-[#071C33]/90 to-[#071C33]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071C33] via-transparent to-black/30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Proposition and Call to Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-white text-left">
            {/* Clean unboxed Trust Kicker (no pills) */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wider text-amber-400">
              <span className="uppercase tracking-widest">NHÀ MÁY SẢN XUẤT BAO BÌ B2B TIÊU CHUẨN QUỐC TẾ</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-300 font-normal">EST. 2004</span>
            </div>

            {/* Dominant Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.15] [text-wrap:balance]">
              {t('hero.title')}
            </h1>

            {/* Sub-paragraph */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed [text-wrap:balance]">
              {t('hero.subtitle')}
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link to="/san-pham">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight className="w-5 h-5" />}
                  className="shadow-lg shadow-orange-950/40"
                >
                  {t('hero.cta_products')}
                </Button>
              </Link>

              <Button
                variant="outline"
                size="lg"
                onClick={onOpenQuoteModal}
                className="border-white/30 text-white hover:bg-white/10 hover:border-white"
                icon={<PhoneCall className="w-4 h-4 text-amber-400" />}
                iconPosition="left"
              >
                {t('hero.cta_contact')}
              </Button>
            </div>

            {/* Adjacent Trust Badges & Indicators */}
            <div className="pt-6 border-t border-slate-700/60 flex flex-wrap items-center gap-6 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Chứng nhận FSC® & ISO 9001:2015</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Tiêu chuẩn in ấn chuẩn màu G7 Master</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                <span>Nhà máy 15.000m² tại TP. HCM</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic 7-Slide Sample Product Carousel (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden bg-slate-900/80 border border-slate-700/80 shadow-2xl p-3 backdrop-blur-md">
              {/* Carousel Image viewport */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-950">
                {CAROUSEL_SLIDES.map((slide, idx) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      idx === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  >
                    <img
                      src={slide.image}
                      alt={slide.titleVi}
                      className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      loading="eager"
                    />
                    {/* Gradient overlay for text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                    {/* Badge & Info Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wider uppercase text-amber-400 mb-1">
                        <span>{currentLang === 'vi' ? slide.categoryVi : slide.categoryEn}</span>
                        <span>·</span>
                        <span className="text-slate-300 font-normal">{slide.tag}</span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-white line-clamp-2 leading-snug">
                        {currentLang === 'vi' ? slide.titleVi : slide.titleEn}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Bar below image */}
              <div className="mt-3 px-2 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  {CAROUSEL_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        idx === activeSlide ? 'w-6 bg-[#E8531D]' : 'w-2 bg-slate-700 hover:bg-slate-500'
                      }`}
                      aria-label={`Chuyển tới mẫu sản phẩm ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono tabular-nums text-slate-400">
                    0{activeSlide + 1} / 0{CAROUSEL_SLIDES.length}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={handlePrev}
                      className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer"
                      aria-label="Hình trước"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer"
                      aria-label="Hình sau"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
