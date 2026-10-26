import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Building,
  Download,
  Calendar,
  Award,
  Users,
  CheckCircle,
  FileText,
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
    <div className="pt-24 pb-20">
      <SEO
        title={t('about_page.seo_title')}
        description={t('about_page.seo_description')}
      />

      {/* Header Banner */}
      <section className="relative bg-[#1E4384] py-8 text-white sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="bg-gradient-to-r from-[#7EA5DB] to-[#F04452] bg-clip-text text-3xl font-extrabold uppercase leading-tight tracking-tight text-transparent [text-wrap:balance] sm:text-4xl lg:text-5xl">
            {t('about_page.title')}
          </h1>
          <p className="mx-auto mt-4 max-w-5xl text-sm leading-relaxed text-slate-300 [text-wrap:balance] sm:mt-5 sm:text-base">
            {t('about_page.intro')}
          </p>
          <p className="mx-auto mt-3 max-w-5xl text-sm leading-relaxed text-slate-300 [text-wrap:balance] sm:text-base">
            {t('about_page.approach')}
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3 sm:gap-4">
            <Button
              variant="primary"
              size="md"
              onClick={handleDownloadProfile}
              icon={<Download className="w-4 h-4" />}
            >
              {t('about_page.download_profile')}
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => onOpenQuoteModal()}
              className="border-white/30 text-white hover:bg-white/10"
            >
              {t('about_page.contact')}
            </Button>
          </div>
        </div>
      </section>

      {/* Vision, Mission, Core Values */}
      <section className="border-b border-slate-200 bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-3 md:gap-5">
            <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-[#FAFAFC] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#1E4384]/25 hover:shadow-lg sm:p-7">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1E4384] to-[#7EA5DB] opacity-80" />
              <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-[#1E4384]">
                {t('about_page.vision_title')}
              </h3>
              <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                {t('about_page.vision_text')}
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-[#FAFAFC] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#1E4384]/25 hover:shadow-lg sm:p-7">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1E4384] to-[#7EA5DB] opacity-80" />
              <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-[#1E4384]">
                {t('about_page.mission_title')}
              </h3>
              <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                {t('about_page.mission_text')}
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-[#FAFAFC] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#1E4384]/25 hover:shadow-lg sm:p-7">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#BE1E2D] to-[#F04452] opacity-80" />
              <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-[#1E4384]">
                {t('about_page.values_title')}
              </h3>
              <ul className="space-y-1.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                {Array.from({ length: 6 }, (_, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-[0.45em] h-1 w-1 shrink-0 rounded-full bg-[#BE1E2D]" />
                    <span>{t(`about_page.value_${index + 1}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="border-b border-slate-200 bg-[#F4F7FB] py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#BE1E2D] sm:text-sm">
              {t('about_page.history_kicker')}
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#1E4384] sm:text-3xl">
              {t('about_page.history_title')}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
              {t('about_page.history_subtitle')}
            </p>
          </div>

          <div className="relative space-y-4 before:absolute before:bottom-5 before:left-[10px] before:top-5 before:w-px before:bg-[#1E4384]/20 sm:space-y-5 sm:before:left-[13px]">
            {COMPANY_MILESTONES.map((m) => (
              <article key={m.year} className="group relative pl-8 sm:pl-10">
                <span className="absolute left-0 top-5 z-10 h-[21px] w-[21px] rounded-full border-[5px] border-[#F4F7FB] bg-[#1E4384] shadow-[0_0_0_1px_rgba(30,67,132,0.12)] transition-colors group-hover:bg-[#BE1E2D] sm:top-6 sm:h-[27px] sm:w-[27px] sm:border-[6px]" />
                <div className="rounded-xl border border-slate-200/90 bg-white px-4 py-4 shadow-[0_2px_8px_rgba(16,35,61,0.04)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-[#1E4384]/20 group-hover:shadow-md sm:rounded-2xl sm:px-6 sm:py-5">
                  <div className="mb-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-sm font-extrabold tracking-wide text-[#BE1E2D] sm:text-base">
                      {m.year}
                    </span>
                    <h3 className="text-xs font-bold uppercase leading-relaxed tracking-wide text-[#1E4384] sm:text-sm">
                      {currentLang === 'vi' ? m.titleVi : m.titleEn}
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {currentLang === 'vi' ? m.descVi : m.descEn}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section id="doi-ngu" className="border-b border-slate-200 bg-gradient-to-b from-white to-[#F7F9FC] py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            kicker="BAN ĐIỀU HÀNH"
            title="Đội ngũ lãnh đạo giàu kinh nghiệm"
            subtitle="Hội tụ các chuyên gia đầu ngành trong lĩnh vực in ấn, quản trị chuỗi cung ứng và kỹ thuật bao bì công nghiệp"
            className="mb-8 max-w-2xl sm:mb-10"
          />

          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
            {LEADERSHIP_TEAM.map((member) => (
              <div
                key={member.name}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_4px_16px_rgba(16,35,61,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#1E4384]/25 hover:shadow-[0_12px_28px_rgba(30,67,132,0.12)]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-200">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className="px-4 py-4 text-center sm:px-5 sm:py-5">
                  <h4 className="text-sm font-extrabold uppercase leading-snug tracking-wide text-[#1E4384] transition-colors group-hover:text-[#BE1E2D] sm:text-base">
                    {member.name}
                  </h4>
                  <p className="mt-1.5 text-xs font-semibold leading-snug text-[#BE1E2D] sm:text-sm">
                    {currentLang === 'vi' ? member.roleVi : member.roleEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications preview section */}
      <section id="chung-nhan" className="py-20 bg-[#FAFAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            kicker="CHỨNG NHẬN QUỐC TẾ"
            title="Minh chứng cho chất lượng và uy tín"
            subtitle="Hệ thống quản lý chất lượng và môi trường được kiểm định bởi các tổ chức uy tín hàng đầu thế giới"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {CERTIFICATES.map((cert, idx) => (
              <div
                key={cert.id}
                onClick={() => {
                  setActiveCertIdx(idx);
                  setLightboxOpen(true);
                }}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer text-center"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-red-50 text-[#BE1E2D] flex items-center justify-center mb-3">
                  <Award className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-[#1E4384]">{cert.name}</h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{cert.code}</p>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2">{cert.descriptionVi}</p>
              </div>
            ))}
          </div>

          {/* Company Profile Download CTA */}
          <div id="ho-so-nang-luc" className="mt-16 rounded-3xl bg-[#1E4384] text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <span className="text-xs uppercase font-bold text-amber-400">TÀI LIỆU NĂNG LỰC DOANH NGHIỆP</span>
              <h3 className="text-xl sm:text-2xl font-bold mt-1 text-white">
                Tải về Hồ sơ năng lực Vietlabel (Company Profile 2026)
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-xl">
                Bao gồm chi tiết danh mục máy móc thiết bị, năng lực sản xuất theo ca, bảng thông số kỹ thuật và danh sách đối tác chiến lược.
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={handleDownloadProfile}
              icon={<Download className="w-5 h-5" />}
              className="shrink-0"
            >
              Tải hồ sơ PDF
            </Button>
          </div>
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
