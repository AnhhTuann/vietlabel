import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'motion/react';
import { Leaf, Award, Recycle, Sun, TreePine, Droplets, ArrowRight } from 'lucide-react';
import { SEO } from '../lib/seo';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Button } from '../components/ui/Button';

export const SustainabilityPage: React.FC = () => {
  const { onOpenQuoteModal } = useOutletContext<{ onOpenQuoteModal: (prod?: string) => void }>();

  return (
    <div className="pt-24 pb-20">
      <SEO
        title="Phát Triển Bền Vững & Cam Kết Môi Trường | Vietlabel"
        description="Chiến lược chuyển đổi xanh trong sản xuất bao bì & tem nhãn: chứng nhận FSC CoC, mực in gốc thực vật an toàn và quy trình tuần hoàn không rác thải."
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#081b35] text-white py-20 text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_78%_35%,rgba(16,185,129,0.25),transparent_42%),linear-gradient(120deg,#081b35_0%,#0c323f_56%,#104052_100%)]" />

        {/* Animated background rings */}
        <motion.div
          className="absolute -right-24 top-0 -z-10 h-96 w-96 rounded-full border border-emerald-400/15"
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute -left-20 bottom-0 -z-10 h-80 w-80 rounded-full border border-emerald-400/10"
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-emerald-400/30"
            style={{
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
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
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 px-3 py-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 inline-flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              ESG & PHÁT TRIỂN BỀN VỮNG
            </span>
          </motion.div>

          <motion.h1
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight [text-wrap:balance]"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            Cam kết vì một nền kinh tế tuần hoàn xanh
            <motion.span
              className="mt-3 block h-1.5 w-24 mx-auto rounded-full bg-emerald-500"
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
            Tại Vietlabel, chúng tôi tin rằng bao bì không chỉ bảo vệ sản phẩm mà còn phải bảo vệ hành tinh xanh. Chúng tôi tiên phong ứng dụng vật liệu sinh học phân hủy tự nhiên và năng lượng sạch vào sản xuất.
          </motion.p>
        </div>
      </section>

      {/* Green Metrics */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              {
                icon: TreePine,
                value: '100%',
                label: 'Giấy có nguồn gốc FSC',
                desc: 'Truy xuất nguồn gốc rừng trồng hợp pháp',
              },
              {
                icon: Recycle,
                value: '99.2%',
                label: 'Rác thải giấy được thu hồi',
                desc: 'Tuần hoàn tái sinh thành bột giấy',
              },
              {
                icon: Droplets,
                value: '85%',
                label: 'Sử dụng mực in sinh học',
                desc: 'Mực gốc nước & dầu đậu nành an toàn',
              },
              {
                icon: Sun,
                value: '500 kWp',
                label: 'Điện mặt trời áp mái',
                desc: 'Giảm 650 tấn CO2 phát thải mỗi năm',
              },
            ].map((metric, i) => (
              <motion.div
                key={i}
                className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100/80 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
              >
                <motion.div
                  className="w-12 h-12 rounded-xl bg-white text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-xs group-hover:bg-emerald-600 group-hover:text-white transition-colors"
                  whileHover={{ rotate: 12, scale: 1.15 }}
                  transition={{ duration: 0.3 }}
                >
                  <metric.icon className="w-6 h-6" />
                </motion.div>
                <div className="text-3xl font-extrabold text-[#1E4384] group-hover:text-emerald-700 transition-colors">
                  {metric.value}
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">{metric.label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{metric.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Alternating Left-Right Sections */}
      <section className="py-20 bg-[#FAFAFC] space-y-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {/* Row 1: Image Left / Text Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div
              className="lg:col-span-6 rounded-3xl overflow-hidden aspect-[4/3] shadow-xl border border-slate-200 group"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <motion.img
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop"
                alt="FSC Forest Protection"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.4 }}
              />
            </motion.div>
            <motion.div
              className="lg:col-span-6 space-y-4"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100 inline-block">
                CHỨNG CHỈ QUỐC TẾ FSC® COC
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E4384] tracking-tight leading-snug">
                Bảo vệ tài nguyên rừng trồng có trách nhiệm
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Chứng chỉ FSC® Chain of Custody (SGSCH-COC-0921) là minh chứng cho việc toàn bộ sản phẩm bao bì giấy của Vietlabel đều có thể truy xuất nguồn gốc chuỗi cung ứng rõ ràng. Chúng tôi không bao giờ thu mua hoặc sử dụng nguyên liệu từ rừng nguyên sinh hoặc vùng khai thác trái phép.
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 pt-2">
                <motion.li
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: 15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <Leaf className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Đáp ứng quy định chống phá rừng EUDR mới nhất của châu Âu</span>
                </motion.li>
                <motion.li
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: 15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <Leaf className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>In logo FSC chính thức trực tiếp lên bao bì xuất khẩu của khách hàng</span>
                </motion.li>
              </ul>
            </motion.div>
          </div>

          {/* Row 2: Text Left / Image Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div
              className="lg:col-span-6 order-2 lg:order-1 space-y-4"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100 inline-block">
                THAY THẾ NHỰA DÙNG MỘT LẦN
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E4384] tracking-tight leading-snug">
                Màng tráng phủ sinh học và keo dán phân hủy
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Thay vì sử dụng màng nhựa PE và BOPP khó phân hủy truyền thống, Vietlabel đã ứng dụng công nghệ tráng phủ phân tán gốc nước (Water-based dispersion barrier). Giúp bao bì có khả năng chống thấm nước, kháng dầu mỡ nhưng vẫn phân hủy hoàn toàn trong đất sau 90 đến 180 ngày.
              </p>
              <div className="pt-4">
                <motion.div
                  className="inline-block"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => onOpenQuoteModal()}
                    icon={<ArrowRight className="w-4 h-4" />}
                    className="shadow-lg shadow-emerald-950/20"
                  >
                    Nhận tư vấn giải pháp bao bì xanh
                  </Button>
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              className="lg:col-span-6 order-1 lg:order-2 rounded-3xl overflow-hidden aspect-[4/3] shadow-xl border border-slate-200 group"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <motion.img
                src="https://images.unsplash.com/photo-1574634534894-89d7576c8259?q=80&w=1000&auto=format&fit=crop"
                alt="Biodegradable Kraft Packaging"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.4 }}
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};
