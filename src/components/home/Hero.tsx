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
  const { t } = useTranslation();
  const [heroBrand, ...heroHeadlineParts] = t('hero.title').split(' - ');
  const heroHeadline = heroHeadlineParts.join(' - ');
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
    <section data-scroll-reveal="off" className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center bg-[#071C33] overflow-hidden pt-20 pb-10 sm:pt-24 sm:pb-16">
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
            <div className="hero-copy-item inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2 text-[10px] font-semibold tracking-[0.16em] text-[#E9F0FF] backdrop-blur-sm sm:text-xs">
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
              <span className="hero-copy-item block bg-gradient-to-r from-[#7ea5db] via-white to-[#f04452] bg-clip-text text-4xl font-black leading-none tracking-[-0.055em] text-transparent sm:text-6xl lg:text-[58px] xl:text-[68px]" style={{ animationDelay: '120ms' }}>
                {heroBrand}
              </span>
              {heroHeadline && (
                <span className="mt-3 block border-l-[3px] border-[#BE1E2D] pl-4 text-xl font-bold leading-[1.2] tracking-tight text-white sm:mt-4 sm:pl-5 sm:text-2xl lg:text-[30px] xl:text-[34px]">
                  <span className="sr-only">{heroHeadline}</span>
                  <span aria-hidden="true">
                    {heroHeadline.split(' ').map((word, index) => (
                      <React.Fragment key={`${word}-${index}`}>
                        {index > 0 && ' '}
                        <span
                          className="hero-headline-word"
                          style={{ animationDelay: `${280 + index * 55}ms` }}
                        >
                          {word}
                        </span>
                      </React.Fragment>
                    ))}
                  </span>
                </span>
              )}
            </h1>

            {/* Sub-paragraph */}
            <p className="hero-copy-item max-w-[48ch] text-sm leading-relaxed text-slate-300 sm:text-base lg:text-[17px]" style={{ animationDelay: '620ms' }}>
              {t('hero.subtitle')}
            </p>

            {/* Primary Action Buttons */}
            <div className="hero-copy-item pt-1 sm:pt-2 flex flex-wrap items-center gap-2.5 sm:gap-4" style={{ animationDelay: '760ms' }}>
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

            <div className="hero-copy-item flex flex-wrap items-center gap-x-5 gap-y-2 border-l-2 border-white/15 pl-3 pt-2 text-[10px] text-slate-300 sm:gap-x-6 sm:pl-4 sm:text-[11px]" style={{ animationDelay: '900ms' }}>
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

          {/* Right Column: Vertical product gallery */}
          <div className="lg:col-span-7 lg:col-start-6 lg:-mr-10 xl:-mr-20">
            <div className="hero-gallery relative mx-auto grid h-[300px] w-full max-w-[28rem] grid-cols-1 grid-rows-2 gap-3 overflow-hidden sm:h-[360px] sm:grid-cols-2 sm:grid-rows-1 sm:gap-4 lg:h-[min(78vh,760px)] lg:gap-5">
              {HERO_GALLERY_COLUMNS.map((column, columnIndex) => (
                <div
                  key={columnIndex}
                  className="overflow-hidden rounded-[1.25rem] border border-white/20 bg-[#0b1b3a]/80 p-2 shadow-[0_28px_90px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:rounded-[1.75rem] sm:p-2.5"
                >
                  <div className={`hero-gallery-track ${columnIndex === 0 ? 'hero-gallery-track-up' : 'hero-gallery-track-down'}`}>
                    {[0, 1].map((copy) => (
                      <div key={copy} className="flex w-max flex-row gap-3 pr-3 sm:w-full sm:flex-col sm:gap-6 sm:pb-6 sm:pr-0 lg:gap-7 lg:pb-7">
                        {column.map((image) => (
                          <img
                            key={`${copy}-${image}`}
                            src={image}
                            alt=""
                            aria-hidden="true"
                            className="aspect-square w-[118px] shrink-0 rounded-[0.9rem] border border-white/15 object-cover shadow-lg sm:w-full sm:shrink sm:rounded-[1.25rem]"
                            loading="eager"
                            decoding="async"
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-gradient-to-b from-[#071C33]/80 to-transparent sm:h-16" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t from-[#071C33]/80 to-transparent sm:h-16" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
