import React, { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import {
  ArrowDown,
  ArrowRight,
  Award,
  Compass,
  Download,
  Eye,
  HeartHandshake,
  Sparkles,
  Zap,
  Target,
  Shield,
  Users,
  TrendingUp,
} from 'lucide-react';
import { SEO } from '../lib/seo';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Button } from '../components/ui/Button';
import { COMPANY_MILESTONES, LEADERSHIP_TEAM } from '../data/company';
import { CERTIFICATES } from '../data/certificates';
import { Lightbox, type LightboxItem } from '../components/ui/Lightbox';

export const AboutPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const { onOpenQuoteModal } = useOutletContext<{ onOpenQuoteModal: (prod?: string) => void }>();

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeCertIdx, setActiveCertIdx] = useState(0);
  const [coreValuesVisible, setCoreValuesVisible] = useState(false);
  const coreValuesRef = useRef<HTMLElement>(null);
  const [activeMilestone, setActiveMilestone] = useState(-1);
  const historyRef = useRef<HTMLElement>(null);

  const milestoneColors = ['#2563eb', '#be1e2d', '#d97706', '#0891b2', '#7c3aed'];

  useEffect(() => {
    const section = coreValuesRef.current;
    if (!section) return;

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    ) {
      setCoreValuesVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCoreValuesVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = historyRef.current;
    if (!section) return;

    const lastIndex = COMPANY_MILESTONES.length - 1;
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    ) {
      setActiveMilestone(lastIndex);
      return;
    }

    let intervalId: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setActiveMilestone(0);

        if (lastIndex > 0) {
          intervalId = window.setInterval(() => {
            setActiveMilestone((currentIndex) => (currentIndex + 1) % COMPANY_MILESTONES.length);
          }, 1200);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(section);

    return () => {
      observer.disconnect();
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, []);

  const certItems: LightboxItem[] = CERTIFICATES.map((c) => ({
    id: c.id,
    title: c.name,
    subtitle: currentLang === 'vi' ? c.scopeVi : c.scopeEn,
    image: c.image,
  }));

  const handleDownloadProfile = () => {
    // Generate a simple simulated PDF download or trigger browser print
    const dummyBlob = new Blob([
      'VIETLABEL PACKAGING CORP - COMPANY PROFILE 2026\n\n' +
      'Tong quan: Cong ty Co phan San xuat Thuong mai Vietlabel.\n' +
      'Tru so & Nha may: 266/6 Le Thi Rieng, P. Thoi An, TP. HCM.\n' +
      'Tieu chuan: ISO 9001:2015, FSC CoC, HACCP, G7 Master.\n' +
      'San pham: In tem nhan decal cuon, tem duoc pham, my pham, dau nhot, bao bi giay.\n' +
      'Hotline: (+84) 086 896 8089 | thien@vietlabel.com.vn'
    ], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(dummyBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Ho-So-Nang-Luc-Vietlabel-Packaging-2026.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="overflow-hidden pb-20 pt-20 sm:pt-24">
      <SEO
        title={t('about_page.seo_title')}
        description={t('about_page.seo_description')}
      />

      <section
        data-scroll-reveal="off"
        className="relative isolate overflow-hidden bg-[#081b35] text-white"
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_78%_35%,rgba(63,112,190,0.3),transparent_38%),linear-gradient(120deg,#081b35_0%,#102e58_56%,#1e4384_100%)]" />
        
        {/* Animated background elements */}
        <motion.div 
          className="absolute -right-32 top-0 -z-10 h-[26rem] w-[26rem] rounded-full border border-white/10 about-orbit sm:h-[36rem] sm:w-[36rem]"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute -right-12 top-16 -z-10 h-[20rem] w-[20rem] rounded-full border border-white/10 about-orbit about-orbit-delay sm:h-[28rem] sm:w-[28rem]"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white/20"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 lg:px-8 lg:py-24">
          <motion.div 
            className="about-hero-copy relative z-10"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-2 text-xs font-semibold tracking-wide text-blue-100 backdrop-blur"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-4 w-4 text-amber-300" aria-hidden="true" />
              </motion.div>
              <span>{t('about_page.title')}</span>
            </motion.div>
            <motion.h1 
              className="max-w-3xl text-4xl font-extrabold leading-[1.12] tracking-tight text-white [text-wrap:balance] sm:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {t('about_page.title')}
              <motion.span 
                className="mt-2 block h-1.5 w-20 rounded-full bg-[#e44b59]"
                initial={{ width: 0 }}
                animate={{ width: 80 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              />
            </motion.h1>
            <motion.p 
              className="mt-7 max-w-2xl text-sm leading-7 text-blue-100/90 [text-wrap:pretty] sm:text-base sm:leading-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {t('about_page.intro')}
            </motion.p>
            <motion.p 
              className="mt-4 max-w-2xl text-sm leading-7 text-blue-100/75 [text-wrap:pretty] sm:text-base sm:leading-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {t('about_page.approach')}
            </motion.p>

            <motion.div 
              className="mt-8 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <Button
                variant="primary"
                size="md"
                onClick={handleDownloadProfile}
                icon={<Download className="h-4 w-4" />}
                className="bg-white text-[#15386e] shadow-lg hover:bg-blue-50"
              >
                {t('about_page.download_profile')}
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => onOpenQuoteModal()}
                icon={<ArrowRight className="h-4 w-4" />}
                className="border-white/30 text-white hover:border-white/60 hover:bg-white/10"
              >
                {t('about_page.contact')}
              </Button>
            </motion.div>

            <motion.a
              href="#tam-nhin"
              className="mt-9 inline-flex items-center gap-2 text-xs font-semibold text-blue-200 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
              {t('about_page.vision_title')}
            </motion.a>
          </motion.div>

          <motion.div 
            className="about-hero-visual relative mx-auto w-full max-w-2xl lg:ml-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div 
              className="absolute -inset-3 rounded-[2rem] border border-white/10 sm:-inset-5"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-[#163965] shadow-2xl shadow-black/30 sm:rounded-[2rem]">
              <motion.img
                src="/images/vietlabel/factory-machine1.jpg"
                alt=""
                className="about-image-drift h-full w-full object-cover"
                fetchPriority="high"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06162d]/80 via-transparent to-[#06162d]/10" />
              <motion.div 
                className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#be1e2d] via-[#f1b347] to-[#8cb6ee]"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: '200% 200%' }}
              />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-7 sm:left-7 sm:right-7">
                <img
                  src="/images/vietlabel/logo-white.png"
                  alt="Vietlabel"
                  className="h-8 w-auto max-w-[150px] object-contain object-left sm:h-10"
                />
                <motion.span 
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {COMPANY_MILESTONES[0]?.year}
                </motion.span>
              </div>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      </section>

      <section id="tam-nhin" className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
            <motion.article 
              className="about-card group relative overflow-hidden rounded-3xl border border-[#dfe7f3] bg-[#f7f9fd] p-6 sm:p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -8 }}
            >
              <motion.div 
                className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1e4384] text-white shadow-lg shadow-blue-900/15"
                whileHover={{ rotate: -15, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <Eye className="h-5 w-5" aria-hidden="true" />
              </motion.div>
              <h2 className="text-xl font-extrabold tracking-tight text-[#102d58] sm:text-2xl">
                {t('about_page.vision_title')}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                {t('about_page.vision_text')}
              </p>
              <motion.span 
                className="pointer-events-none absolute -bottom-10 -right-8 h-36 w-36 rounded-full border-[20px] border-[#1e4384]/[0.04]"
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.article>

            <motion.article 
              className="about-card group relative overflow-hidden rounded-3xl bg-[#1e4384] p-6 text-white shadow-xl shadow-blue-950/15 sm:p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -8 }}
            >
              <motion.div 
                className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <div className="relative">
                <motion.div 
                  className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-blue-100 ring-1 ring-white/15"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <HeartHandshake className="h-5 w-5" aria-hidden="true" />
                </motion.div>
                <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">
                  {t('about_page.mission_title')}
                </h2>
                <p className="mt-4 text-sm leading-7 text-blue-50/85 sm:text-base">
                  {t('about_page.mission_text')}
                </p>
              </div>
            </motion.article>

          </div>

          <motion.section
            ref={coreValuesRef}
            data-values-visible={coreValuesVisible}
            className="core-values-panel relative mt-5 overflow-hidden rounded-[2rem] bg-[#102d58] p-6 text-white shadow-xl shadow-blue-950/10 sm:p-9 lg:p-11"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.div 
              className="pointer-events-none absolute -right-24 -top-36 h-96 w-96 rounded-full border border-white/[0.08]"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="pointer-events-none absolute -right-5 -top-20 h-64 w-64 rounded-full border border-white/[0.08]"
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />
            <div className="relative grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-14">
              <motion.div 
                className="core-values-heading"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <motion.span 
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-rose-200 ring-1 ring-white/15"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Compass className="h-5 w-5" aria-hidden="true" />
                </motion.span>
                <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {t('about_page.values_title')}
                </h2>
                <motion.span 
                  className="mt-4 block h-1 w-14 rounded-full bg-[#e44b59]"
                  initial={{ width: 0 }}
                  whileInView={{ width: 56 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                />
              </motion.div>

              <ul className="grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 6 }, (_, index) => (
                  <motion.li
                    key={index}
                    style={{ '--core-value-index': index } as React.CSSProperties}
                    className="core-value-item group/item flex min-h-[72px] items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 transition-all duration-300 hover:border-white/30 hover:bg-white/[0.12] active:scale-[0.98] sm:px-5"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <motion.span 
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xs font-extrabold tracking-wider text-rose-200 transition-all duration-300 group-hover/item:rotate-[-6deg] group-hover/item:bg-[#be1e2d] group-hover/item:text-white"
                      whileHover={{ rotate: -6, scale: 1.1 }}
                    >
                      0{index + 1}
                    </motion.span>
                    <span className="text-sm font-semibold leading-6 text-blue-50 sm:text-base">
                      {t(`about_page.value_${index + 1}`)}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.section>
        </div>
      </section>

      <section ref={historyRef} className="border-y border-[#e4eaf3] bg-[#f4f7fb] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="mb-10 max-w-2xl sm:mb-14"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.span 
              className="text-xs font-bold uppercase tracking-[0.2em] text-[#be1e2d]"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {t('about_page.history_kicker')}
            </motion.span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#102d58] [text-wrap:balance] sm:text-4xl">
              {t('about_page.history_title')}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
              {t('about_page.history_subtitle')}
            </p>
          </motion.div>

          <motion.div
            className="history-timeline relative mx-auto grid max-w-4xl gap-4 sm:gap-5"
            style={{
              '--timeline-progress': `${Math.max(activeMilestone, 0) / Math.max(COMPANY_MILESTONES.length - 1, 1) * 100}%`,
            } as React.CSSProperties}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="history-timeline-track" aria-hidden="true">
              <motion.span 
                className="history-timeline-progress"
                style={{ height: 'var(--timeline-progress)' }}
              />
              <motion.span 
                className="history-timeline-arrow"
                animate={{ y: 'var(--timeline-progress)' }}
                transition={{ duration: 0.5 }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.span>
            </div>
            {COMPANY_MILESTONES.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                className={`history-timeline-item group relative pl-12 ${index <= activeMilestone ? 'is-reached' : ''} ${index === activeMilestone ? 'is-active' : ''}`}
                style={{ '--milestone-color': milestoneColors[index % milestoneColors.length] } as React.CSSProperties}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <motion.span 
                  className="history-timeline-node" 
                  aria-hidden="true"
                  animate={index === activeMilestone ? { scale: [1, 1.25, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <span />
                </motion.span>
                <motion.button
                  type="button"
                  onClick={() => setActiveMilestone(index)}
                  aria-pressed={index === activeMilestone}
                  className="history-timeline-card w-full rounded-2xl border border-[#e0e7f1] bg-white p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e4384] focus-visible:ring-offset-2 sm:p-6"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <motion.span 
                      className="history-timeline-year text-lg font-extrabold tracking-tight sm:text-xl"
                      animate={index === activeMilestone ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {milestone.year}
                    </motion.span>
                    <h3 className="text-sm font-bold leading-relaxed text-[#1e4384] sm:text-base">
                      {currentLang === 'vi' ? milestone.titleVi : milestone.titleEn}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {currentLang === 'vi' ? milestone.descVi : milestone.descEn}
                  </p>
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="doi-ngu" className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionTitle
              kicker="BAN ĐIỀU HÀNH"
              title="Đội ngũ lãnh đạo giàu kinh nghiệm"
              subtitle="Hội tụ các chuyên gia đầu ngành trong lĩnh vực in ấn, quản trị chuỗi cung ứng và kỹ thuật bao bì công nghiệp"
              className="mb-9 max-w-2xl sm:mb-12"
            />
          </motion.div>

          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
            {LEADERSHIP_TEAM.map((member, index) => (
              <motion.article
                key={member.name}
                className="about-card group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white text-center shadow-[0_4px_16px_rgba(16,35,61,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#1e4384]/25 hover:shadow-[0_12px_28px_rgba(30,67,132,0.12)]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-200">
                  <motion.img
                    src={member.avatar}
                    alt={member.name}
                    className="absolute inset-0 h-full w-full object-cover object-top"
                    loading="lazy"
                    decoding="async"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <div className="px-4 py-4 sm:px-5 sm:py-5">
                  <motion.h3 
                    className="text-sm font-extrabold uppercase leading-snug tracking-wide text-[#1e4384] transition-colors group-hover:text-[#be1e2d] sm:text-base"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {member.name}
                  </motion.h3>
                  <p className="mt-1.5 text-xs font-semibold leading-snug text-[#be1e2d] sm:text-sm">
                    {currentLang === 'vi' ? member.roleVi : member.roleEn}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="chung-nhan" className="bg-[#f6f8fc] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionTitle
              kicker="CHỨNG NHẬN QUỐC TẾ"
              title="Minh chứng cho chất lượng và uy tín"
              subtitle="Hệ thống quản lý chất lượng và môi trường được kiểm định bởi các tổ chức uy tín hàng đầu thế giới"
              className="mb-9 sm:mb-12"
            />
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {CERTIFICATES.map((certificate, index) => (
              <motion.button
                key={certificate.id}
                type="button"
                onClick={() => {
                  setActiveCertIdx(index);
                  setLightboxOpen(true);
                }}
                className="about-card group relative flex min-h-52 flex-col items-start rounded-2xl border border-[#dfe7f3] bg-white p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#1e4384]/25 hover:shadow-xl hover:shadow-blue-950/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e4384] focus-visible:ring-offset-2"
                aria-label={`${certificate.name} — ${certificate.descriptionVi}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.span 
                  className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#fbe9ec] text-[#be1e2d] transition-all duration-300 group-hover:bg-[#be1e2d] group-hover:text-white"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Award className="h-5 w-5" aria-hidden="true" />
                </motion.span>
                <span className="text-sm font-extrabold leading-snug text-[#1e4384]">
                  {certificate.name}
                </span>
                <span className="mt-1.5 text-[11px] text-slate-500">
                  {certificate.code}
                </span>
                <span className="mt-3 line-clamp-2 text-xs leading-5 text-slate-600">
                  {certificate.descriptionVi}
                </span>
                <motion.div 
                  className="absolute bottom-5 right-5"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <ArrowRight className="h-4 w-4 text-[#be1e2d] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" aria-hidden="true" />
                </motion.div>
              </motion.button>
            ))}
          </div>

          <motion.div
            id="ho-so-nang-luc"
            className="relative mt-12 overflow-hidden rounded-3xl bg-[#102d58] p-6 text-white shadow-xl shadow-blue-950/15 sm:mt-16 sm:p-10 lg:p-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="absolute -right-16 -top-28 h-80 w-80 rounded-full border border-white/10"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute -right-3 -top-16 h-56 w-56 rounded-full border border-white/10"
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />
            <div className="relative flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <motion.span 
                  className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  TÀI LIỆU NĂNG LỰC DOANH NGHIỆP
                </motion.span>
                <h2 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight text-white [text-wrap:balance] sm:text-3xl">
                  Tải về Hồ sơ năng lực Vietlabel (Company Profile 2026)
                </h2>
                <p className="mt-3 text-sm leading-7 text-blue-100/80 sm:text-base">
                  Bao gồm chi tiết danh mục máy móc thiết bị, năng lực sản xuất theo ca, bảng thông số kỹ thuật và danh sách đối tác chiến lược.
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleDownloadProfile}
                  icon={<Download className="h-5 w-5" />}
                  className="shrink-0 bg-white text-[#15386e] shadow-lg hover:bg-blue-50"
                >
                  Tải hồ sơ PDF
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        items={certItems}
        currentIndex={activeCertIdx}
        onNavigate={setActiveCertIdx}
      />
    </div>
  );
};
