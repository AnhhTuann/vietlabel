import React from 'react';
import { useTranslation } from 'react-i18next';
import { CLIENT_ROW_1, CLIENT_ROW_2 } from '../../data/clients';
import { SectionTitle } from '../ui/SectionTitle';

export const ClientMarquee: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  // Duplicate arrays for smooth seamless infinite marquee loop
  const row1Repeated = [...CLIENT_ROW_1, ...CLIENT_ROW_1];
  const row2Repeated = [...CLIENT_ROW_2, ...CLIENT_ROW_2];

  return (
    <section className="py-20 bg-white overflow-hidden border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <SectionTitle
          title={t('clients.title')}
          subtitle={t('clients.subtitle')}
        />
      </div>

      <div className="space-y-4">
        {/* Row 1: Forward Marquee */}
        <div className="relative w-full overflow-hidden">
          {/* Gradient fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee gap-4 px-2">
            {row1Repeated.map((client, idx) => (
              <div
                key={`r1-${client.id}-${idx}`}
                className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-[#E8531D]/40 hover:bg-orange-50/30 transition-all duration-200 cursor-pointer shrink-0"
              >
                {client.image ? (
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-white border border-slate-200/80 shrink-0 flex items-center justify-center p-0.5 shadow-xs">
                    <img src={client.image} alt={client.name} className="w-full h-full object-cover rounded" />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center group-hover:bg-[#0B2A4A] group-hover:text-white transition-colors shrink-0">
                    {client.name.charAt(0)}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-slate-700 group-hover:text-[#0B2A4A] transition-colors whitespace-nowrap">
                    {client.name}
                  </span>
                  <span className="text-[10px] text-slate-600 group-hover:text-[#E8531D] transition-colors whitespace-nowrap">
                    {currentLang === 'vi' ? client.industryVi : client.industryEn}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Reverse Marquee */}
        <div className="relative w-full overflow-hidden">
          {/* Gradient fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee-reverse gap-4 px-2">
            {row2Repeated.map((client, idx) => (
              <div
                key={`r2-${client.id}-${idx}`}
                className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-[#E8531D]/40 hover:bg-orange-50/30 transition-all duration-200 cursor-pointer shrink-0"
              >
                {client.image ? (
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-white border border-slate-200/80 shrink-0 flex items-center justify-center p-0.5 shadow-xs">
                    <img src={client.image} alt={client.name} className="w-full h-full object-cover rounded" />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center group-hover:bg-[#0B2A4A] group-hover:text-white transition-colors shrink-0">
                    {client.name.charAt(0)}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-slate-700 group-hover:text-[#0B2A4A] transition-colors whitespace-nowrap">
                    {client.name}
                  </span>
                  <span className="text-[10px] text-slate-600 group-hover:text-[#E8531D] transition-colors whitespace-nowrap">
                    {currentLang === 'vi' ? client.industryVi : client.industryEn}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
