const fs = require('fs');
const file = 'src/components/layout/Header.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/'lg:hidden p-2 rounded-lg transition-colors/g, "'xl:hidden p-2 rounded-lg transition-colors");
content = content.replace(/className="hidden lg:flex items-center gap-2 sm:gap-3"/g, 'className="hidden xl:flex items-center gap-2 sm:gap-3"'); // in case actions are wrapped

fs.writeFileSync(file, content);
