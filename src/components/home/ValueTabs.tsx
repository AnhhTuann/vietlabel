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
    bulletsVi: [
      'Tư vấn chọn định lượng và loại giấy tối ưu chi phí nguyên liệu',
      'Thiết kế kết cấu chống sốc và cắt mẫu mockup thực tế trong 24 giờ',
      'Đồng hành từ giai đoạn khởi tạo thương hiệu đến đại trà triệu sản phẩm',
    ],
    bulletsEn: [
      'Advisory on paper calipers and grades minimizing material costs',
      'Drop-shock structural engineering and tangible mockup sampling in 24 hours',
      'Scaling from pilot brand validation to multi-million production volumes',
    ],
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'standards',
    icon: <ShieldCheck className="w-5 h-5" />,
    titleKey: 'values.tab2_title',
    descKey: 'values.tab2_desc',
    bulletsVi: [
      'Chứng nhận chuỗi hành trình FSC bảo vệ rừng trồng có trách nhiệm',
      'Tiêu chuẩn ISO 9001:2015 kiểm định KCS tỉ mỉ từng công đoạn',
      'Chứng chỉ HACCP và FDA đảm bảo an toàn tuyệt đối khi tiếp xúc thực phẩm',
    ],
    bulletsEn: [
      'FSC Chain-of-Custody assuring responsible forestry origins',
      'ISO 9001:2015 rigorous stage-gate KCS auditing protocols',
      'HACCP and US FDA food contact migration compliance',
    ],
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'diversity',
    icon: <Grid className="w-5 h-5" />,
    titleKey: 'values.tab3_title',
    descKey: 'values.tab3_desc',
    bulletsVi: [
      'Hệ thống sản phẩm từ hộp giấy, túi quà, thùng carton đến khay định hình',
      'Khả năng xử lý hơn 30 chủng loại giấy từ phổ thông đến mỹ thuật nhập khẩu Ý, Nhật',
      'Giải pháp đồng bộ nhận diện thương hiệu trên mọi điểm chạm bao bì',
    ],
    bulletsEn: [
      'Integrated catalog spanning folding cartons, bags, shippers, and molded pulp',
      'Capacity to process 30+ paperboard substrates including luxury Italian & Japanese papers',
      'Unified brand identity consistency across all consumer touchpoints',
    ],
    image: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'tech',
    icon: <Cpu className="w-5 h-5" />,
    titleKey: 'values.tab4_title',
    descKey: 'values.tab4_desc',
    bulletsVi: [
      'Máy in Offset Heidelberg Speedmaster XL 6 màu sấy UV tốc độ 18.000 tờ/giờ',
      'Máy bế tự động Bobst Novacut Thụy Sĩ sai số dưới 0.1mm',
      'Chuẩn hóa màu in G7 Master đảm bảo sự đồng đều màu sắc 99.5%',
    ],
    bulletsEn: [
      'Heidelberg Speedmaster XL 6-color UV press running 18,000 sheets/hour',
      'Swiss Bobst Novacut automatic die-cutter with sub-0.1mm tolerances',
      'Idealliance G7 Master gray balance ensuring 99.5% repeat color accuracy',
    ],
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'team',
    icon: <UserCheck className="w-5 h-5" />,
    titleKey: 'values.tab5_title',
    descKey: 'values.tab5_desc',
    bulletsVi: [
      'Hơn 200 nhân sự được đào tạo bài bản theo quy trình 5S và Kaizen Nhật Bản',
      'Đội ngũ kỹ sư in ấn tốt nghiệp các trường đại học kỹ thuật chuyên ngành',
      'Bộ phận tư vấn khách hàng phản hồi báo giá trong 2 giờ và cập nhật tiến độ real-time',
    ],
    bulletsEn: [
      'Over 200 craftsmen disciplined in Japanese 5S and continuous Kaizen operations',
      'Certified printing engineers with deep technical graphic arts backgrounds',
      'Client support teams guaranteeing formal quote turnaround within 2 business hours',
    ],
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
                  {(currentLang === 'vi' ? activeValue.bulletsVi : activeValue.bulletsEn).map(
                    (bullet, i) => (
                      <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </div>
                    )
                  )}
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
