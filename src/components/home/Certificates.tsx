import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Award, Eye, ExternalLink } from 'lucide-react';
import { CERTIFICATES } from '../../data/certificates';
import { SectionTitle } from '../ui/SectionTitle';
import { Lightbox, type LightboxItem } from '../ui/Lightbox';

export const Certificates: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeCertIndex, setActiveCertIndex] = useState(0);

  const lightboxItems: LightboxItem[] = CERTIFICATES.map((cert) => ({
    id: cert.id,
    title: `${cert.name} - ${currentLang === 'vi' ? cert.issuerVi : cert.issuerEn}`,
    subtitle: `${currentLang === 'vi' ? cert.scopeVi : cert.scopeEn} (Hiệu lực: ${cert.validity})`,
    image: cert.image,
  }));

  const handleOpenCert = (index: number) => {
    setActiveCertIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section className="py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          kicker={t('certificates.badge')}
          title={t('certificates.title')}
          subtitle={t('certificates.subtitle')}
        />

        {/* 5 Certification Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {CERTIFICATES.map((cert, idx) => (
            <div
              key={cert.id}
              onClick={() => handleOpenCert(idx)}
              className="group relative flex flex-col justify-between p-6 rounded-2xl bg-[#FAFAFC] border border-slate-200 hover:border-[#E8531D]/50 hover:bg-white hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer text-center"
            >
              <div>
                {/* Certification Badge / Symbol */}
                <div className="w-16 h-16 mx-auto rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-[#0B2A4A] group-hover:scale-110 group-hover:border-[#E8531D]/40 transition-all duration-300 mb-4">
                  {cert.id === 'fsc-coc' ? (
                    <Award className="w-8 h-8 text-emerald-600" />
                  ) : cert.id === 'iso-9001' ? (
                    <ShieldCheck className="w-8 h-8 text-blue-600" />
                  ) : cert.id === 'ecovadis' ? (
                    <Award className="w-8 h-8 text-amber-600" />
                  ) : cert.id === 'haccp' ? (
                    <ShieldCheck className="w-8 h-8 text-red-600" />
                  ) : (
                    <span className="font-black text-xl text-[#0B2A4A]">G7</span>
                  )}
                </div>

                {/* Badge Micro Tag */}
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#E8531D] mb-1.5">
                  {cert.badgeText}
                </span>

                <h3 className="text-base font-bold text-[#0B2A4A] group-hover:text-[#E8531D] transition-colors leading-snug">
                  {cert.name}
                </h3>

                <p className="text-[11px] text-slate-500 font-medium mt-1">
                  {currentLang === 'vi' ? cert.issuerVi : cert.issuerEn}
                </p>

                <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                  {currentLang === 'vi' ? cert.descriptionVi : cert.descriptionEn}
                </p>
              </div>

              {/* View Original Certificate affordance */}
              <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#0B2A4A] group-hover:text-[#E8531D] transition-colors">
                <Eye className="w-3.5 h-3.5" />
                <span>{t('certificates.view_cert')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accessible Lightbox */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        items={lightboxItems}
        currentIndex={activeCertIndex}
        onNavigate={setActiveCertIndex}
      />
    </section>
  );
};
