import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Package,
  ShoppingBag,
  UtensilsCrossed,
  Tag,
  Layers,
  Box,
  CreditCard,
  LayoutGrid,
  ArrowRight,
} from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../../data/products';
import { SectionTitle } from '../ui/SectionTitle';
import { Button } from '../ui/Button';

// Map icon name to Lucide component
const ICONS_MAP: Record<string, React.ReactNode> = {
  Package: <Package className="w-8 h-8" />,
  ShoppingBag: <ShoppingBag className="w-8 h-8" />,
  UtensilsCrossed: <UtensilsCrossed className="w-8 h-8" />,
  Tag: <Tag className="w-8 h-8" />,
  Layers: <Layers className="w-8 h-8" />,
  Box: <Box className="w-8 h-8" />,
  CreditCard: <CreditCard className="w-8 h-8" />,
  LayoutGrid: <LayoutGrid className="w-8 h-8" />,
};

export const ProductCategories: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  return (
    <section className="py-24 bg-[#FAFAFC] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          kicker={t('products_section.badge')}
          title={t('products_section.title')}
          subtitle={t('products_section.subtitle')}
        />

        {/* 4 cols x 2 rows = 8 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCT_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/san-pham/${cat.slug}`}
              className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8531D]"
            >
              <div>
                {/* Large Icon Container */}
                <div className="w-14 h-14 rounded-xl bg-slate-50 text-[#0B2A4A] group-hover:bg-[#E8531D] group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs mb-5">
                  {ICONS_MAP[cat.iconName] || <Package className="w-8 h-8" />}
                </div>

                {/* Category Title */}
                <h3 className="text-lg font-bold text-[#0B2A4A] group-hover:text-[#E8531D] transition-colors line-clamp-1">
                  {currentLang === 'vi' ? cat.nameVi : cat.nameEn}
                </h3>

                {/* 2-3 line description */}
                <p className="mt-2.5 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {currentLang === 'vi' ? cat.shortDescVi : cat.shortDescEn}
                </p>
              </div>

              {/* Action affordance line */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0B2A4A] group-hover:text-[#E8531D] transition-colors">
                <span>{t('products_section.learn_more')}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* View all products button */}
        <div className="mt-14 text-center">
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
