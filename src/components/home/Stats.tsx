import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Layers, Award, Calendar, CheckCircle } from 'lucide-react';
import { CountUp } from '../ui/CountUp';

export const Stats: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Enterprise Foundation Intro (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#BE1E2D]">
              {t('stats.badge')}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1E4384] tracking-tight leading-tight [text-wrap:balance]">
              {t('stats.title')}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed [text-wrap:balance]">
              {t('stats.desc')}
            </p>

            <ul className="pt-2 space-y-2.5 text-xs sm:text-sm text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{t('stats.bullet1')}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{t('stats.bullet2')}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{t('stats.bullet3')}</span>
              </li>
            </ul>
          </div>

          {/* Right Column: 4-Item Numerical Grid with Animated Count-up (7 cols) */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Stat 1: 50+ Nhân sự */}
              <div className="p-6 rounded-2xl bg-[#F5F7FA] border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 group">
                <div className="w-12 h-12 rounded-xl bg-white text-[#1E4384] flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 group-hover:text-[#BE1E2D] transition-all">
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#1E4384] tracking-tight">
                  <CountUp end={50} suffix="+" />
                </div>
                <p className="text-sm font-semibold text-slate-700 mt-1">
                  {t('stats.stat1_label')}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {t('stats.stat1_desc')}
                </p>
              </div>

              {/* Stat 2: 5 Triệu+ Sản lượng/năm */}
              <div className="p-6 rounded-2xl bg-[#F5F7FA] border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 group">
                <div className="w-12 h-12 rounded-xl bg-white text-[#1E4384] flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 group-hover:text-[#BE1E2D] transition-all">
                  <Layers className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#1E4384] tracking-tight">
                  <CountUp end={5} suffix={t('stats.stat2_suffix')} />
                </div>
                <p className="text-sm font-semibold text-slate-700 mt-1">
                  {t('stats.stat2_label')}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {t('stats.stat2_desc')}
                </p>
              </div>

              {/* Stat 3: 3+ Hệ thống tiêu chuẩn */}
              <div className="p-6 rounded-2xl bg-[#F5F7FA] border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 group">
                <div className="w-12 h-12 rounded-xl bg-white text-[#1E4384] flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 group-hover:text-[#BE1E2D] transition-all">
                  <Award className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#1E4384] tracking-tight">
                  <CountUp end={3} suffix="+" />
                </div>
                <p className="text-sm font-semibold text-slate-700 mt-1">
                  {t('stats.stat3_label')}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {t('stats.stat3_desc')}
                </p>
              </div>

              {/* Stat 4: 5+ Năm phát triển */}
              <div className="p-6 rounded-2xl bg-[#F5F7FA] border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 group">
                <div className="w-12 h-12 rounded-xl bg-white text-[#1E4384] flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 group-hover:text-[#BE1E2D] transition-all">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#1E4384] tracking-tight">
                  <CountUp end={5} suffix="+" />
                </div>
                <p className="text-sm font-semibold text-slate-700 mt-1">
                  {t('stats.stat4_label')}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {t('stats.stat4_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
