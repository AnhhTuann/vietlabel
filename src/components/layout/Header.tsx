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
  const isLightHeader = scrolledPast || !isHome;

  const getNavLinkClass = (active: boolean, hasDropdown = false) =>
    cn(
      'relative px-[clamp(10px,0.8vw,16px)] py-2.5 text-[clamp(14px,0.9vw,16px)] font-semibold transition-colors duration-200 whitespace-nowrap tracking-[-0.01em]',
      hasDropdown && 'flex items-center gap-1',
      active
        ? isLightHeader
          ? 'text-[#1E4384] font-bold before:absolute before:bottom-0 before:left-2 before:right-2 before:h-[2.5px] before:rounded-full before:bg-[#BE1E2D]'
          : 'text-white font-bold before:absolute before:bottom-0 before:left-2 before:right-2 before:h-[2.5px] before:rounded-full before:bg-[#BE1E2D]'
        : isLightHeader
          ? 'text-slate-600 hover:text-[#1E4384]'
          : 'text-slate-200 hover:text-white',
    );

  const getMobileNavLinkClass = (active: boolean) =>
    cn(
      'block px-3.5 py-2.5 text-sm font-medium rounded-lg transition-colors',
      active
        ? 'bg-[#EEF3FF] text-[#1E4384] font-bold border-l-4 border-[#BE1E2D]'
        : 'text-slate-800 hover:text-[#1E4384] hover:bg-slate-50',
    );

  const getMobileSubNavLinkClass = (active: boolean) =>
    cn(
      'block px-3 py-1.5 text-xs rounded transition-colors',
      active
        ? 'text-[#BE1E2D] font-bold bg-red-50/70'
        : 'text-slate-600 hover:text-[#1E4384] hover:bg-slate-50',
    );

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
            ? 'bg-white/90 backdrop-blur-xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] border-b border-slate-200/80 py-4'
            : 'bg-[#05172d] backdrop-blur-md border-b border-[#1a2d4d]/80 py-4 text-white',
        )}
      >
        <div className="mx-auto w-full max-w-[1920px] px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between gap-4 xl:gap-6">
            <Link
              to="/"
              className="flex flex-shrink-0 items-center justify-center py-1 px-2 ring-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4384] rounded-xl transition-transform hover:scale-[1.02]"
            >
              <img
                src={scrolledPast || !isHome ? '/images/vietlabel/logo.png' : '/images/vietlabel/logo-white.png'}
                alt="Vietlabel - Công ty Cổ phần Sản xuất Thương mại Vietlabel"
                className="h-[50px] sm:h-[56px] lg:h-[64px] w-auto object-contain max-w-[200px] sm:max-w-[240px] lg:max-w-[280px] transition-all duration-300"
                onError={(e) => {
                  e.currentTarget.src = '/images/vietlabel/logo.png';
                }}
              />
            </Link>

            <nav className="hidden xl:flex flex-1 min-w-0 items-center justify-center gap-1 xl:gap-2 2xl:gap-3 px-2">
              <Link
                to="/"
                className={getNavLinkClass(location.pathname === '/')}
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
                  className={getNavLinkClass(location.pathname.startsWith('/gioi-thieu'), true)}
                >
                  <span>{t('nav.about')}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>

                {openDropdown === 'about' && (
                  <div className="absolute top-full left-0 w-64 pt-2 shadow-xl animate-in fade-in-50 duration-150">
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 py-2 text-slate-800">
                      <Link
                        to="/gioi-thieu"
                        className={cn(
                          'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                          location.pathname === '/gioi-thieu'
                            ? 'bg-[#EEF3FF] text-[#1E4384] font-semibold'
                            : 'hover:bg-[#EEF3FF] hover:text-[#1E4384] text-slate-700',
                        )}
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
                  className={getNavLinkClass(location.pathname.startsWith('/san-pham'), true)}
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
                            className={cn(
                              'group p-3 rounded-xl transition-all border',
                              location.pathname === `/san-pham/${cat.slug}`
                                ? 'bg-[#EEF3FF] border-[#1E4384]/30'
                                : 'hover:bg-slate-50 border-transparent hover:border-slate-200',
                            )}
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
                className={getNavLinkClass(location.pathname.startsWith('/nang-luc'))}
              >
                {t('nav.capabilities')}
              </Link>

              <Link
                to="/phat-trien-ben-vung"
                className={getNavLinkClass(location.pathname.startsWith('/phat-trien-ben-vung'))}
              >
                {t('nav.sustainability')}
              </Link>

              <Link
                to="/cong-nghe"
                className={getNavLinkClass(location.pathname.startsWith('/cong-nghe'))}
              >
                {t('nav.technology')}
              </Link>

              <Link
                to="/tin-tuc"
                className={getNavLinkClass(location.pathname.startsWith('/tin-tuc'))}
              >
                {t('nav.news')}
              </Link>

              <Link
                to="/tuyen-dung"
                className={getNavLinkClass(location.pathname.startsWith('/tuyen-dung'))}
              >
                {t('nav.careers')}
              </Link>

              <Link
                to="/lien-he"
                className={getNavLinkClass(location.pathname.startsWith('/lien-he'))}
              >
                {t('nav.contact')}
              </Link>
            </nav>

            {/* Zone 3: Actions (Language toggle + Quote Request button) */}
            <div
              className={cn(
                'flex shrink-0 items-center gap-3 sm:gap-4 pl-4 sm:pl-6 border-l transition-colors duration-200',
                scrolledPast || !isHome ? 'border-slate-200' : 'border-white/15',
              )}
            >
              {/* Language toggle button */}
              <div
                className="relative hidden sm:block"
                onMouseEnter={() => handleMouseEnter('lang')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={cn(
                    'flex shrink-0 items-center gap-1.5 px-4 py-2 text-[13px] font-semibold rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#E11D2E] leading-none cursor-pointer',
                    scrolledPast || !isHome
                      ? 'border-slate-200 text-slate-700 hover:border-[#E11D2E] hover:text-[#E11D2E] bg-white/80 shadow-xs'
                      : 'border-white/20 text-slate-100 hover:border-white/40 hover:bg-white/10 bg-white/5 backdrop-blur-sm',
                  )}
                  aria-label="Chọn ngôn ngữ"
                >
                  <Globe className="w-4 h-4" />
                  <span>{currentLang === 'vi' ? 'VI' : 'EN'}</span>
                </button>

                {openDropdown === 'lang' && (
                  <div className="absolute top-full right-0 pt-3 z-50">
                    <div className="bg-[#0B1B3A] rounded-xl shadow-lg border border-white/10 p-1.5 animate-in fade-in slide-in-from-bottom-1 duration-200 min-w-[110px]">
                      <button
                        onClick={() => {
                          i18n.changeLanguage('vi');
                          setOpenDropdown(null);
                        }}
                        className={cn(
                          'w-full text-left px-3 py-2 text-[13px] font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer',
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
                          'w-full text-left px-3 py-2 text-[13px] font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer',
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
                className="hidden sm:inline-flex shrink-0 whitespace-nowrap rounded-full hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(225,29,46,0.4)] transition-all duration-200 bg-[#BE1E2D] hover:bg-[#d92b3c] border-none px-5 py-2.5 text-[13px] sm:text-[14px] font-semibold leading-none shadow-xs cursor-pointer"
              >
                {t('nav.quote')}
              </Button>

              {/* Mobile menu trigger */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={cn(
                  'xl:hidden p-2.5 rounded-lg transition-colors cursor-pointer',
                  scrolledPast || !isHome
                    ? 'text-slate-700 hover:bg-slate-100'
                    : 'text-white hover:bg-white/10',
                )}
                aria-label="Mở menu điều hướng"
              >
                <Menu className="w-7 h-7" />
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
                  className={getMobileNavLinkClass(location.pathname === '/')}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.home')}
                </Link>

                {/* About group */}
                <details className="group" open={location.pathname.startsWith('/gioi-thieu')}>
                  <summary
                    className={cn(
                      'flex items-center justify-between px-3.5 py-2.5 text-sm font-medium rounded-lg cursor-pointer list-none transition-colors',
                      location.pathname.startsWith('/gioi-thieu')
                        ? 'bg-[#EEF3FF] text-[#1E4384] font-bold border-l-4 border-[#BE1E2D]'
                        : 'text-slate-800 hover:bg-slate-50',
                    )}
                  >
                    <span>{t('nav.about')}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="pl-4 pr-2 py-1 space-y-1">
                    <Link
                      to="/gioi-thieu"
                      className={getMobileSubNavLinkClass(location.pathname === '/gioi-thieu')}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('nav.about_overview')}
                    </Link>
                    <Link
                      to="/gioi-thieu#doi-ngu"
                      className={getMobileSubNavLinkClass(false)}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('nav.about_team')}
                    </Link>
                    <Link
                      to="/gioi-thieu#chung-nhan"
                      className={getMobileSubNavLinkClass(false)}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('nav.about_certifications')}
                    </Link>
                    <Link
                      to="/gioi-thieu#ho-so-nang-luc"
                      className={getMobileSubNavLinkClass(false)}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('nav.about_profile')}
                    </Link>
                  </div>
                </details>

                {/* Products group */}
                <details className="group" open={location.pathname.startsWith('/san-pham')}>
                  <summary
                    className={cn(
                      'flex items-center justify-between px-3.5 py-2.5 text-sm font-medium rounded-lg cursor-pointer list-none transition-colors',
                      location.pathname.startsWith('/san-pham')
                        ? 'bg-[#EEF3FF] text-[#1E4384] font-bold border-l-4 border-[#BE1E2D]'
                        : 'text-slate-800 hover:bg-slate-50',
                    )}
                  >
                    <span>{t('nav.products')}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="pl-4 pr-2 py-1 space-y-1">
                    <Link
                      to="/san-pham"
                      className={getMobileSubNavLinkClass(location.pathname === '/san-pham')}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Tất cả sản phẩm
                    </Link>
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/san-pham/${cat.slug}`}
                        className={getMobileSubNavLinkClass(location.pathname === `/san-pham/${cat.slug}`)}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {currentLang === 'vi' ? cat.nameVi : cat.nameEn}
                      </Link>
                    ))}
                  </div>
                </details>

                <Link
                  to="/nang-luc"
                  className={getMobileNavLinkClass(location.pathname.startsWith('/nang-luc'))}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.capabilities')}
                </Link>

                <Link
                  to="/phat-trien-ben-vung"
                  className={getMobileNavLinkClass(location.pathname.startsWith('/phat-trien-ben-vung'))}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.sustainability')}
                </Link>

                <Link
                  to="/cong-nghe"
                  className={getMobileNavLinkClass(location.pathname.startsWith('/cong-nghe'))}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.technology')}
                </Link>

                <Link
                  to="/tin-tuc"
                  className={getMobileNavLinkClass(location.pathname.startsWith('/tin-tuc'))}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.news')}
                </Link>

                <Link
                  to="/tuyen-dung"
                  className={getMobileNavLinkClass(location.pathname.startsWith('/tuyen-dung'))}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.careers')}
                </Link>

                <Link
                  to="/lien-he"
                  className={getMobileNavLinkClass(location.pathname.startsWith('/lien-he'))}
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
