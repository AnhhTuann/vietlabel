import { ArrowRight, Award, PhoneCall, ShieldCheck } from 'lucide-react';
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

const HERO_GALLERY_IMAGES = HERO_GALLERY_COLUMNS.flat();

export const Hero: React.FC<HeroProps> = ({ onOpenQuoteModal }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const [heroBrand, ...heroHeadlineParts] = t('hero.title').split(' - ');
  const heroHeadline = heroHeadlineParts.join(' - ');
  const [slides, setSlides] = useState<any[]>(CAROUSEL_SLIDES);
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeGalleryImage, setActiveGalleryImage] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => {
      setActiveGalleryImage((active) => (active + 1) % HERO_GALLERY_IMAGES.length);
    }, 3600);
    return () => window.clearInterval(timer);
  }, []);

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
        <div className="hero-light-drift absolute inset-0 opacity-70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-x-6 xl:gap-x-10 items-center">
          {/* Left Column: Proposition and Call to Actions (7 cols) */}
          <div className="relative z-20 lg:col-span-5 lg:col-start-1 space-y-4 sm:space-y-6 text-white text-left">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2 text-[10px] font-semibold tracking-[0.16em] text-[#E9F0FF] backdrop-blur-sm sm:text-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F04452] opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#F04452]" />
              </span>
              <span className="uppercase">
                {t('hero.kicker')}
              </span>
              <span aria-hidden="true" className="h-3 w-px bg-white/20">
              </span>
              <span className="font-normal tracking-[0.12em] text-slate-300">EST. 2018</span>
            </div>

            <h1 className="w-full max-w-full [text-wrap:balance]">
              <span className="block bg-gradient-to-r from-[#7ea5db] via-white to-[#f04452] bg-clip-text text-4xl font-black leading-none tracking-[-0.055em] text-transparent sm:text-6xl lg:text-[58px] xl:text-[68px]">
                {heroBrand}
              </span>
              {heroHeadline && (
                <span className="mt-3 block border-l-[3px] border-[#BE1E2D] pl-4 text-xl font-bold leading-[1.2] tracking-tight text-white sm:mt-4 sm:pl-5 sm:text-2xl lg:text-[30px] xl:text-[34px]">
                  {heroHeadline}
                </span>
              )}
            </h1>

            {/* Sub-paragraph */}
            <p className="max-w-[48ch] text-sm leading-relaxed text-slate-300 sm:text-base lg:text-[17px]">
              {t('hero.subtitle')}
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-2.5 sm:gap-4">
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

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-l-2 border-white/15 pl-3 pt-2 text-[10px] text-slate-300 sm:gap-x-6 sm:pl-4 sm:text-[11px]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#F04452] shrink-0" />
                <span>{t('hero.cert_fsc_iso')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-sky-200 shrink-0" />
                <span>{t('hero.cert_g7')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F04452] inline-block animate-pulse"></span>
                <span>{t('hero.factory_area')}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Layered product showcase */}
          <div className="lg:col-span-7 lg:col-start-6 lg:-mr-10 xl:-mr-20">
            <div className="hero-showcase relative mx-auto h-[260px] w-full sm:h-[360px] lg:h-[460px] xl:h-[500px]">
              <div className="hero-showcase-orbit absolute left-1/2 top-1/2 hidden h-[86%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-sky-200/20 sm:block" />
              <div className="hero-showcase-glow absolute left-1/2 top-1/2 h-[70%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 blur-3xl" />

              <div className="hero-float-card hero-float-card-top absolute right-[2%] top-[7%] z-20 hidden h-[34%] aspect-square overflow-hidden rounded-2xl border border-white/60 bg-white p-1.5 shadow-2xl sm:block sm:rounded-3xl sm:p-2">
                <img
                  src={HERO_GALLERY_IMAGES[(activeGalleryImage + 1) % HERO_GALLERY_IMAGES.length]}
                  alt=""
                  className="h-full w-full rounded-xl object-cover sm:rounded-2xl"
                  loading="eager"
                  decoding="async"
                />
              </div>

              <div className="hero-float-card hero-float-card-bottom absolute bottom-[5%] left-[1%] z-20 hidden h-[31%] aspect-square overflow-hidden rounded-2xl border border-white/60 bg-white p-1.5 shadow-2xl sm:block sm:rounded-3xl sm:p-2">
                <img
                  src={HERO_GALLERY_IMAGES[(activeGalleryImage + 3) % HERO_GALLERY_IMAGES.length]}
                  alt=""
                  className="h-full w-full rounded-xl object-cover sm:rounded-2xl"
                  loading="eager"
                  decoding="async"
                />
              </div>

              <div className="absolute inset-x-[2%] bottom-[13%] top-[2%] z-10 overflow-hidden rounded-[1.6rem] border border-white/30 bg-[#0b1b3a] shadow-[0_28px_90px_rgba(0,0,0,0.45)] sm:inset-x-[13%] sm:bottom-[7%] sm:top-[7%] sm:rounded-[2rem]">
                <img
                  src={HERO_GALLERY_IMAGES[activeGalleryImage]}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 hidden h-full w-full scale-110 object-cover blur-2xl sm:block"
                  loading="eager"
                  decoding="async"
                />
                <img
                  src={HERO_GALLERY_IMAGES[activeGalleryImage]}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full scale-110 object-cover opacity-70 blur-2xl sm:hidden"
                  loading="eager"
                  decoding="async"
                />
                <img
                  key={HERO_GALLERY_IMAGES[activeGalleryImage]}
                  src={HERO_GALLERY_IMAGES[activeGalleryImage]}
                  alt=""
                  className="hero-feature-image absolute inset-0 z-[1] block h-full w-full object-contain sm:object-cover"
                  loading="eager"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071C33]/60 via-transparent to-white/10" />
                <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2 sm:inset-x-5 sm:bottom-5">
                  <div className="hidden rounded-full border border-white/25 bg-[#071C33]/65 px-3 py-1.5 text-[9px] font-semibold tracking-[0.16em] text-white backdrop-blur-md sm:block sm:px-4 sm:py-2 sm:text-[10px]">
                    VIETLABEL · PRINT & PACKAGING
                  </div>
                  <div className="rounded-full bg-white/90 px-2.5 py-1.5 text-[10px] font-bold text-[#1e4384] shadow-lg backdrop-blur sm:px-3 sm:text-xs">
                    {String(activeGalleryImage + 1).padStart(2, '0')} / {String(HERO_GALLERY_IMAGES.length).padStart(2, '0')}
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 right-1/2 z-30 flex translate-x-1/2 items-center gap-1.5 rounded-full border border-white/15 bg-[#071C33]/75 px-2.5 py-2 shadow-xl backdrop-blur-md sm:right-[8%] sm:translate-x-0 sm:gap-2 sm:px-3">
                {HERO_GALLERY_IMAGES.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    aria-label={`${currentLang.startsWith('vi') ? 'Hiển thị ảnh sản phẩm' : 'Show product image'} ${index + 1}`}
                    aria-pressed={index === activeGalleryImage}
                    onClick={() => setActiveGalleryImage(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 sm:h-2 ${
                      index === activeGalleryImage ? 'w-5 bg-white sm:w-7' : 'w-1.5 bg-white/45 hover:bg-white/75 sm:w-2'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
