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

const HERO_GALLERY_COLUMNS = [
  [
    '/images/vietlabel/hero-gallery/chai-dau-hat-lanh.webp',
    '/images/vietlabel/hero-gallery/hop-kimchi-bibigo.webp',
    '/images/vietlabel/hero-gallery/sua-chua-dalat-milk.webp',
  ],
  [
    '/images/vietlabel/hero-gallery/green-super-canxi.webp',
    '/images/vietlabel/hero-gallery/decal-pvoil.webp',
    '/images/vietlabel/hero-gallery/nuoc-mau-bep-xua.webp',
  ],
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
    <section className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center bg-[#071C33] overflow-hidden pt-20 pb-10 sm:pt-24 sm:pb-16">
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-12 items-center">
          {/* Left Column: Proposition and Call to Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-white text-left">
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
            <h1 className="text-xl sm:text-3xl lg:text-[34px] xl:text-[40px] font-extrabold tracking-tight text-white leading-[1.22] [text-wrap:balance]">
              <span className="block text-white">{t('hero.title')}</span>
            </h1>

            {/* Sub-paragraph */}
            <p className="text-sm sm:text-lg text-slate-300 max-w-2xl leading-relaxed [text-wrap:balance]">
              {t('hero.subtitle')}
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
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

          </div>

          {/* Right Column: Infinite 2-column vertical scroll gallery */}
          <div className="lg:col-span-5">
            {/* Outer rounded card */}
            <div className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-2xl backdrop-blur-md p-2 sm:p-3 h-[220px] sm:h-[320px] lg:h-[420px] xl:h-[480px]">
              {/* Fade top & bottom masks */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-12 z-10 bg-gradient-to-b from-[#0d1832] to-transparent rounded-t-xl" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 z-10 bg-gradient-to-t from-[#0d1832] to-transparent rounded-b-xl" />

              {/* Two-column gallery */}
              <div className="hero-gallery flex gap-2.5 h-full overflow-hidden rounded-xl">
                {HERO_GALLERY_COLUMNS.map((column, columnIndex) => (
                  <div key={columnIndex} className="flex-1 overflow-hidden">
                    <div className={`${columnIndex === 0 ? 'animate-scroll-up' : 'animate-scroll-up-2'} flex flex-col`}>
                      {[0, 1].map((setIndex) => (
                        <div key={setIndex} className="flex flex-col gap-2.5 pb-2.5">
                          {column.map((src) => (
                            <div key={src} className="w-full aspect-square rounded-lg overflow-hidden shrink-0 bg-slate-800">
                              <img src={src} alt="" className="w-full h-full object-cover" loading="eager" decoding="async" />
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trust badges follow the gallery on mobile and sit under the copy on desktop */}
          <div className="lg:col-span-7 pt-4 sm:pt-6 border-t border-slate-700/60 flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] sm:text-xs text-slate-300">
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
      </div>
    </section>
  );
};
