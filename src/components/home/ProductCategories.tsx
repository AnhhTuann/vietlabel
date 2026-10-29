import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../ui/Button';

export interface LabelSolutionItem {
  id: string;
  image: string;
  titleVi: string;
  titleEn: string;
  descVi: string;
  descEn: string;
  link: string;
}

export const SOLUTIONS_12_ITEMS: LabelSolutionItem[] = [
  {
    id: 'rfid',
    image: '/images/vietlabel/solutions/solution-rfid.webp',
    titleVi: 'TEM NHÃN THÔNG MINH RFID',
    titleEn: 'SMART RFID LABELS',
    descVi: 'Nhận diện, kiểm kê và theo dõi hàng hóa với chip RFID tùy chỉnh theo hệ thống.',
    descEn: 'Identify, inventory and track goods with custom system-tailored RFID chips.',
    link: '/san-pham/tem-nhan',
  },
  {
    id: 'heat-resistant',
    image: '/images/vietlabel/solutions/solution-heat-resistant.webp',
    titleVi: 'TEM NHÃN CHỊU NHIỆT ĐỘ CAO',
    titleEn: 'HIGH TEMPERATURE LABELS',
    descVi: 'Nhãn cho ngành thép, nhựa và công nghiệp; chọn vật liệu, keo theo điều kiện nhiệt.',
    descEn: 'Labels for steel, plastic & industrial use; heat-resistant material and adhesive.',
    link: '/san-pham/tem-nhan',
  },
  {
    id: 'food-beverage',
    image: '/images/vietlabel/solutions/solution-food-beverage.webp',
    titleVi: 'TEM NHÃN THỰC PHẨM VÀ ĐỒ UỐNG',
    titleEn: 'FOOD & BEVERAGE LABELS',
    descVi: 'Nhãn thực phẩm, đồ uống và đông lạnh; vật liệu phù hợp bao bì, bảo quản.',
    descEn: 'Labels for food, beverages & frozen products; suited for packaging & cold storage.',
    link: '/san-pham/tem-nhan',
  },
  {
    id: 'pharmaceutical',
    image: '/images/vietlabel/solutions/solution-pharmaceutical.webp',
    titleVi: 'TEM NHÃN DƯỢC PHẨM',
    titleEn: 'PHARMACEUTICAL LABELS',
    descVi: 'Nhãn thuốc và sản phẩm chăm sóc sức khỏe; thông tin số lô, hạn dùng rõ ràng.',
    descEn: 'Medicine & healthcare labels; crystal-clear batch numbers and expiry dates.',
    link: '/san-pham/tem-nhan',
  },
  {
    id: 'cosmetics',
    image: '/images/vietlabel/solutions/solution-cosmetics.webp',
    titleVi: 'TEM NHÃN HÓA MỸ PHẨM',
    titleEn: 'COSMETIC & CHEMICAL LABELS',
    descVi: 'Nhãn mỹ phẩm và sản phẩm gia dụng; hoàn thiện đồng bộ với thương hiệu.',
    descEn: 'Cosmetics & household products; premium finishing aligned with brand identity.',
    link: '/san-pham/tem-nhan',
  },
  {
    id: 'electronics',
    image: '/images/vietlabel/solutions/solution-electronics.webp',
    titleVi: 'TEM NHÃN ĐIỆN TỬ',
    titleEn: 'ELECTRONIC LABELS',
    descVi: 'Nhãn thông số và mã nhận diện linh kiện; in chính xác trên bề mặt nhỏ.',
    descEn: 'Technical specification and component ID labels; micro-precision printing on compact surfaces.',
    link: '/san-pham/tem-nhan',
  },
  {
    id: 'logistics',
    image: '/images/vietlabel/solutions/solution-logistics.webp',
    titleVi: 'TEM NHÃN LOGISTICS VÀ VẬN CHUYỂN',
    titleEn: 'LOGISTICS & SHIPPING LABELS',
    descVi: 'Nhãn vận đơn, mã kiện và cảnh báo; hỗ trợ phân loại, theo dõi hàng hóa.',
    descEn: 'Waybills, package barcodes & shipping warnings; supporting sorting and end-to-end tracking.',
    link: '/san-pham/tem-nhan',
  },
  {
    id: 'apparel',
    image: '/images/vietlabel/solutions/solution-apparel.webp',
    titleVi: 'TEM NHÃN NGÀNH MAY MẶC',
    titleEn: 'APPAREL & TEXTILE LABELS',
    descVi: 'Nhãn kích cỡ, thành phần và thẻ treo; đồng bộ nhận diện thương hiệu.',
    descEn: 'Size labels, fabric compositions and hangtags; cohesive brand identity presentation.',
    link: '/san-pham/tem-nhan',
  },
  {
    id: 'security',
    image: '/images/vietlabel/solutions/solution-security.webp',
    titleVi: 'TEM NHÃN CHỐNG GIẢ VÀ BẢO HÀNH',
    titleEn: 'ANTI-COUNTERFEIT & WARRANTY LABELS',
    descVi: 'Tem niêm phong, bảo hành và xác thực; giải pháp bảo vệ thương hiệu.',
    descEn: 'Tamper-evident seals, warranty labels and authentication; total brand protection.',
    link: '/san-pham/tem-nhan',
  },
  {
    id: 'eco',
    image: '/images/vietlabel/solutions/solution-eco.webp',
    titleVi: 'TEM NHÃN PHÂN HỦY SINH HỌC',
    titleEn: 'BIODEGRADABLE LABELS',
    descVi: 'Vật liệu phân hủy trong điều kiện xác định; chọn đồng bộ nền, keo và mực in.',
    descEn: 'Biodegradable materials under designated conditions; synchronized substrates, glue and inks.',
    link: '/san-pham/tem-nhan',
  },
  {
    id: 'agriculture',
    image: '/images/vietlabel/solutions/solution-seafood-agriculture.webp',
    titleVi: 'TEM NHÃN THỦY SẢN VÀ NÔNG NGHIỆP',
    titleEn: 'SEAFOOD & AGRICULTURE LABELS',
    descVi: 'Nhãn thủy sản, nông sản và vật tư; phù hợp độ ẩm, nhiệt độ bảo quản.',
    descEn: 'Labels for seafood, agricultural produce and farming supplies; moisture and freeze resistant.',
    link: '/san-pham/tem-nhan',
  },
  {
    id: 'industrial',
    image: '/images/vietlabel/solutions/solution-industrial.webp',
    titleVi: 'TEM NHÃN CÔNG NGHIỆP',
    titleEn: 'INDUSTRIAL LABELS',
    descVi: 'Nhãn cho dầu nhớt, hóa chất và máy móc; vật liệu chịu dung môi, bền bỉ.',
    descEn: 'Labels for lubricants, chemicals & machinery; solvent-resistant durable materials.',
    link: '/san-pham/tem-nhan',
  },
];

