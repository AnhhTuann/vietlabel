const fs = require('fs');
const file = 'src/components/layout/Header.tsx';
let content = fs.readFileSync(file, 'utf8');

const navClassFunc = `
  const getNavClass = (path: string, exact: boolean = false) => {
    const isActive = exact ? location.pathname === path : location.pathname.startsWith(path);
    const isLightMode = scrolledPast || !isHome;

    return cn(
      "relative px-1 py-1.5 text-[15px] font-medium tracking-[0.01em] transition-colors whitespace-nowrap flex items-center gap-1 group",
      "after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-[#E11D2E] after:origin-left after:transition-transform after:duration-250 after:ease-out",
      isActive ? "text-[#E11D2E] after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100",
      !isActive && (isLightMode ? "text-slate-700 hover:text-slate-900" : "text-white/90 hover:text-white")
    );
  };
`;

content = content.replace(/  const getNavClass = \([\s\S]*?  \};\n/, navClassFunc);
fs.writeFileSync(file, content);
