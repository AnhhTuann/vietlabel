const fs = require('fs');
const file = 'src/pages/HomePage.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('LabelSolutionsMarquee')) {
  content = content.replace(
    /import \{ ClientMarquee \} from '\.\.\/components\/home\/ClientMarquee';/,
    `import { ClientMarquee } from '../components/home/ClientMarquee';
import { LabelSolutionsMarquee } from '../components/home/LabelSolutionsMarquee';`
  );

  content = content.replace(
    /<ClientMarquee \/>/g,
    `<ClientMarquee />\n      <LabelSolutionsMarquee />`
  );
  
  fs.writeFileSync(file, content);
}