export const ProductCategories: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1E4384] tracking-tight [text-wrap:balance]">
            {t('products_section.title')}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500 leading-relaxed [text-wrap:balance]">
            {t('products_section.subtitle')}
          </p>
        </div>

        {/* Big White Container Frame */}
        <div className="rounded-[28px] bg-white border border-slate-200/90 shadow-[0_4px_24px_rgba(26,58,124,0.04)] p-6 sm:p-8 lg:p-10">
          {/* 3 cols x 4 rows = 12 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {SOLUTIONS_12_ITEMS.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Link
                  to={item.link}
                  className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-[#1e4384]/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left h-full"
                >
                  <div>
                    {/* Top Image Banner (Aspect 16/7 matching artwork) */}
                    <div className="w-full aspect-[16/7] rounded-xl overflow-hidden bg-slate-50 border border-slate-100 mb-4 relative">
                      <motion.img
                        src={item.image}
                        alt={currentLang === 'vi' ? item.titleVi : item.titleEn}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.4 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>

                    {/* Title with standardized height so descriptions align perfectly */}
                    <div className="min-h-[40px] flex items-start mb-2">
                      <h3 className="text-[13px] sm:text-[14px] font-bold text-[#1e4384] group-hover:text-[#be1e2d] uppercase tracking-wide leading-snug transition-colors line-clamp-2">
                        {currentLang === 'vi' ? item.titleVi : item.titleEn}
                      </h3>
                    </div>

                    {/* Description with standardized height */}
                    <div className="min-h-[42px]">
                      <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed line-clamp-2">
                        {currentLang === 'vi' ? item.descVi : item.descEn}
                      </p>
                    </div>
                  </div>

                  {/* Bottom link pinned to bottom */}
                  <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#1e4384] group-hover:text-[#be1e2d] transition-colors">
                    <span>{t('products_section.learn_more')}</span>
                    <motion.div
                      whileHover={{ x: 6 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-[#1e4384] group-hover:text-[#be1e2d]" />
                    </motion.div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* View all products button */}
        <div className="mt-10 text-center">
          <Link to="/san-pham">
            <Button
              variant="navy"
              size="lg"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {t('products_section.view_all')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
