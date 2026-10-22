import { ArrowRight, Award, ChevronLeft, ChevronRight, PhoneCall, ShieldCheck } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { api } from '../../services/api';

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
    link: '/san-pham/tem-nhan/in-tem-nhan-decal-cuon-nganh-dau-nhot',
  },
  {
    id: 2,
    titleVi: 'Tem nhãn Pop-up cấu trúc gấp mở độc quyền mở rộng diện tích thông tin',
    titleEn: 'Multi-Layer Pop-Up Expandable Booklet Labels for Instructions',
    categoryVi: 'Tem nhãn Pop-up',
    categoryEn: 'Pop-Up Labels',
    image: '/images/vietlabel/label-popup.webp',
    tag: 'Đột phá cấu trúc',
    link: '/san-pham/tem-nhan/in-tem-nhan-pop-up-gap-mo-thong-minh',
  },
  {
    id: 3,
    titleVi: 'Tem nhãn Dược phẩm chuẩn GMP in vi mô chống làm giả tuyệt đối',
    titleEn: 'GMP-Compliant Pharmaceutical Security Labels with Micro-Text',
    categoryVi: 'Tem nhãn Dược phẩm',
    categoryEn: 'Pharma Labels',
    image: '/images/vietlabel/label-duoc-pham.webp',
    tag: 'Chuẩn y tế & GMP',
    link: '/san-pham/tem-nhan',
  },
  {
    id: 4,
    titleVi: 'Tem nhãn Mỹ phẩm cao cấp màng xi bạc ép kim Hologram 7 màu',
    titleEn: 'Luxury Cosmetic Foil-Stamped Holographic Silver Film Labels',
    categoryVi: 'Tem nhãn Mỹ phẩm',
    categoryEn: 'Cosmetic Labels',
    image: '/images/vietlabel/label-my-pham.webp',
    tag: 'Ép kim & Cán màng cát',
    link: '/san-pham/hop-giay/hop-my-pham-ivory-can-mang-metallized',
  },
  {
    id: 5,
    titleVi: 'Tem nhãn Nông sản & Cà phê OCOP chất liệu Kraft sinh học tự nhiên',
    titleEn: 'Eco Kraft Organic Coffee & Agricultural OCOP Specialty Labels',
    categoryVi: 'Tem nhãn Thực phẩm & OCOP',
    categoryEn: 'Food & OCOP Labels',
    image: '/images/vietlabel/label-cafe-ocop.webp',
    tag: 'Tiêu chuẩn OCOP 4-5 sao',
    link: '/tin-tuc/tem-nhan-nong-san-ca-phe-ocop-kraft-sinh-hoc',
  },
  {
    id: 6,
    titleVi: 'Dây chuyền in ấn Flexo & Offset tự động hóa công suất 10 triệu nhãn/tháng',
    titleEn: 'High-Speed Automated Flexo & Offset Printing Fleet (10M/month)',
    categoryVi: 'Máy móc & Công nghệ',
    categoryEn: 'Advanced Machinery',
    image: '/images/vietlabel/factory-machine1.jpg',
    tag: 'Độ chuẩn màu G7 Master',
    link: '/cong-nghe',
  },
  {
    id: 7,
    titleVi: 'Hộp giấy mềm & Thùng carton sóng bảo vệ hàng hóa xuất khẩu',
    titleEn: 'Custom Folding Cartons & Heavy-Duty Corrugated Export Shippers',
    categoryVi: 'Bao bì hộp & Thùng giấy',
    categoryEn: 'Packaging & Cartons',
    image: '/images/vietlabel/factory-machine2.jpg',
    tag: 'ISO 9001 & FSC',
    link: '/san-pham/thung-carton/thung-carton-song-5-lop-in-offset',
  },
];

