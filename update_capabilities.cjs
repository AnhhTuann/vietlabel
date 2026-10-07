const fs = require('fs');
const file = 'src/pages/CapabilitiesPage.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('LABEL_SOLUTIONS')) {
  content = content.replace(
    /import \{ [\s\S]*? \} from 'lucide-react';/,
    `$&
import { LABEL_SOLUTIONS } from '../data/labelSolutions';`
  );

  const capabilitiesJSX = `
      {/* 12 Solutions Carousel / Grid */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Giải pháp Toàn diện cho 12+ Ngành Công Nghiệp"
            subtitle="Chúng tôi làm chủ công nghệ sản xuất đa dạng, đáp ứng mọi yêu cầu khắt khe nhất của từng ngành hàng chuyên biệt."
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-12">
            {LABEL_SOLUTIONS.map((sol) => (
              <div key={sol.id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-xl hover:-translate-y-1 hover:border-[#BE1E2D]/50 transition-all duration-300 flex flex-col items-center text-center group">
                <div className="w-14 h-14 rounded-full bg-slate-100 text-[#1E4384] group-hover:bg-[#BE1E2D] group-hover:text-white transition-colors flex items-center justify-center mb-4">
                  <sol.icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-[13px] uppercase mb-2 line-clamp-2">{sol.titleVi}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-3">{sol.descVi}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
`;

  const anchor = '{/* CTA Section */}';
  if (content.includes(anchor)) {
    content = content.replace(anchor, capabilitiesJSX + '\n      ' + anchor);
  }

  fs.writeFileSync(file, content);
}
