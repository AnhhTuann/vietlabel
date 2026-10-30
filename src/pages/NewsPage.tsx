import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Calendar, Clock, ArrowRight, Search, Newspaper, ChevronLeft, ChevronRight } from 'lucide-react';
import { SEO } from '../lib/seo';
import { api } from '../services/api';
import { POSTS_LIST } from '../data/posts';
import { SectionTitle } from '../components/ui/SectionTitle';

export const NewsPage: React.FC = () => {
  const { i18n } = useTranslation();
  const [postsList, setPostsList] = useState<any[]>(POSTS_LIST);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const POSTS_PER_PAGE = 9;

  useEffect(() => {
    let isMounted = true;
    const fetchPosts = async () => {
      try {
        const res = await api.get('/cms/posts');
        if (isMounted && res.data && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data
            .filter((p: any) => p.status === 'PUBLISHED')
            .map((p: any) => {
              const staticPost = POSTS_LIST.find((s) => s.slug === p.slug);
              let displayDate = staticPost?.date;
              if (!displayDate && p.createdAt) {
                const d = new Date(p.createdAt);
                if (!isNaN(d.getTime())) {
                  const day = String(d.getDate()).padStart(2, '0');
                  const month = String(d.getMonth() + 1).padStart(2, '0');
                  const year = d.getFullYear();
                  displayDate = `${day} Tháng ${month}, ${year}`;
                }
              }
              return {
                id: p.id,
                slug: p.slug,
                category: p.category || staticPost?.category || 'nganh-bao-bi',
                titleVi: p.title || staticPost?.titleVi,
                titleEn: p.title || staticPost?.titleEn,
                summaryVi: p.summary || staticPost?.summaryVi,
                summaryEn: p.summary || staticPost?.summaryEn,
                image: p.imageUrl || staticPost?.image || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
                categoryNameVi: staticPost?.categoryNameVi || p.category || 'Tin tức',
                categoryNameEn: staticPost?.categoryNameEn || p.category || 'News',
                date: displayDate || 'Vừa cập nhật',
                readTimeVi: staticPost?.readTimeVi || '5 phút đọc',
                readTimeEn: staticPost?.readTimeEn || '5 min read',
                contentHtml: p.contentHtml || staticPost?.contentHtml,
                status: p.status,
                createdAt: p.createdAt,
              };
            });
          if (mapped.length > 0) {
            mapped.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
            // Merge CMS posts with static POSTS_LIST so crawled posts are never lost
            const combined = [
              ...mapped,
              ...POSTS_LIST.filter(p => !mapped.some(m => m.slug === p.slug))
            ];
            setPostsList(combined);
          }
        }
      } catch(err) {
        console.warn('CMS posts fetch failed, falling back to static posts:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchPosts();
    return () => {
      isMounted = false;
    };
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

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const getPaginationItems = () => {
    const items: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
    } else {
      if (currentPage <= 4) {
        items.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        items.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        items.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return items;
  };

  return (
    <div className="pt-24 pb-20">
      <SEO
        title="Tin Tức & Xu Hướng Bao Bì | Vietlabel"
        description="Cập nhật tin tức ngành bao bì & tem nhãn decal, hoạt động doanh nghiệp và các case study bao bì thành công của Vietlabel."
      />

      {/* Header */}
      <motion.section 
        className="relative isolate overflow-hidden bg-gradient-to-br from-[#1E4384] via-[#0a2342] to-[#05172d] text-white py-24 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Animated background */}
        <div className="absolute inset-0 -z-10">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${200 + i * 150}px`,
                height: `${200 + i * 150}px`,
                left: `${-15 + i * 25}%`,
                top: `${-15 + i * 25}%`,
                background: 'radial-gradient(circle, rgba(190,30,45,0.15) 0%, transparent 70%)',
              }}
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 360],
              }}
              transition={{
                duration: 12 + i * 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Floating particles */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white/30"
            style={{
              left: `${8 + i * 10}%`,
              top: `${15 + (i % 4) * 20}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.1, 0.6, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 5 + i * 0.4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.2,
            }}
          />
        ))}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4 px-4 py-2 rounded-full border border-amber-400/40 bg-amber-400/10 inline-block shadow-lg shadow-amber-400/20">
              TIN TỨC & GÓC NHÌN CHUYÊN GIA
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight [text-wrap:balance] mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Thông tin ngành & Hoạt động doanh nghiệp
          </motion.h1>

          <motion.div
            className="mt-6 h-1.5 w-32 mx-auto rounded-full bg-gradient-to-r from-[#BE1E2D] to-[#1E4384]"
            initial={{ width: 0 }}
            animate={{ width: 128 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          <motion.p
            className="mt-6 text-base sm:text-lg text-slate-200 max-w-3xl mx-auto leading-relaxed [text-wrap:balance]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Chia sẻ kiến thức kỹ thuật in ấn, cập nhật xu hướng bao bì xanh toàn cầu và các dự án thiết kế tem nhãn tiêu biểu của Vietlabel.
          </motion.p>
        </div>
      </motion.section>

      {/* Filter and Search Bar */}
      <motion.section 
        className="py-6 bg-white border-b border-slate-200 sticky top-16 z-20 backdrop-blur-md bg-white/95 shadow-sm"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Functional Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-gradient-to-r from-slate-100 to-slate-50 rounded-2xl border border-slate-200">
            {categories.map((cat, i) => (
              <motion.button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-[#1E4384] to-[#0a2342] text-white shadow-lg shadow-[#1E4384]/30'
                    : 'text-slate-600 hover:text-[#1E4384] hover:bg-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                {currentLang === 'vi' ? cat.labelVi : cat.labelEn}
              </motion.button>
            ))}
          </div>

          {/* Search Input */}
          <motion.div 
            className="relative w-full md:w-80"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Tìm kiếm bài viết..."
              className="w-full rounded-2xl border-2 border-slate-200 pl-10 pr-4 py-2.5 text-sm focus:border-[#1E4384] focus:outline-none focus:ring-2 focus:ring-[#1E4384]/20 transition-all shadow-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </motion.div>
        </div>
      </motion.section>

      {/* Posts Grid */}
      <section className="py-20 bg-gradient-to-b from-[#FAFAFC] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length === 0 ? (
            <motion.div 
              className="py-20 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Newspaper className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-700">Không tìm thấy bài viết phù hợp</h3>
              <p className="text-sm text-slate-500 mt-2">Vui lòng thử tìm kiếm với từ khóa khác.</p>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentPosts.map((post, idx) => (
                  <motion.article
                    key={post.id}
                    className="group flex flex-col h-full rounded-3xl bg-white border-2 border-slate-200 overflow-hidden hover:shadow-2xl hover:border-[#BE1E2D]/50 transition-all duration-400"
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: (idx % 3) * 0.12 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                  >
                    <div className="flex flex-col h-full">
                      <Link
                        to={`/tin-tuc/${post.slug}`}
                        className="block relative aspect-[16/10] overflow-hidden bg-slate-100 flex-shrink-0"
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-t from-[#1E4384]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                        <motion.img
                          src={post.image}
                          alt={currentLang === 'vi' ? post.titleVi : post.titleEn}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        />
                        <motion.div 
                          className="absolute top-4 left-4 bg-gradient-to-r from-[#1E4384] to-[#0a2342] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider backdrop-blur-md shadow-lg"
                          initial={{ x: -20, opacity: 0 }}
                          whileInView={{ x: 0, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                        >
                          {currentLang === 'vi' ? post.categoryNameVi : post.categoryNameEn}
                        </motion.div>
                        <motion.div 
                          className="absolute top-4 right-4 bg-white/95 backdrop-blur-md text-[#1E4384] text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-lg border border-slate-200"
                          initial={{ x: 20, opacity: 0 }}
                          whileInView={{ x: 0, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: 0.25 }}
                        >
                          {post.date}
                        </motion.div>
                      </Link>

                      <div className="p-6 flex-grow">
                        <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                          <motion.span 
                            className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-lg font-medium"
                            whileHover={{ scale: 1.05 }}
                          >
                            <Calendar className="w-3.5 h-3.5 text-[#BE1E2D]" />
                            {post.date}
                          </motion.span>
                          <span aria-hidden="true" className="text-slate-300">·</span>
                          <motion.span 
                            className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-lg"
                            whileHover={{ scale: 1.05 }}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            {currentLang === 'vi' ? post.readTimeVi : post.readTimeEn}
                          </motion.span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-[#1E4384] group-hover:text-[#BE1E2D] transition-colors line-clamp-2 leading-snug mb-3">
                          <Link to={`/tin-tuc/${post.slug}`}>
                            {currentLang === 'vi' ? post.titleVi : post.titleEn}
                          </Link>
                        </h3>

                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {currentLang === 'vi' ? post.summaryVi : post.summaryEn}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-0 flex-shrink-0">
                      <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                        <Link
                          to={`/tin-tuc/${post.slug}`}
                          className="inline-flex items-center gap-2 text-xs font-bold text-[#1E4384] group-hover:text-[#BE1E2D] transition-colors group/link"
                        >
                          <span>Xem toàn bộ bài viết</span>
                          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                      </motion.div>
                    </div>
                  </motion.article>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <motion.div 
                  className="mt-16 flex items-center justify-center gap-2 sm:gap-3 flex-wrap"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  {currentPage > 1 && (
                    <motion.button
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="w-12 h-12 rounded-full border-2 border-slate-300 text-slate-700 flex items-center justify-center hover:bg-gradient-to-r hover:from-[#1E4384] hover:to-[#0a2342] hover:text-white hover:border-[#1E4384] transition-all cursor-pointer shadow-sm hover:shadow-lg"
                      aria-label="Trang trước"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </motion.button>
                  )}

                  {getPaginationItems().map((item, index) => {
                    if (item === '...') {
                      return (
                        <span
                          key={`dots-${index}`}
                          className="w-12 h-12 rounded-full border-2 border-slate-200 text-slate-500 flex items-center justify-center text-sm font-semibold select-none"
                        >
                          ...
                        </span>
                      );
                    }

                    const pageNum = Number(item);
                    const isActive = pageNum === currentPage;

                    return (
                      <motion.button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-r from-[#1E4384] to-[#0a2342] text-white border-2 border-[#1E4384] shadow-xl shadow-[#1E4384]/30'
                            : 'border-2 border-slate-300 text-slate-700 hover:border-[#1E4384] hover:text-[#1E4384] hover:bg-slate-50'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {pageNum}
                      </motion.button>
                    );
                  })}

                  {currentPage < totalPages && (
                    <motion.button
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="w-12 h-12 rounded-full border-2 border-slate-300 text-slate-700 flex items-center justify-center hover:bg-gradient-to-r hover:from-[#1E4384] hover:to-[#0a2342] hover:text-white hover:border-[#1E4384] transition-all cursor-pointer shadow-sm hover:shadow-lg"
                      aria-label="Trang tiếp"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  )}
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};
