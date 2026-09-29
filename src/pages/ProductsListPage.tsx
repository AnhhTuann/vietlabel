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
import { Button } from '../components/ui/Button';

export const ProductsListPage: React.FC = () => {
  const { danhMuc } = useParams<{ danhMuc?: string }>();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const { onOpenQuoteModal } = useOutletContext<{ onOpenQuoteModal: (prod?: string) => void }>();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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
      <section className="bg-[#0B2A4A] text-white py-14 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
                <Link to="/" className="hover:underline">Trang chủ</Link>
                <span>/</span>
                <Link to="/san-pham" className="hover:underline">Sản phẩm</Link>
                {currentCategory && (
                  <>
                    <span>/</span>
                    <span className="text-white">
                      {currentLang === 'vi' ? currentCategory.nameVi : currentCategory.nameEn}
                    </span>
                  </>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                {currentCategory
                  ? (currentLang === 'vi' ? currentCategory.nameVi : currentCategory.nameEn)
                  : 'Danh Mục Sản Phẩm Bao Bì Giấy Toàn Diện'}
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                {currentCategory
                  ? (currentLang === 'vi' ? currentCategory.shortDescVi : currentCategory.shortDescEn)
                  : 'Cung ứng trọn gói bao bì hộp giấy, túi giấy, thùng carton, tem nhãn chất lượng cao cho các ngành F&B, Dược mỹ phẩm và Tiêu dùng.'}
              </p>
            </div>

            {/* Quick Quote trigger */}
            <div className="shrink-0">
              <Button
                variant="primary"
                size="md"
                onClick={() => onOpenQuoteModal()}
                icon={<Send className="w-4 h-4" />}
              >
                Gửi quy cách nhận báo giá
              </Button>
            </div>
          </div>
        </div>
      </section>

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
                    className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-xs focus:border-[#0B2A4A] focus:outline-none focus:ring-1 focus:ring-[#0B2A4A]"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* 2-Level Tree Category Navigation */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B2A4A] flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#E8531D]" />
                    Danh mục bao bì
                  </h3>
                  {danhMuc && (
                    <Link to="/san-pham" className="text-[11px] text-[#E8531D] hover:underline font-semibold">
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
                              ? 'bg-[#0B2A4A] text-white shadow-sm'
                              : 'text-slate-700 hover:bg-slate-100 hover:text-[#0B2A4A]'
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
                                  ? 'bg-orange-50 text-[#E8531D] font-bold'
                                  : 'text-slate-600 hover:text-[#0B2A4A]'
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
                                    ? 'bg-orange-50 text-[#E8531D] font-bold'
                                    : 'text-slate-600 hover:text-[#0B2A4A]'
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
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-800">Không tìm thấy sản phẩm phù hợp</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Hãy thử xóa từ khóa tìm kiếm hoặc chọn danh mục khác, hoặc gửi quy cách trực tiếp cho Vietlabel để thiết kế mẫu riêng.
                  </p>
                  <div className="mt-6 flex justify-center gap-3">
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
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onOpenQuoteModal()}
                    >
                      Yêu cầu thiết kế riêng
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="group flex flex-col justify-between rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                      <div>
                        {/* Image banner */}
                        <Link
                          to={`/san-pham/${prod.categorySlug}/${prod.slug}`}
                          className="block relative aspect-[4/3] bg-slate-100 overflow-hidden"
                        >
                          <img
                            src={prod.heroImage}
                            alt={currentLang === 'vi' ? prod.nameVi : prod.nameEn}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                            loading="lazy"
                          />
                          <div className="absolute top-3 left-3 bg-[#0B2A4A]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider backdrop-blur-xs font-mono">
                            {prod.code}
                          </div>
                          {prod.isFeatured && (
                            <div className="absolute top-3 right-3 bg-[#E8531D] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                              Nổi bật
                            </div>
                          )}
                        </Link>

                        {/* Info */}
                        <div className="p-5">
                          <span className="text-[11px] font-semibold text-[#E8531D] uppercase tracking-wider">
                            {currentLang === 'vi' ? prod.categoryNameVi : prod.categoryNameEn}
                          </span>

                          <h3 className="text-sm sm:text-base font-bold text-[#0B2A4A] group-hover:text-[#E8531D] transition-colors line-clamp-2 mt-1 leading-snug">
                            <Link to={`/san-pham/${prod.categorySlug}/${prod.slug}`}>
                              {currentLang === 'vi' ? prod.nameVi : prod.nameEn}
                            </Link>
                          </h3>

                          <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
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
                      <div className="p-5 pt-0 flex items-center justify-between gap-2">
                        <Link
                          to={`/san-pham/${prod.categorySlug}/${prod.slug}`}
                          className="text-xs font-bold text-[#0B2A4A] hover:text-[#E8531D] flex items-center gap-1 transition-colors"
                        >
                          <span>Chi tiết</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>

                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => onOpenQuoteModal(prod.nameVi)}
                        >
                          Báo giá
                        </Button>
                      </div>
                    </div>
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
                            ? 'bg-[#0B2A4A] text-white shadow-sm'
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
