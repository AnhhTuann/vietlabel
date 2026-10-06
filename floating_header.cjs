const fs = require('fs');
const file = 'src/components/layout/Header.tsx';

const newContent = `import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Menu,
  X,
  ChevronDown,
  Globe,
  Phone,
  Mail,
  FileText,
  Package,
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
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const isHome = location.pathname === '/';
  const isLightMode = scrolledPast || !isHome;
  const currentLang = i18n.language;

  const handleMouseEnter = (menu: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(menu);
  };
  
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(currentLang === 'vi' ? 'en' : 'vi');
  };

  const getNavClass = (path: string, exact: boolean = false) => {
    const isActive = exact ? location.pathname === path : location.pathname.startsWith(path);
    return cn(
      "relative px-3 py-2 text-[14px] font-bold tracking-wide rounded-full transition-all flex items-center gap-1",
      isActive 
        ? (isLightMode ? "bg-[#BE1E2D]/10 text-[#BE1E2D]" : "bg-white/20 text-white") 
        : (isLightMode ? "text-slate-700 hover:bg-slate-100 hover:text-[#1E4384]" : "text-white/80 hover:bg-white/10 hover:text-white")
    );
  };

  return (
    <>
      <header
        className={cn(
          'fixed left-0 right-0 z-50 transition-all duration-500 ease-out px-2 sm:px-4 lg:px-6',
          scrolledPast ? 'top-2 sm:top-4' : 'top-0 sm:top-4'
        )}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className={cn(
            "flex items-center justify-between transition-all duration-500 ease-out",
            scrolledPast || !isHome
              ? "h-16 sm:h-[72px] bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/50 rounded-2xl sm:rounded-full px-4 sm:px-6 lg:px-8"
              : "h-20 sm:h-24 bg-transparent px-2 sm:px-4 lg:px-6"
          )}>
            
            {/* Zone 1: Logo */}
            <Link to="/" className="shrink-0 flex items-center group">
              <img
                src="/images/vietlabel/logo.png"
                alt="Vietlabel"
                className={cn(
                  "w-auto object-contain transition-all duration-500",
                  scrolledPast || !isHome ? "h-10 sm:h-12" : "h-12 sm:h-16",
                  (!scrolledPast && isHome) ? "brightness-0 invert" : ""
                )}
              />
            </Link>

            {/* Zone 2: Navigation (Hidden on Tablet/Mobile) */}
            <nav className="hidden xl:flex items-center justify-center gap-1">
              <Link to="/" className={getNavClass('/', true)}>{t('nav.home')}</Link>

              {/* About Dropdown */}
              <div className="relative group" onMouseEnter={() => handleMouseEnter('about')} onMouseLeave={handleMouseLeave}>
                <button className={getNavClass('/gioi-thieu')}>
                  <span>{t('nav.about')}</span>
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", openDropdown === 'about' && "rotate-180")} />
                </button>
                {openDropdown === 'about' && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50">
                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_10px_40px_rgb(0,0,0,0.1)] border border-white p-2 min-w-[240px] animate-in fade-in zoom-in-95 duration-200">
                      <Link to="/gioi-thieu" className="flex items-center gap-3 px-4 py-3 text-[14px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#BE1E2D] rounded-xl transition-colors" onClick={() => setOpenDropdown(null)}>
                        <Building className="w-4 h-4" /><span>{t('nav.about_overview')}</span>
                      </Link>
                      <Link to="/gioi-thieu#doi-ngu" className="flex items-center gap-3 px-4 py-3 text-[14px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#BE1E2D] rounded-xl transition-colors" onClick={() => setOpenDropdown(null)}>
                        <Users className="w-4 h-4" /><span>{t('nav.about_team')}</span>
                      </Link>
                      <Link to="/gioi-thieu#chung-nhan" className="flex items-center gap-3 px-4 py-3 text-[14px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#BE1E2D] rounded-xl transition-colors" onClick={() => setOpenDropdown(null)}>
                        <Award className="w-4 h-4" /><span>{t('nav.about_certifications')}</span>
                      </Link>
                      <Link to="/gioi-thieu#ho-so-nang-luc" className="flex items-center gap-3 px-4 py-3 text-[14px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#BE1E2D] rounded-xl transition-colors" onClick={() => setOpenDropdown(null)}>
                        <FileText className="w-4 h-4" /><span>{t('nav.about_profile')}</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Products Dropdown */}
              <div className="relative group" onMouseEnter={() => handleMouseEnter('products')} onMouseLeave={handleMouseLeave}>
                <Link to="/san-pham" className={getNavClass('/san-pham')}>
                  <span>{t('nav.products')}</span>
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", openDropdown === 'products' && "rotate-180")} />
                </Link>
                {openDropdown === 'products' && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50">
                    <div className="bg-white/95 backdrop-blur-xl rounded-[24px] shadow-[0_10px_50px_rgb(0,0,0,0.15)] border border-white p-4 w-[500px] animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex items-center justify-between mb-3 px-2">
                        <div className="flex items-center gap-2 text-[#1E4384] font-bold">
                          <Package className="w-4 h-4" />
                          <span className="uppercase text-xs tracking-wider">Danh mục sản phẩm</span>
                        </div>
                        <Link to="/san-pham" className="text-xs text-[#BE1E2D] hover:underline font-bold" onClick={() => setOpenDropdown(null)}>Xem tất cả &rarr;</Link>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {PRODUCT_CATEGORIES.map((cat) => (
                          <Link key={cat.id} to={\`/san-pham/\${cat.slug}\`} className="group/item flex flex-col p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all" onClick={() => setOpenDropdown(null)}>
                            <div className="font-bold text-[14px] text-slate-800 group-hover/item:text-[#BE1E2D] flex items-center justify-between">
                              <span>{currentLang === 'vi' ? cat.nameVi : cat.nameEn}</span>
                              <ArrowRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-all -translate-x-2 group-hover/item:translate-x-0" />
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{currentLang === 'vi' ? cat.shortDescVi : cat.shortDescEn}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link to="/nang-luc" className={getNavClass('/nang-luc')}>{t('nav.capabilities')}</Link>
              <Link to="/phat-trien-ben-vung" className={getNavClass('/phat-trien-ben-vung')}>{t('nav.sustainability')}</Link>
              <Link to="/cong-nghe" className={getNavClass('/cong-nghe')}>{t('nav.technology')}</Link>
              <Link to="/tin-tuc" className={getNavClass('/tin-tuc')}>{t('nav.news')}</Link>
              <Link to="/tuyen-dung" className={getNavClass('/tuyen-dung')}>{t('nav.careers')}</Link>
              <Link to="/lien-he" className={getNavClass('/lien-he')}>{t('nav.contact')}</Link>
            </nav>

            {/* Zone 3: Actions */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              
              {/* Phone (Desktop only) */}
              <a href="tel:0123456789" className={cn(
                "hidden 2xl:flex items-center gap-1.5 px-3 py-2 rounded-full font-bold text-[14px] transition-all",
                isLightMode ? "text-slate-700 hover:bg-slate-100" : "text-white/90 hover:bg-white/10"
              )}>
                <Phone className="w-4 h-4" />
                <span>0123.456.789</span>
              </a>

              {/* Language Dropdown */}
              <div className="relative group" onMouseEnter={() => handleMouseEnter('lang')} onMouseLeave={handleMouseLeave}>
                <button
                  className={cn(
                    'flex items-center gap-1 px-3 py-2 text-[13px] font-bold rounded-full transition-all border',
                    isLightMode
                      ? 'border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
                      : 'border-white/20 text-white hover:bg-white/10'
                  )}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{currentLang === 'vi' ? 'VI' : 'EN'}</span>
                </button>
                {openDropdown === 'lang' && (
                  <div className="absolute top-full right-0 pt-3 z-50">
                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white p-1.5 min-w-[120px] animate-in fade-in zoom-in-95 duration-200">
                      <button onClick={() => { i18n.changeLanguage('vi'); setOpenDropdown(null); }} className={cn("w-full text-left px-3 py-2.5 text-[13px] font-bold rounded-xl transition-colors", currentLang === 'vi' ? 'bg-[#BE1E2D]/10 text-[#BE1E2D]' : 'text-slate-700 hover:bg-slate-50')}>Tiếng Việt</button>
                      <button onClick={() => { i18n.changeLanguage('en'); setOpenDropdown(null); }} className={cn("w-full text-left px-3 py-2.5 text-[13px] font-bold rounded-xl transition-colors", currentLang === 'en' ? 'bg-[#BE1E2D]/10 text-[#BE1E2D]' : 'text-slate-700 hover:bg-slate-50')}>English</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Quote Button */}
              <Button
                variant="primary"
                onClick={() => onOpenQuoteModal()}
                className="hidden sm:inline-flex h-9 sm:h-10 rounded-full px-5 bg-[#BE1E2D] hover:bg-[#E11D2E] shadow-lg shadow-[#BE1E2D]/30 hover:shadow-[#BE1E2D]/50 hover:-translate-y-0.5 transition-all duration-300 font-bold tracking-wide border-none text-[13px]"
              >
                {t('nav.quote')}
              </Button>

              {/* Mobile Menu Trigger */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={cn(
                  'xl:hidden p-2 rounded-full transition-all',
                  isLightMode ? 'text-slate-800 hover:bg-slate-100' : 'text-white hover:bg-white/10'
                )}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] xl:hidden flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-white h-full shadow-2xl animate-in slide-in-from-right overflow-y-auto flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-6 flex-1">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <img src="/images/vietlabel/logo.png" alt="Vietlabel" className="h-10 w-auto object-contain" />
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="mt-6 flex flex-col gap-2">
                <Link to="/" className="px-4 py-3 font-bold text-slate-800 hover:bg-slate-50 rounded-xl" onClick={() => setMobileMenuOpen(false)}>{t('nav.home')}</Link>
                <Link to="/gioi-thieu" className="px-4 py-3 font-bold text-slate-800 hover:bg-slate-50 rounded-xl" onClick={() => setMobileMenuOpen(false)}>{t('nav.about')}</Link>
                <Link to="/san-pham" className="px-4 py-3 font-bold text-slate-800 hover:bg-slate-50 rounded-xl" onClick={() => setMobileMenuOpen(false)}>{t('nav.products')}</Link>
                <Link to="/nang-luc" className="px-4 py-3 font-bold text-slate-800 hover:bg-slate-50 rounded-xl" onClick={() => setMobileMenuOpen(false)}>{t('nav.capabilities')}</Link>
                <Link to="/phat-trien-ben-vung" className="px-4 py-3 font-bold text-slate-800 hover:bg-slate-50 rounded-xl" onClick={() => setMobileMenuOpen(false)}>{t('nav.sustainability')}</Link>
                <Link to="/cong-nghe" className="px-4 py-3 font-bold text-slate-800 hover:bg-slate-50 rounded-xl" onClick={() => setMobileMenuOpen(false)}>{t('nav.technology')}</Link>
                <Link to="/tin-tuc" className="px-4 py-3 font-bold text-slate-800 hover:bg-slate-50 rounded-xl" onClick={() => setMobileMenuOpen(false)}>{t('nav.news')}</Link>
                <Link to="/tuyen-dung" className="px-4 py-3 font-bold text-slate-800 hover:bg-slate-50 rounded-xl" onClick={() => setMobileMenuOpen(false)}>{t('nav.careers')}</Link>
                <Link to="/lien-he" className="px-4 py-3 font-bold text-slate-800 hover:bg-slate-50 rounded-xl" onClick={() => setMobileMenuOpen(false)}>{t('nav.contact')}</Link>
              </nav>
            </div>
            
            <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50">
              <Button variant="primary" className="w-full rounded-xl h-12 text-[15px]" onClick={() => { setMobileMenuOpen(false); onOpenQuoteModal(); }}>
                {t('nav.quote')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
`;

fs.writeFileSync(file, newContent);
