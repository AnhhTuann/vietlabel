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

        {/* Gallery of 5 high-tech machinery items (Masonry / Bento Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Item 1: Large Featured Offset Press (7 cols) */}
          <div
            onClick={() => handleOpenMachine(0)}
            className="md:col-span-7 group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer aspect-[16/10]"
          >
            <img
              src={MACHINES_LIST[0].image}
              alt={MACHINES_LIST[0].name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                    {MACHINES_LIST[0].origin} · {MACHINES_LIST[0].capacityVi}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                    {MACHINES_LIST[0].name}
                  </h3>
                </div>
                <div className="p-2 rounded-full bg-white/20 backdrop-blur-md group-hover:bg-[#BE1E2D] transition-colors">
                  <ZoomIn className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Item 2: Bobst Die-cutter (5 cols) */}
          <div
            onClick={() => handleOpenMachine(1)}
            className="md:col-span-5 group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer aspect-[16/10]"
          >
            <img
              src={MACHINES_LIST[1].image}
              alt={MACHINES_LIST[1].name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                    {MACHINES_LIST[1].origin} · {MACHINES_LIST[1].capacityVi}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-1 line-clamp-1">
                    {MACHINES_LIST[1].name}
                  </h3>
                </div>
                <div className="p-2 rounded-full bg-white/20 backdrop-blur-md group-hover:bg-[#BE1E2D] transition-colors">
                  <ZoomIn className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Items 3, 4, 5 (4 cols each) */}
          {MACHINES_LIST.slice(2, 5).map((machine, i) => (
            <div
              key={machine.id}
              onClick={() => handleOpenMachine(i + 2)}
              className="md:col-span-4 group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer aspect-[4/3]"
            >
              <img
                src={machine.image}
                alt={machine.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                      {machine.origin}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white mt-0.5 line-clamp-1">
                      {machine.name}
                    </h3>
                  </div>
                  <div className="p-1.5 rounded-full bg-white/20 backdrop-blur-md group-hover:bg-[#BE1E2D] transition-colors shrink-0 ml-2">
                    <ZoomIn className="w-4 h-4 text-white" />
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
