import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, ArrowRight, Search, Newspaper } from 'lucide-react';
import { SEO } from '../lib/seo';
import { api } from '../lib/api';
import { SectionTitle } from '../components/ui/SectionTitle';

export const NewsPage: React.FC = () => {
  const { i18n } = useTranslation();
  const [postsList, setPostsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get('/cms/posts');
        // Map CMS post format to frontend format, or fallback
        const mapped = res.data.map((p: any) => ({
          id: p.id,
          slug: p.slug,
          category: p.category,
          titleVi: p.title,
          titleEn: p.title,
          summaryVi: p.summary,
          summaryEn: p.summary,
          image: p.imageUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
          categoryNameVi: p.category,
          categoryNameEn: p.category,
          date: new Date(p.createdAt).toLocaleDateString('vi-VN'),
          readTimeVi: '5 phút đọc',
          readTimeEn: '5 min read',
          status: p.status
        })).filter((p: any) => p.status === 'PUBLISHED');
        setPostsList(mapped);
      } catch(err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);
  const currentLang = i18n.language;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', labelVi: 'Tất cả bài viết', labelEn: 'All Posts' },
    { id: 'nganh-bao-bi', labelVi: 'Tin tức ngành bao bì', labelEn: 'Industry News' },
    { id: 'du-an-noi-bat', labelVi: 'Dự án & Case Study', labelEn: 'Case Studies' },
    { id: 'hoat-dong-cong-ty', labelVi: 'Hoạt động công ty', labelEn: 'Company Updates' },
  ];

  const filteredPosts = postsList.filter((post) => {
    if (selectedCategory !== 'all' && post.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        post.titleVi.toLowerCase().includes(q) ||
        post.titleEn.toLowerCase().includes(q) ||
        post.summaryVi.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="pt-24 pb-20">
      <SEO
        title="Tin Tức & Xu Hướng Bao Bì | Vietlabel"
        description="Cập nhật tin tức ngành bao bì & tem nhãn decal, hoạt động doanh nghiệp và các case study bao bì thành công của Vietlabel."
      />

      {/* Header */}
      <section className="bg-[#0B2A4A] text-white py-16 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 inline-block">
            TIN TỨC & GÓC NHÌN CHUYÊN GIA
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight [text-wrap:balance]">
            Thông tin ngành & Hoạt động doanh nghiệp
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Chia sẻ kiến thức kỹ thuật in ấn, cập nhật xu hướng bao bì xanh toàn cầu và các dự án thiết kế tem nhãn tiêu biểu của Vietlabel.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="py-8 bg-white border-b border-slate-200 sticky top-16 z-20 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Functional Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-white text-[#0B2A4A] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {currentLang === 'vi' ? cat.labelVi : cat.labelEn}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bài viết..."
              className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-1.5 text-xs focus:border-[#0B2A4A] focus:outline-none focus:ring-1 focus:ring-[#0B2A4A]"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 bg-[#FAFAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length === 0 ? (
            <div className="py-16 text-center">
              <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">Không tìm thấy bài viết phù hợp</h3>
              <p className="text-xs text-slate-500 mt-1">Vui lòng thử tìm kiếm với từ khóa khác.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="group flex flex-col justify-between rounded-2xl bg-white border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
                >
                  <div>
                    <Link
                      to={`/tin-tuc/${post.slug}`}
                      className="block relative aspect-[16/10] overflow-hidden bg-slate-100"
                    >
                      <img
                        src={post.image}
                        alt={currentLang === 'vi' ? post.titleVi : post.titleEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 bg-[#0B2A4A]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider backdrop-blur-xs">
                        {currentLang === 'vi' ? post.categoryNameVi : post.categoryNameEn}
                      </div>
                    </Link>

                    <div className="p-6">
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {post.date}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {currentLang === 'vi' ? post.readTimeVi : post.readTimeEn}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-[#0B2A4A] group-hover:text-[#E8531D] transition-colors line-clamp-2 leading-snug">
                        <Link to={`/tin-tuc/${post.slug}`}>
                          {currentLang === 'vi' ? post.titleVi : post.titleEn}
                        </Link>
                      </h3>

                      <p className="mt-2.5 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {currentLang === 'vi' ? post.summaryVi : post.summaryEn}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-0">
                    <Link
                      to={`/tin-tuc/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B2A4A] group-hover:text-[#E8531D] transition-colors"
                    >
                      <span>Xem toàn bộ bài viết</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
