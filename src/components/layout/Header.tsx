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
import { motion, AnimatePresence } from 'motion/react';
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
      'relative px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap',
      hasDropdown && 'flex items-center gap-1.5',
      active
        ? isLightHeader
          ? 'text-[#1E4384] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-[#BE1E2D] after:to-[#1E4384]'
          : 'text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-[#BE1E2D] after:to-[#1E4384]'
        : isLightHeader
          ? 'text-slate-600 hover:text-[#1E4384] hover:bg-slate-50 rounded-lg'
          : 'text-slate-200 hover:text-white hover:bg-white/10 rounded-lg',
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
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200 py-3'
            : 'bg-gradient-to-b from-[#0a1f38] to-[#05172d] backdrop-blur-sm border-b border-white/10 py-3 text-white',
        )}
      >
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Link
                to="/"
                className="flex flex-shrink-0 items-center"
              >
                <motion.img
                  src={scrolledPast || !isHome ? '/images/vietlabel/logo.png' : '/images/vietlabel/logo-white.png'}
                  alt="Vietlabel"
                  className="h-10 sm:h-12 w-auto object-contain transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  onError={(e) => {
                    e.currentTarget.src = '/images/vietlabel/logo.png';
                  }}
                />
              </Link>
            </motion.div>

            <nav className="hidden lg:flex flex-1 items-center justify-center gap-1">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative"
                onMouseEnter={() => handleMouseEnter('about')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={getNavLinkClass(location.pathname.startsWith('/gioi-thieu'), true)}
                >
                  <span>{t('nav.about')}</span>
                  <motion.div
                    animate={openDropdown === 'about' ? { rotate: 180 } : { rotate: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4 opacity-60" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openDropdown === 'about' && (
                    <motion.div
                      className="absolute top-full left-0 w-56 pt-2 z-50"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="bg-white rounded-lg shadow-xl border border-slate-200 py-2 overflow-hidden">
                        <Link
                          to="/gioi-thieu"
                          className={cn(
                            'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                            location.pathname === '/gioi-thieu'
                              ? 'bg-[#EEF3FF] text-[#1E4384] font-semibold'
                              : 'hover:bg-slate-50 text-slate-700',
                          )}
                          onClick={() => setOpenDropdown(null)}
                        >
                          <Building className="w-4 h-4 text-[#1E4384]" />
                          <span>{t('nav.about_overview')}</span>
                        </Link>
                        <Link
                          to="/gioi-thieu#doi-ngu"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50 text-slate-700 transition-colors"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <Users className="w-4 h-4 text-[#1E4384]" />
                          <span>{t('nav.about_team')}</span>
                        </Link>
                        <Link
                          to="/gioi-thieu#chung-nhan"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50 text-slate-700 transition-colors"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <Award className="w-4 h-4 text-[#1E4384]" />
                          <span>{t('nav.about_certifications')}</span>
                        </Link>
                        <Link
                          to="/gioi-thieu#ho-so-nang-luc"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50 text-slate-700 transition-colors"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <FileText className="w-4 h-4 text-[#1E4384]" />
                          <span>{t('nav.about_profile')}</span>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                onMouseEnter={() => handleMouseEnter('products')}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  to="/san-pham"
                  className={getNavLinkClass(location.pathname.startsWith('/san-pham'), true)}
                >
                  <span>{t('nav.products')}</span>
                  <motion.div
                    animate={openDropdown === 'products' ? { rotate: 180 } : { rotate: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4 opacity-60" />
                  </motion.div>
                </Link>

                <AnimatePresence>
                  {openDropdown === 'products' && (
                    <motion.div
                      className="absolute top-full -left-32 w-[600px] pt-2 z-50"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-5 overflow-hidden">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-[#1E4384]" />
                            <h4 className="font-bold text-[#1E4384] text-xs uppercase tracking-wide">
                              Danh mục sản phẩm
                            </h4>
                          </div>
                          <Link
                            to="/san-pham"
                            className="text-xs text-[#BE1E2D] hover:underline font-semibold flex items-center gap-1"
                            onClick={() => setOpenDropdown(null)}
                          >
                            Xem tất cả <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          {PRODUCT_CATEGORIES.map((cat) => (
                            <Link
                              key={cat.id}
                              to={`/san-pham/${cat.slug}`}
                              className={cn(
                                'group p-3 rounded-lg transition-all border',
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Link
                  to="/nang-luc"
                  className={getNavLinkClass(location.pathname.startsWith('/nang-luc'))}
                >
                  {t('nav.capabilities')}
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
              >
                <Link
                  to="/phat-trien-ben-vung"
                  className={getNavLinkClass(location.pathname.startsWith('/phat-trien-ben-vung'))}
                >
                  {t('nav.sustainability')}
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Link
                  to="/cong-nghe"
                  className={getNavLinkClass(location.pathname.startsWith('/cong-nghe'))}
                >
                  {t('nav.technology')}
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.25 }}
              >
                <Link
                  to="/tin-tuc"
                  className={getNavLinkClass(location.pathname.startsWith('/tin-tuc'))}
                >
                  {t('nav.news')}
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Link
                  to="/tuyen-dung"
                  className={getNavLinkClass(location.pathname.startsWith('/tuyen-dung'))}
                >
                  {t('nav.careers')}
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.35 }}
              >
                <Link
                  to="/lien-he"
                  className={getNavLinkClass(location.pathname.startsWith('/lien-he'))}
                >
                  {t('nav.contact')}
                </Link>
              </motion.div>
            </nav>

            {/* Zone 3: Actions */}
            <motion.div
              className="flex shrink-0 items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Language toggle */}
              <div
                className="relative hidden sm:block"
                onMouseEnter={() => handleMouseEnter('lang')}
                onMouseLeave={handleMouseLeave}
              >
                <motion.button
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all',
                    scrolledPast || !isHome
                      ? 'border-slate-200 text-slate-600 hover:border-[#BE1E2D] hover:text-[#BE1E2D] bg-white'
                      : 'border-white/20 text-slate-200 hover:border-white/40 hover:bg-white/10',
                  )}
                  aria-label="Chọn ngôn ngữ"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{currentLang === 'vi' ? 'VI' : 'EN'}</span>
                </motion.button>

                <AnimatePresence>
                  {openDropdown === 'lang' && (
                    <motion.div
                      className="absolute top-full right-0 pt-2 z-50"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 min-w-[100px]">
                        <button
                          onClick={() => {
                            i18n.changeLanguage('vi');
                            setOpenDropdown(null);
                          }}
                          className={cn(
                            'w-full text-left px-3 py-2 text-xs font-medium transition-colors',
                            currentLang === 'vi'
                              ? 'bg-[#EEF3FF] text-[#1E4384]'
                              : 'text-slate-700 hover:bg-slate-50',
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
                            'w-full text-left px-3 py-2 text-xs font-medium transition-colors',
                            currentLang === 'en'
                              ? 'bg-[#EEF3FF] text-[#1E4384]'
                              : 'text-slate-700 hover:bg-slate-50',
                          )}
                        >
                          English
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quote Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onOpenQuoteModal()}
                  className="hidden sm:inline-flex px-4 py-2 text-xs font-semibold rounded-lg bg-[#BE1E2D] hover:bg-[#d92b3c]"
                >
                  {t('nav.quote')}
                </Button>
              </motion.div>

              {/* Mobile menu trigger */}
              <motion.button
                onClick={() => setMobileMenuOpen(true)}
                className={cn(
                  'lg:hidden p-2 rounded-lg transition-colors',
                  scrolledPast || !isHome
                    ? 'text-slate-700 hover:bg-slate-100'
                    : 'text-white hover:bg-white/10',
                )}
                aria-label="Mở menu"
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 lg:hidden flex justify-end bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        >
          <motion.div
            className="w-full max-w-sm h-full bg-white flex flex-col shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <Link
                  to="/"
                  className="flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <img
                    src="/images/vietlabel/logo.png"
                    alt="Vietlabel"
                    className="h-8 w-auto object-contain"
                  />
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                  aria-label="Đóng menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Ngôn ngữ</span>
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700"
                >
                  <Globe className="w-3.5 h-3.5 text-[#1E4384]" />
                  <span>{currentLang === 'vi' ? 'Tiếng Việt' : 'English'}</span>
                </button>
              </div>

              <nav className="space-y-1">
                <Link
                  to="/"
                  className={cn(
                    'block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                    location.pathname === '/'
                      ? 'bg-[#EEF3FF] text-[#1E4384] font-bold'
                      : 'text-slate-700 hover:bg-slate-50',
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.home')}
                </Link>

                {/* About group */}
                <details className="group" open={location.pathname.startsWith('/gioi-thieu')}>
                  <summary
                    className={cn(
                      'flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg cursor-pointer list-none transition-colors',
                      location.pathname.startsWith('/gioi-thieu')
                        ? 'bg-[#EEF3FF] text-[#1E4384] font-bold'
                        : 'text-slate-700 hover:bg-slate-50',
                    )}
                  >
                    <span>{t('nav.about')}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="pl-4 py-1 space-y-1">
                    <Link
                      to="/gioi-thieu"
                      className={cn(
                        'block px-3 py-2 text-xs rounded-md transition-colors',
                        location.pathname === '/gioi-thieu'
                          ? 'text-[#BE1E2D] font-bold bg-red-50'
                          : 'text-slate-600 hover:bg-slate-50',
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('nav.about_overview')}
                    </Link>
                    <Link
                      to="/gioi-thieu#doi-ngu"
                      className="block px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('nav.about_team')}
                    </Link>
                    <Link
                      to="/gioi-thieu#chung-nhan"
                      className="block px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('nav.about_certifications')}
                    </Link>
                    <Link
                      to="/gioi-thieu#ho-so-nang-luc"
                      className="block px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 rounded-md transition-colors"
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
                      'flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg cursor-pointer list-none transition-colors',
                      location.pathname.startsWith('/san-pham')
                        ? 'bg-[#EEF3FF] text-[#1E4384] font-bold'
                        : 'text-slate-700 hover:bg-slate-50',
                    )}
                  >
                    <span>{t('nav.products')}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="pl-4 py-1 space-y-1">
                    <Link
                      to="/san-pham"
                      className={cn(
                        'block px-3 py-2 text-xs rounded-md transition-colors',
                        location.pathname === '/san-pham'
                          ? 'text-[#BE1E2D] font-bold bg-red-50'
                          : 'text-slate-600 hover:bg-slate-50',
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Tất cả sản phẩm
                    </Link>
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/san-pham/${cat.slug}`}
                        className={cn(
                          'block px-3 py-2 text-xs rounded-md transition-colors',
                          location.pathname === `/san-pham/${cat.slug}`
                            ? 'text-[#BE1E2D] font-bold bg-red-50'
                            : 'text-slate-600 hover:bg-slate-50',
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {currentLang === 'vi' ? cat.nameVi : cat.nameEn}
                      </Link>
                    ))}
                  </div>
                </details>

                <Link
                  to="/nang-luc"
                  className={cn(
                    'block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                    location.pathname.startsWith('/nang-luc')
                      ? 'bg-[#EEF3FF] text-[#1E4384] font-bold'
                      : 'text-slate-700 hover:bg-slate-50',
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.capabilities')}
                </Link>

                <Link
                  to="/phat-trien-ben-vung"
                  className={cn(
                    'block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                    location.pathname.startsWith('/phat-trien-ben-vung')
                      ? 'bg-[#EEF3FF] text-[#1E4384] font-bold'
                      : 'text-slate-700 hover:bg-slate-50',
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.sustainability')}
                </Link>

                <Link
                  to="/cong-nghe"
                  className={cn(
                    'block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                    location.pathname.startsWith('/cong-nghe')
                      ? 'bg-[#EEF3FF] text-[#1E4384] font-bold'
                      : 'text-slate-700 hover:bg-slate-50',
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.technology')}
                </Link>

                <Link
                  to="/tin-tuc"
                  className={cn(
                    'block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                    location.pathname.startsWith('/tin-tuc')
                      ? 'bg-[#EEF3FF] text-[#1E4384] font-bold'
                      : 'text-slate-700 hover:bg-slate-50',
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.news')}
                </Link>

                <Link
                  to="/tuyen-dung"
                  className={cn(
                    'block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                    location.pathname.startsWith('/tuyen-dung')
                      ? 'bg-[#EEF3FF] text-[#1E4384] font-bold'
                      : 'text-slate-700 hover:bg-slate-50',
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.careers')}
                </Link>

                <Link
                  to="/lien-he"
                  className={cn(
                    'block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                    location.pathname.startsWith('/lien-he')
                      ? 'bg-[#EEF3FF] text-[#1E4384] font-bold'
                      : 'text-slate-700 hover:bg-slate-50',
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.contact')}
                </Link>
              </nav>
            </div>

            <div className="p-4 border-t border-slate-200">
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  onOpenQuoteModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full"
              >
                {t('nav.quote')}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};
