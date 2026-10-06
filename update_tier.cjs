const fs = require('fs');
const file = 'src/components/layout/Header.tsx';
let content = fs.readFileSync(file, 'utf8');

// We will replace the entire <header> ... </header> block.
// First, we need to import Phone, Mail if not imported.
if (!content.includes('Phone,')) {
    content = content.replace(/import {([^}]+)} from 'lucide-react';/, "import { $1, Phone, Mail } from 'lucide-react';");
}

const headerRegex = /<header[\s\S]*?<\/header>/;

const newHeader = `
      <header
        className={cn(
          'fixed w-full top-0 z-50 transition-all duration-300',
          scrolledPast ? 'shadow-md' : ''
        )}
      >
        {/* Tầng 1: Top Bar (Thông tin liên hệ & Đổi ngôn ngữ) */}
        <div className={cn(
          "hidden lg:block transition-colors duration-300 border-b",
          scrolledPast || !isHome 
            ? "bg-[#1E4384] border-[#1E4384] text-white" 
            : "bg-transparent border-white/10 text-white/90"
        )}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between text-xs font-medium tracking-wide">
            {/* Contact Info */}
            <div className="flex items-center gap-6">
              <a href="tel:+84123456789" className="flex items-center gap-2 hover:text-[#BE1E2D] transition-colors">
                <Phone className="w-3.5 h-3.5" />
                <span>0123 456 789</span>
              </a>
              <a href="mailto:contact@vietlabel.com" className="flex items-center gap-2 hover:text-[#BE1E2D] transition-colors">
                <Mail className="w-3.5 h-3.5" />
                <span>contact@vietlabel.com</span>
              </a>
            </div>

            {/* Actions (Lang + Quote) */}
            <div className="flex items-center h-full">
              {/* Language Toggle Dropdown */}
              <div 
                className="relative h-full flex items-center px-4 border-l border-white/10 cursor-pointer hover:bg-white/5 transition-colors group"
                onMouseEnter={() => handleMouseEnter('lang')}
                onMouseLeave={handleMouseLeave}
              >
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>{currentLang === 'vi' ? 'VI' : 'EN'}</span>
                </div>
                
                {openDropdown === 'lang' && (
                  <div className="absolute top-full right-0 pt-1 z-50">
                    <div className="bg-[#0B1B3A] rounded-b-xl shadow-xl border border-white/10 p-1.5 animate-in fade-in slide-in-from-top-1 min-w-[120px]">
                      <button
                        onClick={() => { i18n.changeLanguage('vi'); setOpenDropdown(null); }}
                        className={cn("w-full text-left px-3 py-2.5 text-xs font-semibold rounded-lg transition-colors", currentLang === 'vi' ? 'bg-white/10 text-[#E11D2E]' : 'text-white/80 hover:bg-white/5 hover:text-white')}
                      >
                        Tiếng Việt
                      </button>
                      <button
                        onClick={() => { i18n.changeLanguage('en'); setOpenDropdown(null); }}
                        className={cn("w-full text-left px-3 py-2.5 text-xs font-semibold rounded-lg transition-colors", currentLang === 'en' ? 'bg-white/10 text-[#E11D2E]' : 'text-white/80 hover:bg-white/5 hover:text-white')}
                      >
                        English
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Quote Button */}
              <button
                onClick={() => onOpenQuoteModal()}
                className="h-full px-6 bg-[#BE1E2D] hover:bg-[#E11D2E] text-white font-bold uppercase transition-colors flex items-center gap-2"
              >
                {t('nav.quote')}
              </button>
            </div>
          </div>
        </div>

        {/* Tầng 2: Main Navigation */}
        <div className={cn(
          "transition-all duration-300",
          scrolledPast || !isHome ? "bg-white" : "bg-transparent"
        )}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BE1E2D] rounded-lg">
              <img
                src="/images/vietlabel/logo.png"
                alt="Vietlabel"
                className={cn(
                  "h-10 sm:h-14 w-auto object-contain transition-all translate-y-1",
                  (!scrolledPast && isHome) ? "brightness-0 invert" : ""
                )}
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 h-full">
              <Link to="/" className={getNavClass('/', true)}>{t('nav.home')}</Link>

              {/* About */}
              <div className="relative group h-full flex items-center" onMouseEnter={() => handleMouseEnter('about')} onMouseLeave={handleMouseLeave}>
                <button className={getNavClass('/gioi-thieu')}>
                  <span>{t('nav.about')}</span>
                  <ChevronDown className={cn("w-3.5 h-3.5 opacity-70 transition-transform duration-200", openDropdown === 'about' && "rotate-180")} />
                </button>
                {openDropdown === 'about' && (
                  <div className="absolute top-full left-0 w-64 pt-2 z-50">
                    <div className="bg-[#0B1B3A] rounded-[12px] shadow-2xl border border-white/10 p-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                      <Link to="/gioi-thieu" className="flex items-center gap-3 px-4 py-2.5 text-[15px] font-medium text-white/90 hover:bg-white/5 hover:text-[#E11D2E] rounded-lg transition-colors" onClick={() => setOpenDropdown(null)}>
                        <Building className="w-4 h-4" /><span>{t('nav.about_overview')}</span>
                      </Link>
                      <Link to="/gioi-thieu#doi-ngu" className="flex items-center gap-3 px-4 py-2.5 text-[15px] font-medium text-white/90 hover:bg-white/5 hover:text-[#E11D2E] rounded-lg transition-colors" onClick={() => setOpenDropdown(null)}>
                        <Users className="w-4 h-4" /><span>{t('nav.about_team')}</span>
                      </Link>
                      <Link to="/gioi-thieu#chung-nhan" className="flex items-center gap-3 px-4 py-2.5 text-[15px] font-medium text-white/90 hover:bg-white/5 hover:text-[#E11D2E] rounded-lg transition-colors" onClick={() => setOpenDropdown(null)}>
                        <Award className="w-4 h-4" /><span>{t('nav.about_certifications')}</span>
                      </Link>
                      <Link to="/gioi-thieu#ho-so-nang-luc" className="flex items-center gap-3 px-4 py-2.5 text-[15px] font-medium text-white/90 hover:bg-white/5 hover:text-[#E11D2E] rounded-lg transition-colors" onClick={() => setOpenDropdown(null)}>
                        <FileText className="w-4 h-4" /><span>{t('nav.about_profile')}</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Products */}
              <div className="relative group h-full flex items-center" onMouseEnter={() => handleMouseEnter('products')} onMouseLeave={handleMouseLeave}>
                <Link to="/san-pham" className={getNavClass('/san-pham')}>
                  <span>{t('nav.products')}</span>
                  <ChevronDown className={cn("w-3.5 h-3.5 opacity-70 transition-transform duration-200", openDropdown === 'products' && "rotate-180")} />
                </Link>
                {openDropdown === 'products' && (
                  <div className="absolute top-full -left-10 w-[420px] pt-2 z-50">
                    <div className="bg-[#0B1B3A] rounded-[12px] shadow-2xl border border-white/10 p-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
                      <div className="grid grid-cols-1 gap-1">
                        {PRODUCT_CATEGORIES.map((cat) => (
                          <Link key={cat.id} to={\`/san-pham/\${cat.slug}\`} className="group/item flex flex-col p-3 rounded-lg hover:bg-white/5 transition-colors" onClick={() => setOpenDropdown(null)}>
                            <div className="font-medium text-[15px] text-white/90 group-hover/item:text-[#E11D2E] flex items-center justify-between">
                              <span>{currentLang === 'vi' ? cat.nameVi : cat.nameEn}</span>
                              <ArrowRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-[12px] text-white/50 mt-1 line-clamp-1">{currentLang === 'vi' ? cat.shortDescVi : cat.shortDescEn}</p>
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

            {/* Mobile Actions */}
            <div className="flex items-center gap-3 lg:hidden">
              <button
                onClick={toggleLanguage}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors',
                  scrolledPast || !isHome ? 'border-slate-300 text-slate-700' : 'border-white/30 text-white'
                )}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{currentLang === 'vi' ? 'VI' : 'EN'}</span>
              </button>
              
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={cn(
                  'p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#E11D2E]',
                  scrolledPast || !isHome ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'
                )}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

          </div>
        </div>
      </header>
`;

content = content.replace(headerRegex, newHeader);
fs.writeFileSync(file, content);
