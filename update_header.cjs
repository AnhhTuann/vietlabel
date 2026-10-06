const fs = require('fs');
const file = 'src/components/layout/Header.tsx';
let content = fs.readFileSync(file, 'utf8');

// Logo fixes
content = content.replace(/\/images\/vietlabel\/logo-v2\.svg/g, '/logo.png');
content = content.replace(/onError=\{\(e\) => \{[\s\S]*?\}\}/g, '');
content = content.replace(/className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-\[\#BE1E2D\] rounded-lg"/g, 'className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BE1E2D] rounded-lg shrink-0"');
content = content.replace(/className="h-12 sm:h-16 w-auto object-contain max-w-\[420px\]"/g, 'className={cn("h-12 sm:h-16 w-auto object-contain max-w-[420px] transition-all translate-y-1.5 shrink-0", (!scrolledPast && isHome) ? "brightness-0 invert" : "")}');

// Menu updates
const navClassFunc = `
  const getNavClass = (path: string, exact: boolean = false) => {
    const isActive = exact ? location.pathname === path : location.pathname.startsWith(path);
    const isLightMode = scrolledPast || !isHome;

    return cn(
      "relative px-1 py-1.5 text-[15px] font-medium tracking-[0.01em] transition-colors whitespace-nowrap group flex items-center gap-1",
      "after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-full after:h-[2px] after:bg-[#E11D2E] after:origin-left after:transition-transform after:duration-250 after:ease-out",
      isActive ? "text-[#E11D2E] after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100",
      !isActive && (isLightMode ? "text-slate-700 hover:text-slate-900" : "text-white/90 hover:text-white")
    );
  };
`;

content = content.replace(/  const currentLang = i18n\.language;\n\n  return \(/, navClassFunc + '\n  const currentLang = i18n.language;\n\n  return (');

const timeoutLogic = `
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const handleMouseEnter = (menu: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(menu);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
  };
`;
content = content.replace(/  const \[openDropdown, setOpenDropdown\] = useState<string \| null>\(null\);/, '  const [openDropdown, setOpenDropdown] = useState<string | null>(null);' + timeoutLogic);


const newNav = `          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 lg:gap-8">
            <Link to="/" className={getNavClass('/', true)}>{t('nav.home')}</Link>

            {/* About dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => handleMouseEnter('about')}
              onMouseLeave={handleMouseLeave}
            >
              <button className={getNavClass('/gioi-thieu')}>
                <span>{t('nav.about')}</span>
                <ChevronDown className={cn("w-3.5 h-3.5 opacity-70 transition-transform duration-200", openDropdown === 'about' && "rotate-180")} />
              </button>

              {openDropdown === 'about' && (
                <div className="absolute top-full left-0 w-64 pt-4 z-50">
                  <div className="bg-[#0B1B3A] rounded-[12px] shadow-2xl border border-white/10 p-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <Link
                      to="/gioi-thieu"
                      className="flex items-center gap-3 px-4 py-2.5 text-[15px] font-medium text-white/90 hover:bg-white/5 hover:text-[#E11D2E] rounded-lg transition-colors"
                      onClick={() => setOpenDropdown(null)}
                    >
                      <Building className="w-4 h-4" />
                      <span>{t('nav.about_overview')}</span>
                    </Link>
                    <Link
                      to="/gioi-thieu#doi-ngu"
                      className="flex items-center gap-3 px-4 py-2.5 text-[15px] font-medium text-white/90 hover:bg-white/5 hover:text-[#E11D2E] rounded-lg transition-colors"
                      onClick={() => setOpenDropdown(null)}
                    >
                      <Users className="w-4 h-4" />
                      <span>{t('nav.about_team')}</span>
                    </Link>
                    <Link
                      to="/gioi-thieu#chung-nhan"
                      className="flex items-center gap-3 px-4 py-2.5 text-[15px] font-medium text-white/90 hover:bg-white/5 hover:text-[#E11D2E] rounded-lg transition-colors"
                      onClick={() => setOpenDropdown(null)}
                    >
                      <Award className="w-4 h-4" />
                      <span>{t('nav.about_certifications')}</span>
                    </Link>
                    <Link
                      to="/gioi-thieu#ho-so-nang-luc"
                      className="flex items-center gap-3 px-4 py-2.5 text-[15px] font-medium text-white/90 hover:bg-white/5 hover:text-[#E11D2E] rounded-lg transition-colors"
                      onClick={() => setOpenDropdown(null)}
                    >
                      <FileText className="w-4 h-4" />
                      <span>{t('nav.about_profile')}</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Products Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => handleMouseEnter('products')}
              onMouseLeave={handleMouseLeave}
            >
              <Link to="/san-pham" className={getNavClass('/san-pham')}>
                <span>{t('nav.products')}</span>
                <ChevronDown className={cn("w-3.5 h-3.5 opacity-70 transition-transform duration-200", openDropdown === 'products' && "rotate-180")} />
              </Link>

              {openDropdown === 'products' && (
                <div className="absolute top-full -left-10 w-[420px] pt-4 z-50">
                  <div className="bg-[#0B1B3A] rounded-[12px] shadow-2xl border border-white/10 p-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="grid grid-cols-1 gap-1">
                      {PRODUCT_CATEGORIES.map((cat) => (
                        <Link
                          key={cat.id}
                          to={\`/san-pham/\${cat.slug}\`}
                          className="group/item flex flex-col p-3 rounded-lg hover:bg-white/5 transition-colors"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <div className="font-medium text-[15px] text-white/90 group-hover/item:text-[#E11D2E] flex items-center justify-between">
                            <span>{currentLang === 'vi' ? cat.nameVi : cat.nameEn}</span>
                            <ArrowRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                          </div>
                          <p className="text-[12px] text-white/50 mt-1 line-clamp-1">
                            {currentLang === 'vi' ? cat.shortDescVi : cat.shortDescEn}
                          </p>
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
          <div className="flex items-center gap-3">
            {/* Language Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('lang')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-semibold rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#E11D2E]',
                  scrolledPast || !isHome
                    ? 'border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                    : 'border-white/30 text-white hover:border-white/70 hover:bg-white/10'
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
                      onClick={() => { i18n.changeLanguage('vi'); setOpenDropdown(null); }}
                      className={cn("w-full text-left px-3 py-2 text-[13px] font-medium rounded-lg transition-colors", currentLang === 'vi' ? 'bg-white/10 text-[#E11D2E]' : 'text-white/80 hover:bg-white/5 hover:text-white')}
                    >
                      Tiếng Việt
                    </button>
                    <button
                      onClick={() => { i18n.changeLanguage('en'); setOpenDropdown(null); }}
                      className={cn("w-full text-left px-3 py-2 text-[13px] font-medium rounded-lg transition-colors", currentLang === 'en' ? 'bg-white/10 text-[#E11D2E]' : 'text-white/80 hover:bg-white/5 hover:text-white')}
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
              className="hidden sm:inline-flex bg-[#BE1E2D] hover:bg-[#E11D2E] hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(225,29,46,0.4)] transition-all duration-200 border-none font-medium text-[14px]"
            >
              {t('nav.quote')}
            </Button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={cn(
                'lg:hidden p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#E11D2E]',
                scrolledPast || !isHome
                  ? 'text-slate-700 hover:bg-slate-100'
                  : 'text-white hover:bg-white/10'
              )}
              aria-label="Mở menu điều hướng"
            >
              <Menu className="w-6 h-6" />
            </button>
`; // Notice no closing </div> here, it will be kept from the original string

const startIdx = content.indexOf('{/* Zone 2: Navigation Links */}');
const endIdx = content.indexOf('          </div>\n        </div>\n      </header>');

if (startIdx !== -1 && endIdx !== -1) {
  content = content.slice(0, startIdx) + newNav + content.slice(endIdx);
  fs.writeFileSync(file, content);
  console.log('Success');
} else {
  console.log('Indexes not found', startIdx, endIdx);
}
