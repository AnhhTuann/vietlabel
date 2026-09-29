import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Building,
  Target,
  Compass,
  HeartHandshake,
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
        title="Về Chúng Tôi | Vietlabel - 20 Năm Đồng Hành Cùng Thương Hiệu"
        description="Lịch sử hình thành, tầm nhìn sứ mệnh, đội ngũ lãnh đạo và hệ sinh thái sản xuất bao bì giấy & tem nhãn chuyên nghiệp của Vietlabel."
      />

      {/* Header Banner */}
      <section className="bg-[#0B2A4A] text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 inline-block">
            VỀ CHÚNG TÔI
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight [text-wrap:balance]">
            Tiên phong kiến tạo chuẩn mực bao bì giấy bền vững
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed [text-wrap:balance]">
            Hơn hai thập kỷ kiên định với sứ mệnh mang đến giải pháp bao bì bảo vệ toàn diện, tối ưu chi phí và gia tăng giá trị thương hiệu cho các doanh nghiệp Việt Nam và toàn cầu.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Button
              variant="primary"
              size="md"
              onClick={handleDownloadProfile}
              icon={<Download className="w-4 h-4" />}
            >
              Tải hồ sơ năng lực (Profile PDF)
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => onOpenQuoteModal()}
              className="border-white/30 text-white hover:bg-white/10"
            >
              Tư vấn hợp tác B2B
            </Button>
          </div>
        </div>
      </section>

      {/* Vision, Mission, Core Values */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-[#FAFAFC] border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#E8531D] flex items-center justify-center mb-5">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0B2A4A] mb-3">Tầm nhìn chiến lược</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Trở thành tập đoàn sản xuất bao bì giấy công nghiệp hàng đầu khu vực Đông Nam Á, tiên phong chuyển đổi sang giải pháp bao bì sinh thái tuần hoàn đạt chuẩn ESG toàn cầu.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#FAFAFC] border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0B2A4A] flex items-center justify-center mb-5">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0B2A4A] mb-3">Sứ mệnh doanh nghiệp</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Đồng hành cùng sự phát triển bền vững của khách hàng thông qua công nghệ in ấn vượt trội, quy trình chuẩn mực và tinh thần phụng sự tận tâm trong từng chiếc hộp bao bì.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#FAFAFC] border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0B2A4A] mb-3">Giá trị cốt lõi</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                <strong>Chất lượng (Quality)</strong> - <strong>Trách nhiệm (Sustainability)</strong> - <strong>Sáng tạo (Innovation)</strong> - <strong>Đúng hẹn (Punctuality)</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-20 bg-[#F5F7FA] border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            kicker="LỊCH SỬ HÌNH THÀNH"
            title="Hành trình hơn 20 năm phát triển vững chắc"
            subtitle="Từ một xưởng in quy mô nhỏ đến tổ hợp nhà máy sản xuất bao bì công nghệ cao 15.000m²"
          />

          <div className="relative mt-12 pl-6 sm:pl-8 border-l-2 border-slate-300 space-y-12">
            {COMPANY_MILESTONES.map((m, idx) => (
              <div key={m.year} className="relative group">
                {/* Node circle */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-5 h-5 rounded-full bg-[#0B2A4A] border-4 border-white shadow-md group-hover:bg-[#E8531D] group-hover:scale-125 transition-all" />

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl font-extrabold font-mono text-[#E8531D] tracking-tight">
                      {m.year}
                    </span>
                    <span className="text-sm font-bold text-[#0B2A4A]">
                      {currentLang === 'vi' ? m.titleVi : m.titleEn}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {currentLang === 'vi' ? m.descVi : m.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section id="doi-ngu" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            kicker="BAN ĐIỀU HÀNH"
            title="Đội ngũ lãnh đạo giàu kinh nghiệm"
            subtitle="Hội tụ các chuyên gia đầu ngành trong lĩnh vực in ấn, quản trị chuỗi cung ứng và kỹ thuật bao bì công nghiệp"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {LEADERSHIP_TEAM.map((member, i) => (
              <div
                key={i}
                className="group rounded-2xl bg-[#FAFAFC] border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[4/3] bg-slate-200 overflow-hidden relative">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs font-medium">
                    {member.experience}
                  </div>
                </div>

                <div className="p-5">
                  <h4 className="text-base font-bold text-[#0B2A4A] group-hover:text-[#E8531D] transition-colors">
                    {member.name}
                  </h4>
                  <p className="text-xs font-semibold text-[#E8531D] mt-0.5">
                    {currentLang === 'vi' ? member.roleVi : member.roleEn}
                  </p>
                  <p className="mt-3 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {currentLang === 'vi' ? member.bioVi : member.bioEn}
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
                <div className="w-12 h-12 mx-auto rounded-xl bg-orange-50 text-[#E8531D] flex items-center justify-center mb-3">
                  <Award className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-[#0B2A4A]">{cert.name}</h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{cert.code}</p>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2">{cert.descriptionVi}</p>
              </div>
            ))}
          </div>

          {/* Company Profile Download CTA */}
          <div id="ho-so-nang-luc" className="mt-16 rounded-3xl bg-[#0B2A4A] text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
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
