import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Layers, Award, Calendar, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { CountUp } from '../ui/CountUp';

export const Stats: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Enterprise Foundation Intro (5 cols) */}
          <motion.div
            className="lg:col-span-5 space-y-4"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-bold uppercase tracking-wider text-[#be1e2d]">
              {t('stats.badge')}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1e4384] tracking-tight leading-tight [text-wrap:balance]">
              {t('stats.title')}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed [text-wrap:balance]">
              {t('stats.desc')}
            </p>

            <ul className="pt-2 space-y-2.5 text-xs sm:text-sm text-slate-700">
              <motion.li
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{t('stats.bullet1')}</span>
              </motion.li>
              <motion.li
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{t('stats.bullet2')}</span>
              </motion.li>
              <motion.li
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{t('stats.bullet3')}</span>
              </motion.li>
            </ul>
          </motion.div>

          {/* Right Column: 4-Item Numerical Grid with Animated Count-up (7 cols) */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Stat 1: 50+ Nhân sự */}
              <motion.div
                className="p-6 rounded-2xl bg-[#f8fafc] border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -4 }}
              >
                <motion.div
                  className="w-12 h-12 rounded-xl bg-white text-[#1e4384] flex items-center justify-center shadow-sm mb-4 group-hover:text-[#be1e2d] transition-all"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Users className="w-6 h-6" />
                </motion.div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#1e4384] tracking-tight">
                  <CountUp end={50} suffix="+" />
                </div>
                <p className="text-sm font-semibold text-slate-700 mt-1">
                  {t('stats.stat1_label')}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {t('stats.stat1_desc')}
                </p>
              </motion.div>

              {/* Stat 2: 5 Triệu+ Sản lượng/năm */}
              <motion.div
                className="p-6 rounded-2xl bg-[#f8fafc] border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -4 }}
              >
                <motion.div
                  className="w-12 h-12 rounded-xl bg-white text-[#1e4384] flex items-center justify-center shadow-sm mb-4 group-hover:text-[#be1e2d] transition-all"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                >
                  <Layers className="w-6 h-6" />
                </motion.div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#1e4384] tracking-tight">
                  <CountUp end={5} suffix={t('stats.stat2_suffix')} />
                </div>
                <p className="text-sm font-semibold text-slate-700 mt-1">
                  {t('stats.stat2_label')}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {t('stats.stat2_desc')}
                </p>
              </motion.div>

              {/* Stat 3: 3+ Hệ thống tiêu chuẩn */}
              <motion.div
                className="p-6 rounded-2xl bg-[#f8fafc] border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -4 }}
              >
                <motion.div
                  className="w-12 h-12 rounded-xl bg-white text-[#1e4384] flex items-center justify-center shadow-sm mb-4 group-hover:text-[#be1e2d] transition-all"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Award className="w-6 h-6" />
                </motion.div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#1e4384] tracking-tight">
                  <CountUp end={3} suffix="+" />
                </div>
                <p className="text-sm font-semibold text-slate-700 mt-1">
                  {t('stats.stat3_label')}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {t('stats.stat3_desc')}
                </p>
              </motion.div>

              {/* Stat 4: 5+ Năm phát triển */}
              <motion.div
                className="p-6 rounded-2xl bg-[#f8fafc] border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ y: -4 }}
              >
                <motion.div
                  className="w-12 h-12 rounded-xl bg-white text-[#1e4384] flex items-center justify-center shadow-sm mb-4 group-hover:text-[#be1e2d] transition-all"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                >
                  <Calendar className="w-6 h-6" />
                </motion.div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#1e4384] tracking-tight">
                  <CountUp end={5} suffix="+" />
                </div>
                <p className="text-sm font-semibold text-slate-700 mt-1">
                  {t('stats.stat4_label')}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {t('stats.stat4_desc')}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
