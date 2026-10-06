const fs = require('fs');
const file = 'src/components/layout/Header.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add timeoutRef logic for dropdowns if not exists
if (!content.includes('timeoutRef.current')) {
  content = content.replace(
    /const \[openDropdown, setOpenDropdown\] = useState<string \| null>\(null\);/,
    `const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const handleMouseEnter = (menu: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(menu);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
  };`
  );
}

// Replace Quote Button
content = content.replace(
  /<Button\s*variant="primary"\s*size="sm"\s*onClick=\{\(\) => onOpenQuoteModal\(\)\}\s*className="hidden sm:inline-flex"\s*>\s*\{t\('nav\.quote'\)\}\s*<\/Button>/g,
  `<Button
              variant="primary"
              size="sm"
              onClick={() => onOpenQuoteModal()}
              className="hidden sm:inline-flex hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(225,29,46,0.4)] transition-all duration-200"
            >
              {t('nav.quote')}
            </Button>`
);

// Replace Language Button with Dropdown Pill
const langRegex = /<button\s*onClick=\{toggleLanguage\}[\s\S]*?<\/button>/;
const newLang = `<div 
              className="relative hidden sm:block"
              onMouseEnter={() => handleMouseEnter('lang')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-semibold rounded-full border transition-all duration-200',
                  scrolledPast || !isHome
                    ? 'border-slate-300 text-slate-700 hover:border-[#E11D2E] hover:text-[#E11D2E]'
                    : 'border-white/30 text-white hover:border-white hover:bg-white/10'
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
            </div>`;
content = content.replace(langRegex, newLang);

// Update dropdowns styling (About and Products)
content = content.replace(/bg-white rounded-xl shadow-lg border border-slate-100/g, 'bg-[#0B1B3A] rounded-[12px] shadow-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-200');
content = content.replace(/text-slate-600 hover:text-\[#E8531D\] hover:bg-slate-50/g, 'text-white/90 hover:bg-white/5 hover:text-[#E11D2E]');
content = content.replace(/text-slate-800 group-hover\/item:text-\[#E8531D\]/g, 'text-white/90 group-hover/item:text-[#E11D2E]');
content = content.replace(/text-slate-500/g, 'text-white/50');
content = content.replace(/hover:bg-slate-50/g, 'hover:bg-white/5');

// Update onMouseEnter to use handleMouseEnter
content = content.replace(/onMouseEnter=\{\(\) => setOpenDropdown\('about'\)\}/g, "onMouseEnter={() => handleMouseEnter('about')} onMouseLeave={handleMouseLeave}");
content = content.replace(/onMouseEnter=\{\(\) => setOpenDropdown\('products'\)\}/g, "onMouseEnter={() => handleMouseEnter('products')} onMouseLeave={handleMouseLeave}");
// Remove inline onMouseLeave to avoid conflict
content = content.replace(/onMouseLeave=\{\(\) => setOpenDropdown\(null\)\}/g, '');

fs.writeFileSync(file, content);
