import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sparkles,
  ShieldCheck,
  Grid,
  Cpu,
  UserCheck,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { SectionTitle } from '../ui/SectionTitle';

interface ValueItem {
  id: string;
  icon: React.ReactNode;
  titleKey: string;
  descKey: string;
  bulletsVi: string[];
  bulletsEn: string[];
  image: string;
}

const VALUES: ValueItem[] = [
  {
    id: 'solution',
    icon: <Sparkles className="w-5 h-5" />,
    titleKey: 'values.tab1_title',
    descKey: 'values.tab1_desc',
    
    
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'standards',
    icon: <ShieldCheck className="w-5 h-5" />,
    titleKey: 'values.tab2_title',
    descKey: 'values.tab2_desc',
    
    
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'diversity',
    icon: <Grid className="w-5 h-5" />,
    titleKey: 'values.tab3_title',
    descKey: 'values.tab3_desc',
    
    
    image: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'tech',
    icon: <Cpu className="w-5 h-5" />,
    titleKey: 'values.tab4_title',
    descKey: 'values.tab4_desc',
    
    
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'team',
    icon: <UserCheck className="w-5 h-5" />,
    titleKey: 'values.tab5_title',
    descKey: 'values.tab5_desc',
    
    
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop',
  },
];

export const ValueTabs: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const [activeTab, setActiveTab] = useState(0);

  const activeValue = VALUES[activeTab];

  return (
    <section className="py-24 bg-[#1E4384] text-white relative overflow-hidden">
      {/* Background industrial overlay */}
      <div className="absolute inset-0 opacity-10">
        <img
          src="https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=2000&auto=format&fit=crop"
          alt="Factory Background"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          kicker={t('values.badge')}
          title={t('values.title')}
          subtitle={t('values.subtitle')}
          dark={true}
        />

        {/* Desktop Vertical Tabs + Content side-by-side / Mobile Accordion */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Vertical Tabs / Selectors (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {VALUES.map((val, idx) => {
              const isSelected = idx === activeTab;
              return (
                <button
                  key={val.id}
                  onClick={() => setActiveTab(idx)}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-200 flex items-start gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    isSelected
                      ? 'bg-white text-[#1E4384] shadow-xl translate-x-1'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-lg shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#BE1E2D] text-white'
                        : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    {val.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold leading-tight">
                        {t(val.titleKey)}
                      </h4>
                      {isSelected && (
                        <ArrowRight className="w-4 h-4 text-[#BE1E2D] shrink-0 hidden sm:block" />
                      )}
                    </div>
                    {/* On mobile, show short description inside accordion card if selected */}
                    <div className="lg:hidden mt-2">
                      {isSelected && (
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                          {t(val.descKey)}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Content Panel (7 cols) */}
          <div className="lg:col-span-7 hidden lg:block">
            <div className="h-full rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-8 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center gap-3 text-xs font-semibold tracking-wider text-amber-400 uppercase mb-3">
                  <span>GIẢI PHÁP TRỌN GÓI</span>
                  <span>·</span>
                  <span className="text-slate-300 font-normal">CAM KẾT VIETLABEL</span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">
                  {t(activeValue.titleKey)}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  {t(activeValue.descKey)}
                </p>

                {/* Key bullets */}
                <div className="space-y-3 mb-6">
                  
                </div>
              </div>

              {/* Showcase Image */}
              <div className="relative rounded-xl overflow-hidden aspect-[21/9] bg-slate-900 border border-white/10 mt-4">
                <img
                  src={activeValue.image}
                  alt={t(activeValue.titleKey)}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <span className="text-xs font-semibold text-slate-200">
                    Cơ sở vật chất đạt chứng nhận ISO 9001:2015 & FSC CoC
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
