import React from 'react';
import { useTranslation } from 'react-i18next';
import { LABEL_SOLUTIONS } from '../../data/labelSolutions';
import { SectionTitle } from '../ui/SectionTitle';

export const LabelSolutionsMarquee: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  // Duplicate arrays for smooth seamless infinite marquee loop
  const repeated = [...LABEL_SOLUTIONS, ...LABEL_SOLUTIONS];

  return (
    <section className="py-16 bg-[#0B1B3A] overflow-hidden border-t border-[#1E4384]/30 relative">
      <div className="absolute inset-0 bg-blue-900/10 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center relative z-10">
        <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider mb-2">
          {currentLang === 'vi' ? 'Giải pháp tem nhãn toàn diện' : 'Comprehensive Labeling Solutions'}
        </h2>
        <p className="text-sm text-white/60">
          {currentLang === 'vi' ? 'Sản xuất chuyên dụng cho 12+ ngành công nghiệp trọng điểm' : 'Specialized manufacturing for 12+ key industries'}
        </p>
      </div>

      <div className="relative w-full overflow-hidden">
        {/* Gradient fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0B1B3A] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0B1B3A] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee gap-6 px-2">
          {repeated.map((solution, idx) => (
            <div
              key={`sol-${solution.id}-${idx}`}
              className="group flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#BE1E2D]/50 hover:bg-white/10 transition-all duration-300 cursor-pointer shrink-0 min-w-[280px]"
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 text-[#BE1E2D] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#BE1E2D] group-hover:text-white transition-all duration-300">
                <solution.icon className="w-6 h-6" />
              </div>
              <div className="flex flex-col flex-1 max-w-[200px]">
                <span className="text-xs sm:text-sm font-bold text-white group-hover:text-[#BE1E2D] transition-colors whitespace-nowrap truncate">
                  {currentLang === 'vi' ? solution.titleVi : solution.titleEn}
                </span>
                <span className="text-[10px] text-white/50 whitespace-nowrap truncate mt-0.5">
                  {currentLang === 'vi' ? solution.descVi : solution.descEn}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
