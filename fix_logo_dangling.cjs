const fs = require('fs');
const file = 'src/components/layout/Header.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/                \}\}\n/g, ''); // Fix dangling brackets if any
fs.writeFileSync(file, content);
