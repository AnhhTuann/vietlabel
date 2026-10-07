const fs = require('fs');
const file = 'src/pages/ProductsListPage.tsx';
let content = fs.readFileSync(file, 'utf8');

// Import LABEL_SOLUTIONS
if (!content.includes('LABEL_SOLUTIONS')) {
  content = content.replace(
    /import \{ PRODUCT_CATEGORIES, PRODUCTS \} from '\.\.\/data\/products';/,
    `import { PRODUCT_CATEGORIES, PRODUCTS } from '../data/products';
import { LABEL_SOLUTIONS } from '../data/labelSolutions';`
  );
}

// Create the component to inject
const labelSolutionsJSX = `
              {danhMuc === 'tem-nhan' && (
                <div className="mb-10">
                  <div className="mb-6">
                    <h2 className="text-xl sm:text-2xl font-black text-[#1E4384] uppercase tracking-tight">Giải pháp Tem nhãn theo ngành nghề</h2>
                    <p className="text-sm text-slate-500 mt-2">12 giải pháp tem nhãn chuyên dụng được thiết kế riêng biệt để đáp ứng tiêu chuẩn khắt khe của từng ngành công nghiệp.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {LABEL_SOLUTIONS.map((solution) => (
                      <div key={solution.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-xl hover:border-[#BE1E2D]/30 transition-all duration-300 group flex flex-col h-full">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#1E4384] mb-4 group-hover:bg-[#BE1E2D] group-hover:text-white transition-colors">
                          <solution.icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-2 leading-snug group-hover:text-[#BE1E2D] transition-colors line-clamp-2">
                          {currentLang === 'vi' ? solution.titleVi : solution.titleEn}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed line-clamp-4 mt-auto">
                          {currentLang === 'vi' ? solution.descVi : solution.descEn}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
`;

// Inject into the layout
const anchor = '{/* Top toolbar */}';
if (content.includes(anchor)) {
  content = content.replace(anchor, labelSolutionsJSX + '\n              ' + anchor);
}

fs.writeFileSync(file, content);
