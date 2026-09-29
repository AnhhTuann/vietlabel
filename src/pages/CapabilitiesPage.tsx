import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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

export const CapabilitiesPage: React.FC = () => {
  const { onOpenQuoteModal } = useOutletContext<{ onOpenQuoteModal: (prod?: string) => void }>();

  const pillars = [
    {
      icon: <Layers className="w-6 h-6 text-[#E8531D]" />,
      title: '1. Chế bản & Dựng mẫu CAD 3D',
      desc: 'Hệ thống phần mềm ArtiosCAD bản quyền kết hợp bàn cắt mẫu kỹ thuật số Kongsberg (Na Uy). Cho phép tạo mẫu thực tế trong 24 giờ để khách hàng thử nghiệm độ khít trước khi ra khuôn.',
      stats: 'Mẫu thử chuẩn xác ±0.1mm',
    },
    {
      icon: <Cpu className="w-6 h-6 text-[#E8531D]" />,
      title: '2. Năng lực In Offset & Flexo Đỉnh Cao',
      desc: 'Sở hữu dàn máy in Heidelberg Speedmaster XL 106 6 màu sấy UV (Đức) và máy in Flexo cuộn tự động. Tốc độ đạt 18.000 tờ/giờ, đáp ứng các đơn hàng triệu bản trong thời gian ngắn nhất.',
      stats: '18.000 tờ/giờ công suất đỉnh',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#E8531D]" />,
      title: '3. Dây chuyền Gia công Tự động Khép kín',
      desc: 'Máy bế tự động Bobst Novacut, máy dán hộp Bobst Expertfold tốc độ 45.000 hộp/giờ, máy ép kim Masterwork MK 1060ST, máy bồi carton sóng bán tự động Meiguang 1650.',
      stats: 'Tự động hóa 85% khâu hoàn thiện',
    },
    {
      icon: <Truck className="w-6 h-6 text-[#E8531D]" />,
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
      <section className="bg-[#0B2A4A] text-white py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 inline-block">
            NĂNG LỰC SẢN XUẤT CÔNG NGHIỆP
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight [text-wrap:balance]">
            Hạ tầng quy mô lớn – Đáp ứng mọi tiêu chuẩn khắt khe
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Nhà máy hiện đại 15,000m² tại KCN Tân Bình Mở Rộng, đầu tư đồng bộ thiết bị công nghệ cao từ Đức và Thụy Sĩ, sẵn sàng phục vụ các tập đoàn FDI và chuỗi bán lẻ quốc tế.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Button
              variant="primary"
              size="md"
              onClick={() => onOpenQuoteModal()}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Liên hệ hợp tác sản xuất
            </Button>
          </div>
        </div>
      </section>

      {/* 4 Pillars Grid */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            kicker="TRỤ CỘT NĂNG LỰC"
            title="Quy trình công nghệ sản xuất đồng bộ"
            subtitle="Tối ưu từng khâu chế tạo từ file thiết kế đồ họa đến thành phẩm bao bì sẵn sàng lên kệ"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pillars.map((p, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-[#FAFAFC] border border-slate-200 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-5">
                    {p.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#0B2A4A] mb-3">{p.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">{p.desc}</p>
                </div>
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-[#E8531D]">
                  <span>{p.stats}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capacity Metrics Table */}
      <section className="py-20 bg-[#F5F7FA]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            kicker="CHỈ SỐ ĐO LƯỜNG"
            title="Năng lực cung ứng theo ca sản xuất"
            subtitle="Dữ liệu kiểm toán năng suất thực tế tại phân xưởng 1 và phân xưởng 2"
          />

          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#0B2A4A] text-white">
                <tr>
                  <th className="p-4 font-semibold">Chủng loại bao bì</th>
                  <th className="p-4 font-semibold">Năng suất / Ca (8h)</th>
                  <th className="p-4 font-semibold">Công suất / Tháng</th>
                  <th className="p-4 font-semibold">Thời gian giao hàng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">Hộp cứng quà tặng & hộp yến sào</td>
                  <td className="p-4">15.000 hộp</td>
                  <td className="p-4">350.000 hộp</td>
                  <td className="p-4">7 - 10 ngày</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">Hộp mềm mỹ phẩm & dược phẩm</td>
                  <td className="p-4">120.000 hộp</td>
                  <td className="p-4">3.000.000 hộp</td>
                  <td className="p-4">5 - 7 ngày</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">Túi giấy Kraft & túi mua sắm</td>
                  <td className="p-4">80.000 túi</td>
                  <td className="p-4">2.000.000 túi</td>
                  <td className="p-4">5 - 7 ngày</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">Thùng carton sóng 3-5-7 lớp</td>
                  <td className="p-4">40.000 thùng</td>
                  <td className="p-4">1.000.000 thùng</td>
                  <td className="p-4">4 - 6 ngày</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">Tem nhãn cuộn tự động Flexo</td>
                  <td className="p-4">500.000 tem</td>
                  <td className="p-4">12.000.000 tem</td>
                  <td className="p-4">3 - 5 ngày</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
