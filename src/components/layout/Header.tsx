import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Menu,
  X,
  ChevronDown,
  Globe,
  Phone,
  FileText,
  Package,
  Layers,
  Award,
  Users,
  Building,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import { PRODUCT_CATEGORIES } from '../../data/products';
import { cn } from '../../lib/utils';

interface HeaderProps {
  onOpenQuoteModal: (product?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQuoteModal }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { scrolledPast } = useScrollDirection();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const isHome = location.pathname === '/';

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'vi' ? 'en' : 'vi';
    i18n.changeLanguage(nextLang);
  };

  const currentLang = i18n.language;

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          scrolledPast || !isHome
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3.5'
            : 'bg-transparent py-5 text-white'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Zone 1: Brand Logo with official Vietlabel asset */}
          <Link
            to="/"
            className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8531D] rounded-lg"
          >
            <div className={cn(
              "px-2.5 py-1 rounded-xl transition-all flex items-center",
              scrolledPast || !isHome ? "bg-slate-50 border border-slate-200/60" : "bg-white/95 shadow-md backdrop-blur-sm border border-white/20"
            )}>
              <img
                src="/images/vietlabel/logo.webp"
                alt="Vietlabel - Công ty Cổ phần Sản xuất Thương mại Vietlabel"
                className="h-8 sm:h-9 w-auto object-contain max-w-[150px] sm:max-w-[170px]"
                onError={(e) => {
                  // Fallback to icon
                  e.currentTarget.src = "/images/vietlabel/logo-icon.png";
                }}
              />
            </div>
          </Link>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              to="/"
              className={cn(
                'px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap',
                location.pathname === '/'
                  ? 'text-[#E8531D] font-semibold'
                  : scrolledPast || !isHome
                  ? 'text-slate-700 hover:text-[#0B2A4A] hover:bg-slate-50'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              )}
            >
              {t('nav.home')}
            </Link>

            {/* About dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('about')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                className={cn(
                  'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap',
                  location.pathname.startsWith('/gioi-thieu')
                    ? 'text-[#E8531D] font-semibold'
                    : scrolledPast || !isHome
                    ? 'text-slate-700 hover:text-[#0B2A4A] hover:bg-slate-50'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                )}
              >
                <span>{t('nav.about')}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {openDropdown === 'about' && (
                <div className="absolute top-full left-0 w-64 pt-2 shadow-xl animate-in fade-in-50 duration-150">
                  <div className="bg-white rounded-xl shadow-lg border border-slate-200 py-2 text-slate-800">
                    <Link
                      to="/gioi-thieu"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50 hover:text-[#0B2A4A] transition-colors"
                      onClick={() => setOpenDropdown(null)}
                    >
                      <Building className="w-4 h-4 text-[#E8531D]" />
                      <span>{t('nav.about_overview')}</span>
                    </Link>
                    <Link
                      to="/gioi-thieu#doi-ngu"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50 hover:text-[#0B2A4A] transition-colors"
                      onClick={() => setOpenDropdown(null)}
                    >
                      <Users className="w-4 h-4 text-[#E8531D]" />
                      <span>{t('nav.about_team')}</span>
                    </Link>
                    <Link
                      to="/gioi-thieu#chung-nhan"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50 hover:text-[#0B2A4A] transition-colors"
                      onClick={() => setOpenDropdown(null)}
                    >
                      <Award className="w-4 h-4 text-[#E8531D]" />
                      <span>{t('nav.about_certifications')}</span>
                    </Link>
                    <Link
                      to="/gioi-thieu#ho-so-nang-luc"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50 hover:text-[#0B2A4A] transition-colors"
                      onClick={() => setOpenDropdown(null)}
                    >
                      <FileText className="w-4 h-4 text-[#E8531D]" />
                      <span>{t('nav.about_profile')}</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Products Mega Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('products')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                to="/san-pham"
                className={cn(
                  'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap',
                  location.pathname.startsWith('/san-pham')
                    ? 'text-[#E8531D] font-semibold'
                    : scrolledPast || !isHome
                    ? 'text-slate-700 hover:text-[#0B2A4A] hover:bg-slate-50'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                )}
              >
                <span>{t('nav.products')}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </Link>

              {openDropdown === 'products' && (
                <div className="absolute top-full -left-20 w-[680px] pt-2 shadow-2xl animate-in fade-in-50 duration-150">
                  <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 text-slate-800">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-[#E8531D]" />
                        <h4 className="font-bold text-[#0B2A4A] text-sm uppercase tracking-wide">
                          Danh mục bao bì công nghiệp B2B
                        </h4>
                      </div>
                      <Link
                        to="/san-pham"
                        className="text-xs text-[#E8531D] hover:underline font-semibold flex items-center gap-1"
                        onClick={() => setOpenDropdown(null)}
                      >
                        Tất cả sản phẩm <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {PRODUCT_CATEGORIES.map((cat) => (
                        <Link
                          key={cat.id}
                          to={`/san-pham/${cat.slug}`}
                          className="group p-3 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <div className="font-semibold text-xs text-[#0B2A4A] group-hover:text-[#E8531D] transition-colors flex items-center justify-between">
                            <span>{currentLang === 'vi' ? cat.nameVi : cat.nameEn}</span>
                            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 leading-normal">
                            {currentLang === 'vi' ? cat.shortDescVi : cat.shortDescEn}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/nang-luc"
              className={cn(
                'px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap',
                location.pathname === '/nang-luc'
                  ? 'text-[#E8531D] font-semibold'
                  : scrolledPast || !isHome
                  ? 'text-slate-700 hover:text-[#0B2A4A] hover:bg-slate-50'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              )}
            >
              {t('nav.capabilities')}
            </Link>

            <Link
              to="/phat-trien-ben-vung"
              className={cn(
                'px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap',
                location.pathname === '/phat-trien-ben-vung'
                  ? 'text-[#E8531D] font-semibold'
                  : scrolledPast || !isHome
                  ? 'text-slate-700 hover:text-[#0B2A4A] hover:bg-slate-50'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              )}
            >
              {t('nav.sustainability')}
            </Link>

            <Link
              to="/cong-nghe"
              className={cn(
                'px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap',
                location.pathname === '/cong-nghe'
                  ? 'text-[#E8531D] font-semibold'
                  : scrolledPast || !isHome
                  ? 'text-slate-700 hover:text-[#0B2A4A] hover:bg-slate-50'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              )}
            >
              {t('nav.technology')}
            </Link>

            <Link
              to="/tin-tuc"
              className={cn(
                'px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap',
                location.pathname.startsWith('/tin-tuc')
                  ? 'text-[#E8531D] font-semibold'
                  : scrolledPast || !isHome
                  ? 'text-slate-700 hover:text-[#0B2A4A] hover:bg-slate-50'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              )}
            >
              {t('nav.news')}
            </Link>

            <Link
              to="/tuyen-dung"
              className={cn(
                'px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap',
                location.pathname === '/tuyen-dung'
                  ? 'text-[#E8531D] font-semibold'
                  : scrolledPast || !isHome
                  ? 'text-slate-700 hover:text-[#0B2A4A] hover:bg-slate-50'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              )}
            >
              {t('nav.careers')}
            </Link>

            <Link
              to="/lien-he"
              className={cn(
                'px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap',
                location.pathname === '/lien-he'
                  ? 'text-[#E8531D] font-semibold'
                  : scrolledPast || !isHome
                  ? 'text-slate-700 hover:text-[#0B2A4A] hover:bg-slate-50'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              )}
            >
              {t('nav.contact')}
            </Link>
          </nav>

          {/* Zone 3: Actions (Language toggle + Quote Request button) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language toggle button */}
            <button
              onClick={toggleLanguage}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer',
                scrolledPast || !isHome
                  ? 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  : 'border-white/20 text-white hover:bg-white/10'
              )}
              title="Chuyển đổi ngôn ngữ / Switch language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{currentLang === 'vi' ? 'VI' : 'EN'}</span>
            </button>

            {/* Quick Quote Button */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => onOpenQuoteModal()}
              className="hidden sm:inline-flex"
            >
              {t('nav.quote')}
            </Button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={cn(
                'lg:hidden p-2 rounded-lg transition-colors',
                scrolledPast || !isHome
                  ? 'text-slate-700 hover:bg-slate-100'
                  : 'text-white hover:bg-white/10'
              )}
              aria-label="Mở menu điều hướng"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Accordion style) */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 lg:hidden flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-full max-w-xs sm:max-w-sm h-full bg-white text-slate-800 p-6 flex flex-col justify-between overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <Link
                  to="/"
                  className="flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <img
                    src="/images/vietlabel/logo.webp"
                    alt="Vietlabel"
                    className="h-8 w-auto object-contain max-w-[140px]"
                    onError={(e) => {
                      e.currentTarget.src = "/images/vietlabel/logo-icon.png";
                    }}
                  />
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                  aria-label="Đóng menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Ngôn ngữ / Language</span>
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-md text-xs font-semibold text-slate-800"
                >
                  <Globe className="w-3 h-3 text-[#E8531D]" />
                  <span>{currentLang === 'vi' ? 'Tiếng Việt (VI)' : 'English (EN)'}</span>
                </button>
              </div>

              {/* Navigation links accordion */}
              <nav className="mt-4 space-y-1">
                <Link
                  to="/"
                  className="block px-3 py-2 text-sm font-medium text-slate-800 hover:text-[#E8531D] hover:bg-slate-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.home')}
                </Link>

                {/* About group */}
                <details className="group">
                  <summary className="flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg cursor-pointer list-none">
                    <span>{t('nav.about')}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="pl-4 pr-2 py-1 space-y-1">
                    <Link
                      to="/gioi-thieu"
                      className="block px-3 py-1.5 text-xs text-slate-600 hover:text-[#E8531D]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('nav.about_overview')}
                    </Link>
                    <Link
                      to="/gioi-thieu#doi-ngu"
                      className="block px-3 py-1.5 text-xs text-slate-600 hover:text-[#E8531D]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('nav.about_team')}
                    </Link>
                    <Link
                      to="/gioi-thieu#chung-nhan"
                      className="block px-3 py-1.5 text-xs text-slate-600 hover:text-[#E8531D]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('nav.about_certifications')}
                    </Link>
                    <Link
                      to="/gioi-thieu#ho-so-nang-luc"
                      className="block px-3 py-1.5 text-xs text-slate-600 hover:text-[#E8531D]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('nav.about_profile')}
                    </Link>
                  </div>
                </details>

                {/* Products group */}
                <details className="group">
                  <summary className="flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg cursor-pointer list-none">
                    <span>{t('nav.products')}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="pl-4 pr-2 py-1 space-y-1">
                    <Link
                      to="/san-pham"
                      className="block px-3 py-1.5 text-xs font-semibold text-[#E8531D]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Tất cả sản phẩm
                    </Link>
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/san-pham/${cat.slug}`}
                        className="block px-3 py-1.5 text-xs text-slate-600 hover:text-[#E8531D]"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {currentLang === 'vi' ? cat.nameVi : cat.nameEn}
                      </Link>
                    ))}
                  </div>
                </details>

                <Link
                  to="/nang-luc"
                  className="block px-3 py-2 text-sm font-medium text-slate-800 hover:text-[#E8531D] hover:bg-slate-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.capabilities')}
                </Link>

                <Link
                  to="/phat-trien-ben-vung"
                  className="block px-3 py-2 text-sm font-medium text-slate-800 hover:text-[#E8531D] hover:bg-slate-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.sustainability')}
                </Link>

                <Link
                  to="/cong-nghe"
                  className="block px-3 py-2 text-sm font-medium text-slate-800 hover:text-[#E8531D] hover:bg-slate-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.technology')}
                </Link>

                <Link
                  to="/tin-tuc"
                  className="block px-3 py-2 text-sm font-medium text-slate-800 hover:text-[#E8531D] hover:bg-slate-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.news')}
                </Link>

                <Link
                  to="/tuyen-dung"
                  className="block px-3 py-2 text-sm font-medium text-slate-800 hover:text-[#E8531D] hover:bg-slate-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.careers')}
                </Link>

                <Link
                  to="/lien-he"
                  className="block px-3 py-2 text-sm font-medium text-slate-800 hover:text-[#E8531D] hover:bg-slate-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.contact')}
                </Link>
              </nav>
            </div>

            <div className="pt-6 border-t border-slate-100 space-y-3">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuoteModal();
                }}
              >
                {t('nav.quote')}
              </Button>

              <div className="text-center text-xs text-slate-500">
                Hotline hỗ trợ: <strong className="text-slate-800">028 3765 8888</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
