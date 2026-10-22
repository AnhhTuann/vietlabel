import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Tag,
  ShoppingBag,
  Box,
  CreditCard,
  LayoutGrid,
  UtensilsCrossed,
  Wifi,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../ui/Button';

export interface LabelSolutionItem {
  id: string;
  iconName: string;
  image?: string;
  titleVi: string;
  titleEn: string;
  descVi: string;
  descEn: string;
  link: string;
}

export const SOLUTIONS_12_ITEMS: LabelSolutionItem[] = [
  {
    id: 'rfid',
    iconName: 'Wifi',
    titleVi: 'TEM NHÃN THÔNG MINH RFID',
    titleEn: 'SMART RFID LABELS',
    descVi: 'Nhận diện, kiểm kê và theo dõi hàng hóa với chip RFID tùy chỉnh theo hệ thống.',
    descEn: 'Identify, inventory and track goods with custom system-tailored RFID chips.',
    link: '/san-pham/tem-nhan',
  },
  {
    id: 'heat-resistant',
    iconName: 'Flame',
    titleVi: 'TEM NHÃN CHỊU NHIỆT ĐỘ CAO',
    titleEn: 'HIGH TEMPERATURE LABELS',
    descVi: 'Nhãn cho ngành thép, nhựa và công nghiệp; chọn vật liệu, keo theo điều kiện nhiệt.',
    descEn: 'Labels for steel, plastic & industrial use; heat-resistant material and adhesive.',
    link: '/san-pham/tem-nhan',
  },
  {
    id: 'food-beverage-1',
    iconName: 'Tag',
    titleVi: 'TEM NHÃN THỰC PHẨM VÀ ĐỒ UỐNG',
    titleEn: 'FOOD & BEVERAGE LABELS',
    descVi: 'Nhãn thực phẩm, đồ uống và đông lạnh; vật liệu phù hợp bao bì, bảo quản.',
    descEn: 'Labels for food, beverages & frozen products; suited for packaging & cold chain storage.',
    link: '/san-pham/tem-nhan',
  },
  {
    id: 'pharmaceutical',
    iconName: 'ShoppingBag',
    titleVi: 'TEM NHÃN DƯỢC PHẨM',
    titleEn: 'PHARMACEUTICAL LABELS',
    descVi: 'Nhãn thuốc và sản phẩm chăm sóc sức khỏe; thông tin số lô, hạn dùng rõ ràng.',
    descEn: 'Medicine & healthcare labels; crystal-clear batch numbers and expiry dates.',
    link: '/san-pham/tem-nhan',
  },
  {
    id: 'cosmetics',
    iconName: 'Box',
    titleVi: 'TEM NHÃN HÓA MỸ PHẨM',
    titleEn: 'COSMETIC & CHEMICAL LABELS',
    descVi: 'Nhãn mỹ phẩm và sản phẩm gia dụng; hoàn thiện đồng bộ với thương hiệu.',
    descEn: 'Cosmetics & household products; premium finishing aligned with brand identity.',
    link: '/san-pham/tem-nhan',
  },
  {
    id: 'electronics',
    iconName: 'CreditCard',
    titleVi: 'TEM NHÃN ĐIỆN TỬ',
    titleEn: 'ELECTRONIC LABELS',
    descVi: 'Nhãn thông số và mã nhận diện linh kiện; in chính xác trên bề mặt nhỏ.',
    descEn: 'Technical specification and component ID labels; micro-precision printing on compact surfaces.',
    link: '/san-pham/tem-nhan',
  },
  {
    id: 'logistics',
    iconName: 'LayoutGrid',
    titleVi: 'TEM NHÃN LOGISTICS VÀ VẬN CHUYỂN',
    titleEn: 'LOGISTICS & SHIPPING LABELS',
    descVi: 'Nhãn vận đơn, mã kiện và cảnh báo; hỗ trợ phân loại, theo dõi hàng hóa.',
    descEn: 'Waybills, package barcodes & shipping warnings; supporting sorting and end-to-end tracking.',
    link: '/san-pham/tem-nhan',
  },
  {
    id: 'apparel',
    iconName: 'UtensilsCrossed',
    titleVi: 'TEM NHÃN NGÀNH MAY MẶC',
    titleEn: 'APPAREL & TEXTILE LABELS',
    descVi: 'Nhãn kích cỡ, thành phần và thẻ treo; đồng bộ nhận diện thương hiệu.',
    descEn: 'Size labels, fabric compositions and hangtags; cohesive brand identity presentation.',
    link: '/san-pham/tem-nhan',
  },
  {
    id: 'security',
    iconName: 'Box',
    titleVi: 'TEM NHÃN CHỐNG GIẢ VÀ BẢO HÀNH',
    titleEn: 'ANTI-COUNTERFEIT & WARRANTY LABELS',
    descVi: 'Tem niêm phong, bảo hành và xác thực; giải pháp bảo vệ thương hiệu.',
    descEn: 'Tamper-evident seals, warranty labels and authentication; total brand protection.',
    link: '/san-pham/tem-nhan',
  },
  {
    id: 'eco',
    iconName: 'CreditCard',
    titleVi: 'TEM NHÃN PHÂN HỦY SINH HỌC',
    titleEn: 'BIODEGRADABLE LABELS',
    descVi: 'Vật liệu phân hủy trong điều kiện xác định; chọn đồng bộ nền, keo và mực in.',
    descEn: 'Biodegradable materials under designated conditions; synchronized substrates, glue and inks.',
    link: '/san-pham/tem-nhan',
  },
  {
    id: 'agriculture',
    iconName: 'LayoutGrid',
    titleVi: 'TEM NHÃN THỦY SẢN VÀ NÔNG NGHIỆP',
    titleEn: 'SEAFOOD & AGRICULTURE LABELS',
    descVi: 'Nhãn thủy sản, nông sản và vật tư; phù hợp độ ẩm, nhiệt độ bảo quản.',
    descEn: 'Labels for seafood, agricultural produce and farming supplies; moisture and freeze resistant.',
    link: '/san-pham/tem-nhan',
  },
  {
    id: 'food-beverage-2',
    iconName: 'UtensilsCrossed',
    titleVi: 'TEM NHÃN THỰC PHẨM VÀ ĐỒ UỐNG',
    titleEn: 'FOOD & BEVERAGE LABELS',
    descVi: 'Nhãn thực phẩm, đồ uống và đông lạnh; hiển thị rõ thông tin thương hiệu.',
    descEn: 'Labels for food, beverages & frozen products; prominently showcasing brand information.',
    link: '/san-pham/tem-nhan',
  },
];

