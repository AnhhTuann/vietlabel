import {
  ArrowRight,
  Award,
  Building,
  ChevronDown,
  FileText,
  Globe,
  Menu,
  Package,
  Users,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { PRODUCT_CATEGORIES } from '../../data/products';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

interface HeaderProps {
  onOpenQuoteModal: (product?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQuoteModal }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { scrolledPast } = useScrollDirection();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const handleMouseEnter = (menu: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(menu);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
  };

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
            ? 'bg-white/90 backdrop-blur-xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] border-b border-slate-200/80 py-3'
            : 'bg-[#05172d] backdrop-blur-md border-b border-[#1a2d4d]/80 py-3 text-white',
        )}
      >
        <div className="mx-auto w-[min(calc(100%-48px),1440px)] max-w-[1440px] px-0">
          <div
            className={cn(
              'flex items-center justify-between gap-3 rounded-[20px] border px-[6px] py-[6px] transition-all duration-300',
              scrolledPast || !isHome
                ? 'border-slate-200/80 bg-white/90 shadow-[0_12px_30px_rgba(15,23,42,0.08)]'
                : 'border-white/10 bg-[#0b2343]/95 shadow-[0_18px_35px_rgba(2,6,23,0.35)]',
            )}
          >
            <Link
              to="/"
              className="flex flex-shrink-0 items-center justify-center self-stretch rounded-[14px] ring-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4384]"
            >
              <div className="flex h-full items-center justify-center border border-[#e8edf7] bg-gradient-to-r from-white via-white to-[#eef2fb] px-3 shadow-[0_4px_12px_rgba(30,67,132,0.08)] sm:px-4 lg:px-5 rounded-[14px]">
                <img
                  src="/images/vietlabel/logo.png"
                  alt="Vietlabel - Công ty Cổ phần Sản xuất Thương mại Vietlabel"
                  className="h-[46px] w-auto object-contain max-w-[170px] sm:max-w-[200px] lg:max-w-[210px]"
                  onError={(e) => {
                    e.currentTarget.src = '/images/vietlabel/logo.png';
                  }}
                />
              </div>
            </Link>

            <nav className="hidden xl:flex flex-1 min-w-0 items-center justify-between gap-1 xl:gap-2">
              <Link
                to="/"
                className={cn(
                  'relative px-[clamp(8px,0.7vw,14px)] py-2 text-[clamp(11px,0.8vw,14px)] font-semibold rounded-full transition-all duration-200 whitespace-nowrap tracking-[-0.01em]',
                  location.pathname === '/'
                    ? scrolledPast || !isHome
                      ? 'text-[#1E4384] bg-[#EEF3FF] before:absolute before:-bottom-[4px] before:left-2 before:right-2 before:h-[2px] before:rounded-full before:bg-[#E11D2E]'
                      : 'text-white bg-white/12 before:absolute before:-bottom-[4px] before:left-2 before:right-2 before:h-[2px] before:rounded-full before:bg-[#E11D2E]'
                    : scrolledPast || !isHome
                      ? 'text-slate-700 hover:text-[#1E4384] hover:bg-[#EEF3FF]'
                      : 'text-slate-200 hover:text-white hover:bg-white/8',
                )}
              >
                {t('nav.home')}
              </Link>

              {/* About dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter('about')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={cn(
                    'flex items-center gap-1 px-[clamp(8px,0.7vw,14px)] py-2 text-[clamp(11px,0.8vw,14px)] font-semibold rounded-full transition-all duration-200 whitespace-nowrap tracking-[-0.01em]',
                    location.pathname.startsWith('/gioi-thieu')
                      ? 'text-[#102447] bg-white shadow-[0_8px_18px_rgba(255,255,255,0.14)]'
                      : scrolledPast || !isHome
                        ? 'text-slate-700 hover:text-[#1E4384] hover:bg-[#EEF3FF]'
                        : 'text-slate-200 hover:text-white hover:bg-white/8',
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
                        className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[#EEF3FF] hover:text-[#1E4384] transition-colors"
                        onClick={() => setOpenDropdown(null)}
                      >
                        <Building className="w-4 h-4 text-[#1E4384]" />
                        <span>{t('nav.about_overview')}</span>
                      </Link>
                      <Link
                        to="/gioi-thieu#doi-ngu"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[#EEF3FF] hover:text-[#1E4384] transition-colors"
                        onClick={() => setOpenDropdown(null)}
                      >
                        <Users className="w-4 h-4 text-[#1E4384]" />
                        <span>{t('nav.about_team')}</span>
                      </Link>
                      <Link
                        to="/gioi-thieu#chung-nhan"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[#EEF3FF] hover:text-[#1E4384] transition-colors"
                        onClick={() => setOpenDropdown(null)}
                      >
                        <Award className="w-4 h-4 text-[#1E4384]" />
                        <span>{t('nav.about_certifications')}</span>
                      </Link>
                      <Link
                        to="/gioi-thieu#ho-so-nang-luc"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[#EEF3FF] hover:text-[#1E4384] transition-colors"
                        onClick={() => setOpenDropdown(null)}
                      >
                        <FileText className="w-4 h-4 text-[#1E4384]" />
                        <span>{t('nav.about_profile')}</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Products Mega Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter('products')}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  to="/san-pham"
                  className={cn(
                    'flex items-center gap-1 px-[clamp(8px,0.7vw,14px)] py-2 text-[clamp(11px,0.8vw,14px)] font-semibold rounded-full transition-all duration-200 whitespace-nowrap tracking-[-0.01em]',
                    location.pathname.startsWith('/san-pham')
                      ? 'text-[#102447] bg-white shadow-[0_8px_18px_rgba(255,255,255,0.14)]'
                      : scrolledPast || !isHome
                        ? 'text-slate-700 hover:text-[#1E4384] hover:bg-[#EEF3FF]'
                        : 'text-slate-200 hover:text-white hover:bg-white/8',
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
                          <Package className="w-5 h-5 text-[#1E4384]" />
                          <h4 className="font-bold text-[#1E4384] text-sm uppercase tracking-wide">
                            Danh mục bao bì công nghiệp B2B
                          </h4>
                        </div>
                        <Link
                          to="/san-pham"
                          className="text-xs text-[#BE1E2D] hover:underline font-semibold flex items-center gap-1"
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
                            <div className="font-semibold text-xs text-[#1E4384] group-hover:text-[#BE1E2D] transition-colors flex items-center justify-between">
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
                  'px-[clamp(8px,0.7vw,14px)] py-2 text-[clamp(11px,0.8vw,14px)] font-semibold rounded-full transition-all duration-200 whitespace-nowrap tracking-[-0.01em]',
                  location.pathname === '/nang-luc'
                    ? 'text-[#102447] bg-white shadow-[0_8px_18px_rgba(255,255,255,0.14)]'
                    : scrolledPast || !isHome
                      ? 'text-slate-700 hover:text-[#1E4384] hover:bg-[#EEF3FF]'
                      : 'text-slate-200 hover:text-white hover:bg-white/8',
                )}
              >
                {t('nav.capabilities')}
              </Link>

              <Link
                to="/phat-trien-ben-vung"
                className={cn(
                  'px-[clamp(8px,0.7vw,14px)] py-2 text-[clamp(11px,0.8vw,14px)] font-semibold rounded-full transition-all duration-200 whitespace-nowrap tracking-[-0.01em]',
                  location.pathname === '/phat-trien-ben-vung'
                    ? 'text-[#102447] bg-white shadow-[0_8px_18px_rgba(255,255,255,0.14)]'
                    : scrolledPast || !isHome
                      ? 'text-slate-700 hover:text-[#1E4384] hover:bg-[#EEF3FF]'
                      : 'text-slate-200 hover:text-white hover:bg-white/8',
                )}
              >
                {t('nav.sustainability')}
              </Link>

              <Link
                to="/cong-nghe"
                className={cn(
                  'px-[clamp(8px,0.7vw,14px)] py-2 text-[clamp(11px,0.8vw,14px)] font-semibold rounded-full transition-all duration-200 whitespace-nowrap tracking-[-0.01em]',
                  location.pathname === '/cong-nghe'
                    ? 'text-[#102447] bg-white shadow-[0_8px_18px_rgba(255,255,255,0.14)]'
                    : scrolledPast || !isHome
                      ? 'text-slate-700 hover:text-[#1E4384] hover:bg-[#EEF3FF]'
                      : 'text-slate-200 hover:text-white hover:bg-white/8',
                )}
              >
                {t('nav.technology')}
              </Link>

              <Link
                to="/tin-tuc"
                className={cn(
                  'px-[clamp(8px,0.7vw,14px)] py-2 text-[clamp(11px,0.8vw,14px)] font-semibold rounded-full transition-all duration-200 whitespace-nowrap tracking-[-0.01em]',
                  location.pathname.startsWith('/tin-tuc')
                    ? 'text-[#102447] bg-white shadow-[0_8px_18px_rgba(255,255,255,0.14)]'
                    : scrolledPast || !isHome
                      ? 'text-slate-700 hover:text-[#1E4384] hover:bg-[#EEF3FF]'
                      : 'text-slate-200 hover:text-white hover:bg-white/8',
                )}
              >
                {t('nav.news')}
              </Link>

              <Link
                to="/tuyen-dung"
                className={cn(
                  'px-[clamp(8px,0.7vw,14px)] py-2 text-[clamp(11px,0.8vw,14px)] font-semibold rounded-full transition-all duration-200 whitespace-nowrap tracking-[-0.01em]',
                  location.pathname === '/tuyen-dung'
                    ? 'text-[#102447] bg-white shadow-[0_8px_18px_rgba(255,255,255,0.14)]'
                    : scrolledPast || !isHome
                      ? 'text-slate-700 hover:text-[#1E4384] hover:bg-[#EEF3FF]'
                      : 'text-slate-200 hover:text-white hover:bg-white/8',
                )}
              >
                {t('nav.careers')}
              </Link>

              <Link
                to="/lien-he"
                className={cn(
                  'px-[clamp(8px,0.7vw,14px)] py-2 text-[clamp(11px,0.8vw,14px)] font-semibold rounded-full transition-all duration-200 whitespace-nowrap tracking-[-0.01em]',
                  location.pathname === '/lien-he'
                    ? 'text-[#102447] bg-white shadow-[0_8px_18px_rgba(255,255,255,0.14)]'
                    : scrolledPast || !isHome
                      ? 'text-slate-700 hover:text-[#1E4384] hover:bg-[#EEF3FF]'
                      : 'text-slate-200 hover:text-white hover:bg-white/8',
                )}
              >
                {t('nav.contact')}
              </Link>
            </nav>

            {/* Zone 3: Actions (Language toggle + Quote Request button) */}
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5 pr-1">
              {/* Language toggle button */}
              <div
                className="relative hidden sm:block"
                onMouseEnter={() => handleMouseEnter('lang')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={cn(
                    'flex shrink-0 items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-semibold rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#E11D2E] leading-none',
                    scrolledPast || !isHome
                      ? 'border-slate-200 text-slate-700 hover:border-[#E11D2E] hover:text-[#E11D2E] bg-white/80 shadow-sm'
                      : 'border-white/20 text-slate-100 hover:border-white/40 hover:bg-white/10 bg-white/5 backdrop-blur-sm',
                  )}
                  aria-label="Chọn ngôn ngữ"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{currentLang === 'vi' ? 'VI' : 'EN'}</span>
                </button>

                {openDropdown === 'lang' && (
                  <div className="absolute top-full right-0 pt-3 z-50">
                    <div className="bg-[#0B1B3A] rounded-xl shadow-lg border border-white/10 p-1.5 animate-in fade-in slide-in-from-bottom-1 duration-200 min-w-[100px]">
                      <button
                        onClick={() => {
                          i18n.changeLanguage('vi');
                          setOpenDropdown(null);
                        }}
                        className={cn(
                          'w-full text-left px-3 py-2 text-[13px] font-medium rounded-lg transition-colors whitespace-nowrap',
                          currentLang === 'vi'
                            ? 'bg-white/10 text-[#E11D2E]'
                            : 'text-white/80 hover:bg-white/5 hover:text-white',
                        )}
                      >
                        Tiếng Việt
                      </button>
                      <button
                        onClick={() => {
                          i18n.changeLanguage('en');
                          setOpenDropdown(null);
                        }}
                        className={cn(
                          'w-full text-left px-3 py-2 text-[13px] font-medium rounded-lg transition-colors whitespace-nowrap',
                          currentLang === 'en'
                            ? 'bg-white/10 text-[#E11D2E]'
                            : 'text-white/80 hover:bg-white/5 hover:text-white',
                        )}
                      >
                        English
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Quote Button */}
              <Button
                variant="primary"
                size="sm"
                onClick={() => onOpenQuoteModal()}
                className="hidden sm:inline-flex shrink-0 whitespace-nowrap rounded-full hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(225,29,46,0.4)] transition-all duration-200 bg-[#BE1E2D] hover:bg-[#d92b3c] border-none px-3 py-1.5 text-[12px] font-semibold leading-none"
              >
                {t('nav.quote')}
              </Button>

              {/* Mobile menu trigger */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={cn(
                  'xl:hidden p-2 rounded-lg transition-colors',
                  scrolledPast || !isHome
                    ? 'text-slate-700 hover:bg-slate-100'
                    : 'text-white hover:bg-white/10',
                )}
                aria-label="Mở menu điều hướng"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
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
                    src="/images/vietlabel/logo.png"
                    alt="Vietlabel"
                    className="h-10 w-auto object-contain max-w-[200px]"
                    onError={(e) => {
                      e.currentTarget.src = '/images/vietlabel/logo.png';
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
                  <Globe className="w-3 h-3 text-[#1E4384]" />
                  <span>{currentLang === 'vi' ? 'Tiếng Việt (VI)' : 'English (EN)'}</span>
                </button>
              </div>

              {/* Navigation links accordion */}
              <nav className="mt-4 space-y-1">
                <Link
                  to="/"
                  className="block px-3 py-2 text-sm font-medium text-slate-800 hover:text-[#1E4384] hover:bg-[#EEF3FF] rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.home')}
                </Link>

                {/* About group */}
                <details className="group">
                  <summary className="flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-800 hover:bg-white/5 rounded-lg cursor-pointer list-none">
                    <span>{t('nav.about')}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="pl-4 pr-2 py-1 space-y-1">
                    <Link
                      to="/gioi-thieu"
                      className="block px-3 py-1.5 text-xs text-slate-600 hover:text-[#1E4384]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('nav.about_overview')}
                    </Link>
                    <Link
                      to="/gioi-thieu#doi-ngu"
                      className="block px-3 py-1.5 text-xs text-slate-600 hover:text-[#1E4384]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('nav.about_team')}
                    </Link>
                    <Link
                      to="/gioi-thieu#chung-nhan"
                      className="block px-3 py-1.5 text-xs text-slate-600 hover:text-[#1E4384]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('nav.about_certifications')}
                    </Link>
                    <Link
                      to="/gioi-thieu#ho-so-nang-luc"
                      className="block px-3 py-1.5 text-xs text-slate-600 hover:text-[#1E4384]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('nav.about_profile')}
                    </Link>
                  </div>
                </details>

                {/* Products group */}
                <details className="group">
                  <summary className="flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-800 hover:bg-white/5 rounded-lg cursor-pointer list-none">
                    <span>{t('nav.products')}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="pl-4 pr-2 py-1 space-y-1">
                    <Link
                      to="/san-pham"
                      className="block px-3 py-1.5 text-xs font-semibold text-[#1E4384]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Tất cả sản phẩm
                    </Link>
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/san-pham/${cat.slug}`}
                        className="block px-3 py-1.5 text-xs text-slate-600 hover:text-[#1E4384]"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {currentLang === 'vi' ? cat.nameVi : cat.nameEn}
                      </Link>
                    ))}
                  </div>
                </details>

                <Link
                  to="/nang-luc"
                  className="block px-3 py-2 text-sm font-medium text-slate-800 hover:text-[#1E4384] hover:bg-[#EEF3FF] rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.capabilities')}
                </Link>

                <Link
                  to="/phat-trien-ben-vung"
                  className="block px-3 py-2 text-sm font-medium text-slate-800 hover:text-[#1E4384] hover:bg-[#EEF3FF] rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.sustainability')}
                </Link>

                <Link
                  to="/cong-nghe"
                  className="block px-3 py-2 text-sm font-medium text-slate-800 hover:text-[#1E4384] hover:bg-[#EEF3FF] rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.technology')}
                </Link>

                <Link
                  to="/tin-tuc"
                  className="block px-3 py-2 text-sm font-medium text-slate-800 hover:text-[#1E4384] hover:bg-[#EEF3FF] rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.news')}
                </Link>

                <Link
                  to="/tuyen-dung"
                  className="block px-3 py-2 text-sm font-medium text-slate-800 hover:text-[#1E4384] hover:bg-[#EEF3FF] rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.careers')}
                </Link>

                <Link
                  to="/lien-he"
                  className="block px-3 py-2 text-sm font-medium text-slate-800 hover:text-[#1E4384] hover:bg-[#EEF3FF] rounded-lg"
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
                Hotline hỗ trợ:{' '}
                <a href="tel:0868968089" className="text-[#1E4384] font-bold hover:text-[#BE1E2D]">
                  086 896 8089
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