export const Hero: React.FC<HeroProps> = ({ onOpenQuoteModal }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const [slides, setSlides] = useState<any[]>(CAROUSEL_SLIDES);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    let isMounted = true;
    api.get('/cms/posts').then((res) => {
      if (isMounted && res.data && Array.isArray(res.data) && res.data.length > 0) {
        const published = res.data.filter((p: any) => p.status === 'PUBLISHED');
        if (published.length > 0) {
          const cmsSlides = published.map((p: any, idx: number) => ({
            id: p.id || `cms-${idx}`,
            titleVi: p.title,
            titleEn: p.title,
            categoryVi: p.category === 'du-an-noi-bat' ? 'Dự án & OCOP' : p.category === 'nganh-bao-bi' ? 'Tin tức ngành' : (p.category || 'Dự án nổi bật'),
            categoryEn: p.category || 'Featured Post',
            image: p.imageUrl || '/images/vietlabel/label-cafe-ocop.webp',
            tag: p.summary ? (p.summary.length > 32 ? p.summary.slice(0, 32) + '...' : p.summary) : 'Dự án tiêu biểu',
            link: `/tin-tuc/${p.slug}`,
          }));
          // Put the newest CMS articles first, followed by default slides
          setSlides([...cmsSlides, ...CAROUSEL_SLIDES]);
        }
      }
    }).catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center bg-[#071C33] overflow-hidden pt-24 pb-16">
      {/* Background with measured contrast scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/vietlabel/hero-banner.webp"
          alt="Vietlabel Manufacturing Facility & Industrial Fleet"
          className="w-full h-full object-cover object-center opacity-30 scale-105 transform motion-safe:transition-transform motion-safe:duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071C33] via-[#071C33]/90 to-[#071C33]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071C33] via-transparent to-black/30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Proposition and Call to Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-white text-left">
            {/* Clean unboxed Trust Kicker (no pills) */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wider text-[#E9F0FF]">
              <span className="uppercase tracking-[0.18em] text-[#E9F0FF]">
                {t('hero.kicker')}
              </span>
              <span aria-hidden="true" className="text-[#BE1E2D]">
                ·
              </span>
              <span className="text-slate-300 font-normal tracking-[0.12em]">EST. 2018</span>
            </div>

            {/* Dominant Headline */}
            <h1 className="text-2xl sm:text-3xl lg:text-[34px] xl:text-[40px] font-extrabold tracking-tight text-white leading-[1.22] [text-wrap:balance]">
              <span className="block text-white">{t('hero.title')}</span>
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
                  className="shadow-[0_14px_28px_rgba(30,67,132,0.28)]"
                >
                  {t('hero.cta_products')}
                </Button>
              </Link>

              <Button
                variant="secondary"
                size="lg"
                onClick={onOpenQuoteModal}
                className="shadow-[0_14px_28px_rgba(190,30,45,0.18)]"
                icon={<PhoneCall className="w-4 h-4" />}
                iconPosition="left"
              >
                {t('hero.cta_contact')}
              </Button>
            </div>

            {/* Adjacent Trust Badges & Indicators */}
            <div className="pt-6 border-t border-slate-700/60 flex flex-wrap items-center gap-6 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#BE1E2D] shrink-0" />
                <span>{t('hero.cert_fsc_iso')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#E9F0FF] shrink-0" />
                <span>{t('hero.cert_g7')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#BE1E2D] inline-block animate-pulse"></span>
                <span>{t('hero.factory_area')}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic 7-Slide Sample Product Carousel (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden bg-slate-900/80 border border-slate-700/80 shadow-2xl p-3 backdrop-blur-md">
              {/* Carousel Image viewport */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-950">
                {slides.map((slide, idx) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      idx === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  >
                    <Link
                      to={slide.link || '/san-pham'}
                      className="block w-full h-full relative group cursor-pointer"
                    >
                      <img
                        src={slide.image}
                        alt={slide.titleVi}
                        className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                        loading="eager"
                      />
                      {/* Gradient overlay for text */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent group-hover:from-black transition-colors" />

                      {/* Badge & Info Overlay */}
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wider uppercase text-amber-400 mb-1">
                          <span>{currentLang === 'vi' ? slide.categoryVi : slide.categoryEn}</span>
                          <span>·</span>
                          <span className="text-slate-300 font-normal">{slide.tag}</span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
                          {currentLang === 'vi' ? slide.titleVi : slide.titleEn}
                        </h3>
                        <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 group-hover:text-white transition-colors">
                          <span>{t('hero.view_solution')}</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#BE1E2D]" />
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Navigation Bar below image */}
              <div className="mt-3 px-2 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5 max-w-[220px] overflow-x-auto py-1 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer shrink-0 ${
                        idx === activeSlide
                          ? 'w-5 bg-[#BE1E2D]'
                          : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                      }`}
                      aria-label={`Chuyển tới mẫu sản phẩm ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono tabular-nums text-slate-400">
                    {String(activeSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
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
