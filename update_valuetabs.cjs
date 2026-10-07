const fs = require('fs');
const file = 'src/components/home/ValueTabs.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update icons and remove bullets
content = content.replace(/bulletsVi: \[\s*[\s\S]*?\s*\],/g, '');
content = content.replace(/bulletsEn: \[\s*[\s\S]*?\s*\],/g, '');

// Also remove rendering of bullets in the JSX
content = content.replace(/\{\(currentLang === 'vi' \? activeValue\.bulletsVi : activeValue\.bulletsEn\)\.map\(\s*\(\w+, \w+\) => \([\s\S]*?\)\s*\)\}/, '');

fs.writeFileSync(file, content);
