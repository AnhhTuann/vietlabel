import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import {
  Layers,
  Cpu,
  ShieldCheck,
  Truck,
  CheckCircle2,
  FileSpreadsheet,
  ArrowRight,
  Factory,
} from 'lucide-react';
import { SEO } from '../lib/seo';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Button } from '../components/ui/Button';
import { LABEL_SOLUTIONS } from '../data/labelSolutions';

export const CapabilitiesPage: React.FC = () => {
  const { onOpenQuoteModal } = useOutletContext<{ onOpenQuoteModal: (prod?: string) => void }>();

  const pillars = [
    {
      icon: <Layers className="w-6 h-6 text-[#BE1E2D]" />,
      title: '1. Chế bản & Dựng mẫu CAD 3D',
      desc: 'Hệ thống phần mềm ArtiosCAD bản quyền kết hợp bàn cắt mẫu kỹ thuật số Kongsberg (Na Uy). Cho phép tạo mẫu thực tế trong 24 giờ để khách hàng thử nghiệm độ khít trước khi ra khuôn.',
      stats: 'Mẫu thử chuẩn xác ±0.1mm',
    },
    {
      icon: <Cpu className="w-6 h-6 text-[#BE1E2D]" />,
      title: '2. Năng lực In Offset & Flexo Đỉnh Cao',
      desc: 'Sở hữu dàn máy in Heidelberg Speedmaster XL 106 6 màu sấy UV (Đức) và máy in Flexo cuộn tự động. Tốc độ đạt 18.000 tờ/giờ, đáp ứng các đơn hàng triệu bản trong thời gian ngắn nhất.',
      stats: '18.000 tờ/giờ công suất đỉnh',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#BE1E2D]" />,
      title: '3. Dây chuyền Gia công Tự động Khép kín',
      desc: 'Máy bế tự động Bobst Novacut, máy dán hộp Bobst Expertfold tốc độ 45.000 hộp/giờ, máy ép kim Masterwork MK 1060ST, máy bồi carton sóng bán tự động Meiguang 1650.',
      stats: 'Tự động hóa 85% khâu hoàn thiện',
    },
    {
      icon: <Truck className="w-6 h-6 text-[#BE1E2D]" />,
      title: '4. Quản lý Chất lượng KCS & Kho bãi Logistics',
      desc: 'Phòng thí nghiệm đo độ bục (Bursting Test), độ nén cạnh (ECT), độ ẩm giấy và quang phổ màu X-Rite. Đội xe tải chuyên dụng giao hàng tận kho khách hàng đúng hẹn 99.8%.',
      stats: 'Kho lưu trữ 5.000 pallet tiêu chuẩn',
    },
  ];

  return (
    <div className="pt-24 pb-20">
      <SEO
        title="Hồ Sơ Năng Lực Doanh Nghiệp | Vietlabel"
        description="Năng lực nhà máy sản xuất tem nhãn decal & bao bì hiện đại, dàn máy in Offset & Flexo tốc độ cao, hệ thống quản lý chất lượng 5S và G7 Master của Vietlabel."
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#081b35] text-white py-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_78%_35%,rgba(63,112,190,0.3),transparent_38%),linear-gradient(120deg,#081b35_0%,#102e58_56%,#1e4384_100%)]" />

        {/* Animated background elements */}
        <motion.div
          className="absolute -right-24 top-0 -z-10 h-96 w-96 rounded-full border border-white/10"
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute -right-8 top-12 -z-10 h-72 w-72 rounded-full border border-white/10"
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white/20"
            style={{
              left: `${12 + i * 15}%`,
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 inline-block">
              NĂNG LỰC SẢN XUẤT CÔNG NGHIỆP
            </span>
          </motion.div>

          <motion.h1
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight [text-wrap:balance]"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            Hạ tầng quy mô lớn – Đáp ứng mọi tiêu chuẩn khắt khe
            <motion.span
              className="mt-3 block h-1.5 w-24 mx-auto rounded-full bg-[#e44b59]"
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
          </motion.h1>

          <motion.p
            className="mt-5 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Nhà máy hiện đại 15,000m² tại KCN Tân Bình Mở Rộng, đầu tư đồng bộ thiết bị công nghệ cao từ Đức và Thụy Sĩ, sẵn sàng phục vụ các tập đoàn FDI và chuỗi bán lẻ quốc tế.
          </motion.p>

          <motion.div
            className="mt-8 flex justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="primary"
                size="md"
                onClick={() => onOpenQuoteModal()}
                icon={<ArrowRight className="w-4 h-4" />}
                className="shadow-lg shadow-red-950/30"
              >
                Liên hệ hợp tác sản xuất
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 4 Pillars Grid */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionTitle
              kicker="TRỤ CỘT NĂNG LỰC"
              title="Quy trình công nghệ sản xuất đồng bộ"
              subtitle="Tối ưu từng khâu chế tạo từ file thiết kế đồ họa đến thành phẩm bao bì sẵn sàng lên kệ"
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            {pillars.map((p, i) => (
              <motion.div
                key={i}
                className="p-8 rounded-2xl bg-[#FAFAFC] border border-slate-200 hover:shadow-xl hover:border-[#1E4384]/30 transition-all duration-300 flex flex-col justify-between group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
              >
                <div>
                  <motion.div
                    className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center mb-5 group-hover:bg-[#BE1E2D] group-hover:text-white transition-colors duration-300"
                    whileHover={{ rotate: 12, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="group-hover:brightness-0 group-hover:invert transition-all">
                      {p.icon}
                    </span>
                  </motion.div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#1E4384] mb-3 group-hover:text-[#BE1E2D] transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">{p.desc}</p>
                </div>
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-[#BE1E2D]">
                  <span>{p.stats}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capacity Metrics Table */}
      <section className="py-20 bg-[#F5F7FA]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionTitle
              kicker="CHỈ SỐ ĐO LƯỜNG"
              title="Năng lực cung ứng theo ca sản xuất"
              subtitle="Dữ liệu kiểm toán năng suất thực tế tại phân xưởng 1 và phân xưởng 2"
            />
          </motion.div>

          <motion.div
            className="rounded-2xl bg-white border border-slate-200 shadow-md overflow-hidden mt-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#1E4384] text-white">
                <tr>
                  <th className="p-4 font-semibold">Chủng loại bao bì</th>
                  <th className="p-4 font-semibold">Năng suất / Ca (8h)</th>
                  <th className="p-4 font-semibold">Công suất / Tháng</th>
                  <th className="p-4 font-semibold">Thời gian giao hàng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
                <tr className="hover:bg-blue-50/50 transition-colors">
                  <td className="p-4 font-bold text-slate-900">Hộp cứng quà tặng & hộp yến sào</td>
                  <td className="p-4">15.000 hộp</td>
                  <td className="p-4">350.000 hộp</td>
                  <td className="p-4">7 - 10 ngày</td>
                </tr>
                <tr className="hover:bg-blue-50/50 transition-colors">
                  <td className="p-4 font-bold text-slate-900">Hộp mềm mỹ phẩm & dược phẩm</td>
                  <td className="p-4">120.000 hộp</td>
                  <td className="p-4">3.000.000 hộp</td>
                  <td className="p-4">5 - 7 ngày</td>
                </tr>
                <tr className="hover:bg-blue-50/50 transition-colors">
                  <td className="p-4 font-bold text-slate-900">Túi giấy Kraft & túi mua sắm</td>
                  <td className="p-4">80.000 túi</td>
                  <td className="p-4">2.000.000 túi</td>
                  <td className="p-4">5 - 7 ngày</td>
                </tr>
                <tr className="hover:bg-blue-50/50 transition-colors">
                  <td className="p-4 font-bold text-slate-900">Thùng carton sóng 3-5-7 lớp</td>
                  <td className="p-4">40.000 thùng</td>
                  <td className="p-4">1.000.000 thùng</td>
                  <td className="p-4">4 - 6 ngày</td>
                </tr>
                <tr className="hover:bg-blue-50/50 transition-colors">
                  <td className="p-4 font-bold text-slate-900">Tem nhãn cuộn tự động Flexo</td>
                  <td className="p-4">500.000 tem</td>
                  <td className="p-4">12.000.000 tem</td>
                  <td className="p-4">3 - 5 ngày</td>
                </tr>
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* 12 Label Solutions Grid */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionTitle
              kicker="NGÀNH HÀNG PHỤC VỤ"
              title="Giải pháp Tem nhãn cho 12+ Ngành Công Nghiệp"
              subtitle="Chúng tôi làm chủ công nghệ sản xuất đa dạng, đáp ứng mọi yêu cầu khắt khe nhất của từng ngành hàng chuyên biệt."
            />
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-12">
            {LABEL_SOLUTIONS.map((sol, index) => (
              <motion.div
                key={sol.id}
                className="bg-[#FAFAFC] p-6 rounded-2xl border border-slate-200 hover:shadow-xl hover:border-[#BE1E2D]/50 transition-all duration-300 flex flex-col items-center text-center group cursor-pointer"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: (index % 4) * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="w-14 h-14 rounded-full bg-slate-100 text-[#1E4384] group-hover:bg-[#BE1E2D] group-hover:text-white transition-colors flex items-center justify-center mb-4 shadow-sm"
                  whileHover={{ rotate: 12, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <sol.icon className="w-6 h-6" />
                </motion.div>
                <h4 className="font-bold text-slate-800 text-[13px] uppercase mb-2 line-clamp-2 group-hover:text-[#BE1E2D] transition-colors">
                  {sol.titleVi}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed">
                  {sol.descVi}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#102d58] text-white text-center relative overflow-hidden">
        <motion.div
          className="absolute -right-20 -bottom-20 h-80 w-80 rounded-full border border-white/10"
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute -left-20 -top-20 h-80 w-80 rounded-full border border-white/10"
          animate={{ rotate: -360 }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <FileSpreadsheet className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">Tải hồ sơ năng lực đầy đủ</h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-8 max-w-xl mx-auto">
              Tài liệu chi tiết về nhà máy, thiết bị, tiêu chuẩn chất lượng và danh mục sản phẩm dành cho đội mua hàng và đơn vị kiểm toán nhà cung cấp.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => onOpenQuoteModal()}
                  icon={<ArrowRight className="w-4 h-4" />}
                  className="shadow-lg shadow-blue-950/40"
                >
                  Yêu cầu báo giá ngay
                </Button>
              </motion.div>
              <motion.a
                href="/company-profile.pdf"
                download
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/30 text-white hover:bg-white/10 transition-colors text-sm font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Factory className="w-4 h-4" />
                Tải Company Profile (PDF)
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
