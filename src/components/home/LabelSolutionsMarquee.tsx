import React from 'react';
import { useTranslation } from 'react-i18next';

const LABEL_PARTNER_LOGOS = [
  { name: 'Siegwerk', image: '/images/vietlabel/label-solutions/siegwerk.png' },
  { name: 'Kodak', image: '/images/vietlabel/label-solutions/kodak.png' },
  { name: 'Toyo Ink', image: '/images/vietlabel/label-solutions/toyo-ink.png' },
  { name: 'VHM', image: '/images/vietlabel/label-solutions/vhm.png' },
  { name: 'UPM', image: '/images/vietlabel/label-solutions/upm.png' },
  { name: 'Avery Dennison', image: '/images/vietlabel/label-solutions/avery-dennison.png' },
];

export const LabelSolutionsMarquee: React.FC = () => {
  const { i18n } = useTranslation();
  const isVietnamese = i18n.language.startsWith('vi');

  return (
    <section
      aria-label={isVietnamese ? 'Giải pháp tem nhãn toàn diện' : 'Comprehensive Labeling Solutions'}
      className="relative overflow-hidden border-y border-white/10 bg-[#0B1B3A] py-8 sm:py-12"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-40 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#be1e2d]/70 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(30,67,132,0.32),transparent_65%)]" />

      <div className="relative z-10 mx-auto mb-7 max-w-3xl px-4 text-center sm:mb-9">
        <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          {isVietnamese ? 'GIẢI PHÁP TEM NHÃN TOÀN DIỆN' : 'COMPREHENSIVE LABELING SOLUTIONS'}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-white/65 sm:text-base">
          {isVietnamese
            ? 'Sản xuất chuyên dụng cho 12+ ngành công nghiệp trọng điểm'
            : 'Specialized manufacturing for 12+ key industries'}
        </p>
      </div>

      <div className="relative w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#0B1B3A] to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#0B1B3A] to-transparent sm:w-24" />

        <div className="animate-marquee">
          {[0, 1, 2, 3].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy > 0}
              className="flex w-max shrink-0 gap-3.5 pr-3.5 sm:gap-5 sm:pr-5"
            >
              {LABEL_PARTNER_LOGOS.map((logo) => (
                <div
                  key={logo.name}
                  className="group flex h-[88px] w-[190px] shrink-0 items-center justify-center rounded-2xl border border-white bg-white px-5 py-3 shadow-[0_8px_28px_rgba(30,67,132,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#1e4384]/15 hover:shadow-[0_14px_34px_rgba(30,67,132,0.13)] sm:h-[108px] sm:w-[240px] sm:rounded-[1.35rem] sm:px-7 sm:py-4"
                >
                  <img
                    src={logo.image}
                    alt={copy === 0 ? logo.name : ''}
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
