const fs = require('fs');
const file = 'src/components/layout/Header.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /<Link\s*to="\/"\s*className="flex items-center gap-2 group[^>]*>[\s\S]*?<\/Link>/;
const newLogo = `          <Link
            to="/"
            className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BE1E2D] rounded-lg shrink-0"
          >
            <div className={cn(
              "transition-all flex items-center",
              scrolledPast || !isHome ? "" : ""
            )}>
              <img
                src="/logo.png"
                alt="Vietlabel - Công ty Cổ phần Sản xuất Thương mại Vietlabel"
                className={cn(
                  "h-12 sm:h-16 w-auto object-contain max-w-[420px] transition-all translate-y-1.5 shrink-0",
                  (!scrolledPast && isHome) ? "brightness-0 invert" : ""
                )}
              />
            </div>
          </Link>`;

content = content.replace(regex, newLogo);
fs.writeFileSync(file, content);
