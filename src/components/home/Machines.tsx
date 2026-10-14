import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Cpu, ZoomIn, ArrowRight } from 'lucide-react';
import { MACHINES_LIST } from '../../data/machines';
import { SectionTitle } from '../ui/SectionTitle';
import { Button } from '../ui/Button';
import { Lightbox, type LightboxItem } from '../ui/Lightbox';

export const Machines: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeMachineIndex, setActiveMachineIndex] = useState(0);

  const lightboxItems: LightboxItem[] = MACHINES_LIST.map((m) => ({
    id: m.id,
    title: `${m.name} (${m.origin})`,
    subtitle: `${currentLang === 'vi' ? m.purposeVi : m.purposeEn} - Công suất: ${
      currentLang === 'vi' ? m.capacityVi : m.capacityEn
    }`,
    image: m.image,
  }));

  const handleOpenMachine = (idx: number) => {
    setActiveMachineIndex(idx);
    setLightboxOpen(true);
  };

  return (
    <section className="py-24 bg-[#FAFAFC] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          kicker={t('machines.badge')}
          title={t('machines.title')}
          subtitle={t('machines.subtitle')}
        />

        {/* Gallery of 6 high-tech machinery items (Symmetrical 3x2 Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MACHINES_LIST.map((machine, i) => (
            <div
              key={machine.id}
              onClick={() => handleOpenMachine(i)}
              className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer aspect-[4/3]"
            >
              <img
                src={machine.image}
                alt={machine.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent flex flex-col justify-end p-5 sm:p-6 text-white">
                <div className="flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-amber-400 block mb-1">
                      {machine.origin} · {machine.capacityVi}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white line-clamp-2 leading-snug">
                      {machine.name}
                    </h3>
                  </div>
                  <div className="p-2 rounded-full bg-white/20 backdrop-blur-md group-hover:bg-[#BE1E2D] transition-colors shrink-0">
                    <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Technology Link */}
        <div className="mt-12 text-center">
          <Link to="/cong-nghe">
            <Button
              variant="outline"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {t('machines.view_all_tech')}
            </Button>
          </Link>
        </div>
      </div>

      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        items={lightboxItems}
        currentIndex={activeMachineIndex}
        onNavigate={setActiveMachineIndex}
      />
    </section>
  );
};
