import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import {
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ZoomIn,
  ArrowRight,
} from 'lucide-react';
import { SEO } from '../lib/seo';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Button } from '../components/ui/Button';
import { MACHINES_LIST } from '../data/machines';
import { Lightbox, type LightboxItem } from '../components/ui/Lightbox';

export const TechnologyPage: React.FC = () => {
  const { onOpenQuoteModal } = useOutletContext<{ onOpenQuoteModal: (prod?: string) => void }>();
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const lightboxItems: LightboxItem[] = MACHINES_LIST.map((m) => ({
    id: m.id,
    title: m.name,
    subtitle: `${m.origin} - Công suất: ${m.capacityVi}`,
    image: m.image,
  }));

  const steps = [
    {
      step: '01',
      title: 'Thiết kế kết cấu & Dựng mẫu 3D',
      desc: 'Sử dụng phần mềm ArtiosCAD thiết kế khuôn bế. Cắt mẫu mockup thực tế bằng máy Kongsberg để kiểm tra độ vừa vặn sản phẩm.',
    },
    {
      step: '02',
      title: 'Chế bản điện tử & Ghi kẽm CTP',
      desc: 'Xuất kẽm nhiệt CTP Kodak công nghệ laser độ phân giải 2400 dpi, đảm bảo hạt trâm sắc nét và cân bằng thang xám G7.',
    },
    {
      step: '03',
      title: 'In Offset UV chuẩn màu G7',
      desc: 'In ấn trên máy Heidelberg Speedmaster XL 6 màu. Hệ thống Inpress Control tự động đo quang phổ và bù trừ màu theo thời gian thực.',
    },
    {
      step: '04',
      title: 'Xử lý hiệu ứng bề mặt cao cấp',
      desc: 'Ép kim nhũ Masterwork, cán màng nhiệt BOPP, phủ bóng cát, phủ UV định hình 3D tạo hiệu ứng thị giác và xúc giác đẳng cấp.',
    },
    {
      step: '05',
      title: 'Bế khuôn & Dán hộp tự động',
      desc: 'Máy bế tự động Bobst Novacut tốc độ 8.000 tờ/giờ. Dán hộp Bobst Expertfold đa năng tốc độ 45.000 hộp/giờ với keo nhiệt bền chặt.',
    },
    {
      step: '06',
      title: 'Kiểm soát KCS & Đóng gói Pallet',
      desc: '100% lô hàng được kiểm tra độ bục, độ kết dính, quét mã vạch kiểm tra số lượng và quấn màng co pallet đạt chuẩn vận chuyển đường biển.',
    },
  ];

  return (
    <div className="pt-24 pb-20">
      <SEO
        title="Công Nghệ & Máy Móc Sản Xuất | Vietlabel"
        description="Chi tiết hệ thống máy in Flexo cuộn, máy in Offset công nghiệp, máy bế tự động và quy trình sản xuất bao bì & tem nhãn 6 bước khép kín của Vietlabel."
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#081b35] text-white py-20 text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_78%_35%,rgba(63,112,190,0.3),transparent_38%),linear-gradient(120deg,#081b35_0%,#102e58_56%,#1e4384_100%)]" />

        {/* Animated background rings */}
        <motion.div
          className="absolute -right-28 top-0 -z-10 h-96 w-96 rounded-full border border-white/10"
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute -left-20 bottom-0 -z-10 h-80 w-80 rounded-full border border-white/10"
          animate={{ rotate: -360 }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        />

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white/20"
            style={{
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
          />
        ))}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 inline-block">
              HẠ TẦNG KỸ THUẬT & CÔNG NGHỆ
            </span>
          </motion.div>

          <motion.h1
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight [text-wrap:balance]"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            Trang thiết bị máy móc hiện đại bậc nhất
            <motion.span
              className="mt-3 block h-1.5 w-24 mx-auto rounded-full bg-[#e44b59]"
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
          </motion.h1>

          <motion.p
            className="mt-5 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed [text-wrap:balance]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Hơn 50 thiết bị chuyên dụng nhập khẩu mới 100% từ Đức, Thụy Sĩ, Nhật Bản tạo nên dây chuyền sản xuất tự động hóa đồng bộ từ khâu chế bản đến xuất xưởng.
          </motion.p>
        </div>
      </section>

      {/* Production Stepper */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionTitle
              kicker="QUY TRÌNH SẢN XUẤT"
              title="Quy trình 6 bước khép kín đạt chuẩn G7 & ISO"
              subtitle="Mỗi công đoạn đều có quy chuẩn kỹ thuật (SOP) rõ ràng và hồ sơ giám sát chất lượng riêng biệt"
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {steps.map((st, i) => (
              <motion.div
                key={st.step}
                className="relative p-6 rounded-2xl bg-[#FAFAFC] border border-slate-200 hover:shadow-xl hover:border-[#1E4384]/30 transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <motion.span
                    className="text-3xl font-black font-mono text-[#BE1E2D] tracking-tight group-hover:scale-110 transition-transform origin-left inline-block"
                  >
                    {st.step}
                  </motion.span>
                  <motion.div
                    className="w-2.5 h-2.5 rounded-full bg-[#1E4384]"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  />
                </div>
                <h3 className="text-base font-bold text-[#1E4384] mb-2 group-hover:text-[#BE1E2D] transition-colors">
                  {st.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Machinery Fleet Table & Cards */}
      <section className="py-20 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionTitle
              kicker="DANH MỤC THIẾT BỊ"
              title="Hệ thống máy móc chủ lực tại nhà máy"
              subtitle="Nhấp vào hình ảnh để xem chi tiết thông số kỹ thuật và độ phân giải cao"
            />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            {MACHINES_LIST.map((m, idx) => (
              <motion.div
                key={m.id}
                className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#1E4384]/20 transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
              >
                <div
                  className="relative aspect-[16/9] bg-slate-900 cursor-pointer overflow-hidden"
                  onClick={() => {
                    setActiveIdx(idx);
                    setLightboxOpen(true);
                  }}
                >
                  <motion.img
                    src={m.image}
                    alt={m.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.4 }}
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <motion.div
                      className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white group-hover:bg-[#BE1E2D] transition-colors"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ZoomIn className="w-6 h-6" />
                    </motion.div>
                  </div>
                  <div className="absolute top-3 left-3 bg-[#1E4384]/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-sm">
                    {m.origin}
                  </div>
                </div>

                <div className="p-6">
                  <div className="text-xs font-bold text-[#BE1E2D] uppercase tracking-wider">
                    {currentLang === 'vi' ? m.categoryVi : m.categoryEn}
                  </div>
                  <h3 className="text-lg font-bold text-[#1E4384] mt-1 group-hover:text-[#BE1E2D] transition-colors">
                    {m.name}
                  </h3>
                  <div className="mt-2 text-xs font-mono font-semibold text-slate-500">
                    Model: {m.model} | Công suất: {m.capacityVi}
                  </div>

                  <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                    {currentLang === 'vi' ? m.purposeVi : m.purposeEn}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                    {(currentLang === 'vi' ? m.specsVi : m.specsEn).map((sp, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{sp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <motion.div
              className="inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="primary"
                size="lg"
                onClick={() => onOpenQuoteModal()}
                icon={<ArrowRight className="w-5 h-5" />}
                className="shadow-xl shadow-red-950/20"
              >
                Đặt lịch tham quan nhà máy thực tế
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        items={lightboxItems}
        currentIndex={activeIdx}
        onNavigate={setActiveIdx}
      />
    </div>
  );
};