// Map icon name to Lucide component
const ICONS_MAP: Record<string, React.ReactNode> = {
  Wifi: <Wifi className="w-5 h-5 text-[#1E4384]" />,
  Flame: <Flame className="w-5 h-5 text-[#1E4384]" />,
  Tag: <Tag className="w-5 h-5 text-[#1E4384]" />,
  ShoppingBag: <ShoppingBag className="w-5 h-5 text-[#1E4384]" />,
  Box: <Box className="w-5 h-5 text-[#1E4384]" />,
  CreditCard: <CreditCard className="w-5 h-5 text-[#1E4384]" />,
  LayoutGrid: <LayoutGrid className="w-5 h-5 text-[#1E4384]" />,
  UtensilsCrossed: <UtensilsCrossed className="w-5 h-5 text-[#1E4384]" />,
};

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

        {/* Big White Container Frame matching screenshot */}
        <div className="rounded-[28px] bg-white border border-slate-200/90 shadow-sm p-6 sm:p-8 lg:p-10">
          {/* 3 cols x 4 rows = 12 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {SOLUTIONS_12_ITEMS.map((item) => (
              <Link
                key={item.id}
                to={item.link}
                className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 text-left h-full min-h-[220px]"
              >
                <div>
                  {/* Top Image or Icon Container */}
                  {item.image ? (
                    <div className="w-full h-28 mb-4 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={currentLang === 'vi' ? item.titleVi : item.titleEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="h-8 flex items-center mb-4 text-[#1E4384] group-hover:scale-110 transition-transform origin-left">
                      {ICONS_MAP[item.iconName] || <Tag className="w-6 h-6 stroke-[1.8]" />}
                    </div>
                  )}

                  {/* Title with standardized height so descriptions align perfectly */}
                  <div className="min-h-[42px] flex items-start mb-2">
                    <h3 className="text-[13px] sm:text-[14px] font-bold text-[#1E4384] group-hover:text-[#BE1E2D] uppercase tracking-wide leading-snug transition-colors line-clamp-2">
                      {currentLang === 'vi' ? item.titleVi : item.titleEn}
                    </h3>
                  </div>

                  {/* Description with standardized height */}
                  <div className="min-h-[44px]">
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {currentLang === 'vi' ? item.descVi : item.descEn}
                    </p>
                  </div>
                </div>

                {/* Bottom link pinned to bottom */}
                <div className="mt-6 pt-2 flex items-center justify-between text-xs font-semibold text-slate-600 group-hover:text-[#1E4384] transition-colors">
                  <span>{t('products_section.learn_more')}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#1E4384] transform group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
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
