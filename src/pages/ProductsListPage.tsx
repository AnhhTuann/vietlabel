import React, { useState, useMemo } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Filter,
  Package,
  Layers,
  Check,
  ChevronRight,
  ArrowRight,
  Send,
} from 'lucide-react';
import { SEO } from '../lib/seo';
import { PRODUCT_CATEGORIES, PRODUCTS_LIST, type ProductItem } from '../data/products';
import { LABEL_SOLUTIONS } from '../data/labelSolutions';
import { Button } from '../components/ui/Button';
import { motion } from 'motion/react';

export const ProductsListPage: React.FC = () => {
  const { danhMuc } = useParams<{ danhMuc?: string }>();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const { onOpenQuoteModal } = useOutletContext<{ onOpenQuoteModal: (prod?: string) => void }>();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Current category if URL param present
  const currentCategory = useMemo(() => {
    if (!danhMuc) return null;
    return PRODUCT_CATEGORIES.find((c) => c.slug === danhMuc) || null;
  }, [danhMuc]);

  // Filter products by category, subcategory, search
  const filteredProducts = useMemo(() => {
    return PRODUCTS_LIST.filter((prod) => {
      // Category match
      if (danhMuc && prod.categorySlug !== danhMuc) {
        return false;
      }
      // Subcategory match
      if (selectedSubcategory !== 'all' && prod.subcategoryId !== selectedSubcategory) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchVi = prod.nameVi.toLowerCase().includes(query) || prod.code.toLowerCase().includes(query);
        const matchEn = prod.nameEn.toLowerCase().includes(query) || prod.descriptionEn.toLowerCase().includes(query);
        return matchVi || matchEn;
      }
      return true;
    });
  }, [danhMuc, selectedSubcategory, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const pageTitle = currentCategory
    ? `${currentLang === 'vi' ? currentCategory.nameVi : currentCategory.nameEn} | Vietlabel`
    : 'Danh Mục Sản Phẩm Bao Bì & Tem Nhãn B2B | Vietlabel';

  return (
    <div className="pt-24 pb-20">
      <SEO
        title={pageTitle}
        description="Danh mục các sản phẩm tem nhãn decal cuộn, hộp giấy, túi giấy kraft, thùng carton xuất khẩu đạt chuẩn FSC và ISO 9001 của Vietlabel."
      />

      {/* Hero Header */}
      <motion.section 
        className="relative isolate overflow-hidden bg-gradient-to-br from-[#1E4384] via-[#0a2342] to-[#05172d] text-white py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Animated background */}
        <div className="absolute inset-0 -z-10">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${300 + i * 100}px`,
                height: `${300 + i * 100}px`,
                left: `${-10 + i * 20}%`,
                top: `${-10 + i * 20}%`,
                background: 'radial-gradient(circle, rgba(190,30,45,0.1) 0%, transparent 70%)',
              }}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white/30"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 4) * 20}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.5, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + i * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.2,
            }}
          />
        ))}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {currentCategory
                  ? (currentLang === 'vi' ? currentCategory.nameVi : currentCategory.nameEn)
                  : 'Danh Mục Sản Phẩm Bao Bì Giấy Toàn Diện'}
              </h1>
              <motion.div
                className="mt-4 h-1 w-32 rounded-full bg-gradient-to-r from-[#BE1E2D] to-[#1E4384]"
                initial={{ width: 0 }}
                animate={{ width: 128 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
              <p className="mt-4 text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
                {currentCategory
                  ? (currentLang === 'vi' ? currentCategory.shortDescVi : currentCategory.shortDescEn)
                  : 'Cung ứng trọn gói bao bì hộp giấy, túi giấy, thùng carton, tem nhãn chất lượng cao cho các ngành F&B, Dược mỹ phẩm và Tiêu dùng.'}
              </p>
            </motion.div>

            {/* Quick Quote trigger */}
            <motion.div
              className="shrink-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="primary"
                size="lg"
                onClick={() => onOpenQuoteModal()}
                icon={<Send className="w-5 h-5" />}
                className="shadow-2xl shadow-blue-950/50"
              >
                Nhận báo giá nhanh
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Main Catalog View with 2-level Sidebar */}
      <section className="py-12 bg-[#FAFAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar (4 cols) */}
            <aside className="lg:col-span-3 space-y-6">
              {/* Search Box */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tìm kiếm sản phẩm
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Tên, mã sản phẩm hoặc chất liệu..."
                    className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-xs focus:border-[#1E4384] focus:outline-none focus:ring-1 focus:ring-[#1E4384]"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* 2-Level Tree Category Navigation */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E4384] flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#BE1E2D]" />
                    Danh mục bao bì
                  </h3>
                  {danhMuc && (
                    <Link to="/san-pham" className="text-[11px] text-[#BE1E2D] hover:underline font-semibold">
                      Tất cả
                    </Link>
                  )}
                </div>

                <div className="space-y-1">
                  {PRODUCT_CATEGORIES.map((cat) => {
                    const isActiveCat = cat.slug === danhMuc;
                    return (
                      <div key={cat.id} className="space-y-1">
                        <Link
                          to={`/san-pham/${cat.slug}`}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                            isActiveCat
                              ? 'bg-[#1E4384] text-white shadow-sm'
                              : 'text-slate-700 hover:bg-slate-100 hover:text-[#1E4384]'
                          }`}
                          onClick={() => {
                            setSelectedSubcategory('all');
                            setCurrentPage(1);
                          }}
                        >
                          <span className="truncate">{currentLang === 'vi' ? cat.nameVi : cat.nameEn}</span>
                          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActiveCat ? 'rotate-90 text-amber-400' : 'text-slate-400'}`} />
                        </Link>

                        {/* Level 2 Subcategories if this category is selected */}
                        {isActiveCat && cat.subcategories.length > 0 && (
                          <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-slate-200 ml-3">
                            <button
                              onClick={() => {
                                setSelectedSubcategory('all');
                                setCurrentPage(1);
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                                selectedSubcategory === 'all'
                                  ? 'bg-red-50 text-[#BE1E2D] font-bold'
                                  : 'text-slate-600 hover:text-[#1E4384]'
                              }`}
                            >
                              Tất cả phân loại con
                            </button>
                            {cat.subcategories.map((sub) => (
                              <button
                                key={sub.id}
                                onClick={() => {
                                  setSelectedSubcategory(sub.id);
                                  setCurrentPage(1);
                                }}
                                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors truncate ${
                                  selectedSubcategory === sub.id
                                    ? 'bg-red-50 text-[#BE1E2D] font-bold'
                                    : 'text-slate-600 hover:text-[#1E4384]'
                                }`}
                              >
                                {currentLang === 'vi' ? sub.nameVi : sub.nameEn}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* Products Grid (9 cols) */}
            <div className="lg:col-span-9 space-y-6">
              
              {danhMuc === 'tem-nhan' && (
                <div className="mb-10">
                  <div className="mb-6">
                    <h2 className="text-xl sm:text-2xl font-black text-[#1E4384] uppercase tracking-tight">Giải pháp Tem nhãn theo ngành nghề</h2>
                    <p className="text-sm text-slate-500 mt-2">12 giải pháp tem nhãn chuyên dụng được thiết kế riêng biệt để đáp ứng tiêu chuẩn khắt khe của từng ngành công nghiệp.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {LABEL_SOLUTIONS.map((solution, sIdx) => (
                      <motion.div
                        key={solution.id}
                        className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-xl hover:border-[#BE1E2D]/30 transition-all duration-300 group flex flex-col h-full cursor-pointer"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: (sIdx % 3) * 0.08 }}
                        whileHover={{ y: -6, scale: 1.02 }}
                      >
                        <motion.div
                          className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#1E4384] mb-4 group-hover:bg-[#BE1E2D] group-hover:text-white transition-colors"
                          whileHover={{ rotate: 12, scale: 1.1 }}
                        >
                          <solution.icon className="w-5 h-5" />
                        </motion.div>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-2 leading-snug group-hover:text-[#BE1E2D] transition-colors line-clamp-2">
                          {currentLang === 'vi' ? solution.titleVi : solution.titleEn}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed line-clamp-4 mt-auto">
                          {currentLang === 'vi' ? solution.descVi : solution.descEn}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Top toolbar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
                <div>
                  Tìm thấy <strong className="text-slate-900 font-bold">{filteredProducts.length}</strong> sản phẩm bao bì
                  {danhMuc && (
                    <span> trong chuyên mục <strong>{currentCategory?.nameVi}</strong></span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Trang: {currentPage} / {totalPages}</span>
                </div>
              </div>

              {/* Grid of Product Cards */}
              {paginatedProducts.length === 0 ? (
                <motion.div 
                  className="bg-white rounded-2xl border border-slate-200 p-12 text-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  </motion.div>
                  <h3 className="text-base font-bold text-slate-800">Không tìm thấy sản phẩm phù hợp</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Hãy thử xóa từ khóa tìm kiếm hoặc chọn danh mục khác, hoặc gửi quy cách trực tiếp cho Vietlabel để thiết kế mẫu riêng.
                  </p>
                  <div className="mt-6 flex justify-center gap-3">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedSubcategory('all');
                        }}
                      >
                        Xóa bộ lọc
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onOpenQuoteModal()}
                      >
                        Yêu cầu thiết kế riêng
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedProducts.map((prod, pIdx) => (
                    <motion.div
                      key={prod.id}
                      className="group flex flex-col h-full rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#BE1E2D]/50 transition-all duration-400"
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: (pIdx % 6) * 0.08 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex flex-col h-full">
                        {/* Image banner */}
                        <Link
                          to={`/san-pham/${prod.categorySlug}/${prod.slug}`}
                          className="block relative aspect-[4/3] bg-slate-100 overflow-hidden group flex-shrink-0"
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-t from-[#1E4384]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          />
                          <motion.img
                            src={prod.heroImage}
                            alt={currentLang === 'vi' ? prod.nameVi : prod.nameEn}
                            className="w-full h-full object-cover object-center"
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                            onError={(e) => {
                              e.currentTarget.src = '/images/vietlabel/hero-banner.webp';
                            }}
                          />
                          <motion.div
                            className="absolute top-3 left-3 bg-[#1E4384]/95 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm font-mono shadow-lg"
                            initial={{ x: -20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                          >
                            {prod.code}
                          </motion.div>
                          {prod.isFeatured && (
                            <motion.div
                              className="absolute top-3 right-3 bg-[#BE1E2D] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg"
                              animate={{ 
                                scale: [1, 1.1, 1],
                                rotate: [0, -5, 5, -5, 0]
                              }}
                              transition={{ 
                                duration: 2, 
                                repeat: Infinity,
                                repeatDelay: 3
                              }}
                            >
                              Nổi bật
                            </motion.div>
                          )}
                        </Link>

                        {/* Info */}
                        <div className="p-5 flex flex-col flex-grow">
                          <motion.span 
                            className="text-[11px] font-semibold text-[#BE1E2D] uppercase tracking-wider inline-block"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3 }}
                          >
                            {currentLang === 'vi' ? prod.categoryNameVi : prod.categoryNameEn}
                          </motion.span>

                          <h3 className="text-sm sm:text-base font-bold text-[#1E4384] group-hover:text-[#BE1E2D] transition-colors line-clamp-2 mt-1 leading-snug">
                            <Link to={`/san-pham/${prod.categorySlug}/${prod.slug}`}>
                              {currentLang === 'vi' ? prod.nameVi : prod.nameEn}
                            </Link>
                          </h3>

                          <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed min-h-[2.5rem]">
                            {currentLang === 'vi' ? prod.descriptionVi : prod.descriptionEn}
                          </p>

                          {/* Quick specs box */}
                          <div className="mt-4 p-3 bg-slate-50 rounded-xl space-y-1.5 text-[11px] text-slate-600 border border-slate-100">
                            <div className="truncate">
                              <strong className="text-slate-800">Chất liệu:</strong>{' '}
                              {currentLang === 'vi' ? prod.specs.materialVi : prod.specs.materialEn}
                            </div>
                            <div className="truncate">
                              <strong className="text-slate-800">MOQ:</strong> {prod.specs.moq}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions footer */}
                      <div className="p-5 pt-0 flex items-center justify-between gap-2 flex-shrink-0">
                        <Link
                          to={`/san-pham/${prod.categorySlug}/${prod.slug}`}
                          className="text-xs font-bold text-[#1E4384] hover:text-[#BE1E2D] flex items-center gap-1 transition-colors group/link"
                        >
                          <span>Chi tiết</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                        </Link>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => onOpenQuoteModal(prod.nameVi)}
                          >
                            Báo giá
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="pt-6 flex items-center justify-center gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          currentPage === pageNum
                            ? 'bg-[#1E4384] text-white shadow-sm'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
