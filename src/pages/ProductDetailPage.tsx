import React, { useState, useMemo } from 'react';
import { useParams, Link, useOutletContext, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  CheckCircle2,
  Package,
  Layers,
  Sparkles,
  Clock,
  ShieldCheck,
  Send,
  FileCheck,
} from 'lucide-react';
import { SEO } from '../lib/seo';
import { PRODUCTS_LIST } from '../data/products';
import { Button } from '../components/ui/Button';

export const ProductDetailPage: React.FC = () => {
  const { danhMuc, slug } = useParams<{ danhMuc: string; slug: string }>();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const navigate = useNavigate();
  const { onOpenQuoteModal } = useOutletContext<{ onOpenQuoteModal: (prod?: string) => void }>();

  // Find product by slug
  const product = useMemo(() => {
    return PRODUCTS_LIST.find((p) => p.slug === slug) || PRODUCTS_LIST[0];
  }, [slug]);

  const [selectedImage, setSelectedImage] = useState(product?.heroImage || '');

  // Related products in the same category
  const relatedProducts = useMemo(() => {
    return PRODUCTS_LIST.filter(
      (p) => p.categoryId === product?.categoryId && p.id !== product?.id
    ).slice(0, 3);
  }, [product]);

  if (!product) {
    return (
      <div className="pt-32 pb-20 text-center">
        <h2 className="text-xl font-bold">Không tìm thấy sản phẩm</h2>
        <Button className="mt-4" onClick={() => navigate('/san-pham')}>
          Quay lại danh sách sản phẩm
        </Button>
      </div>
    );
  }

  const productName = currentLang === 'vi' ? product.nameVi : product.nameEn;

  return (
    <div className="pt-24 pb-20">
      <SEO
        title={`${productName} | Vietlabel`}
        description={currentLang === 'vi' ? product.descriptionVi : product.descriptionEn}
        ogImage={product.heroImage}
        ogType="product"
      />

      {/* Breadcrumb Header */}
      <section className="bg-slate-100 py-4 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Link to="/" className="hover:text-[#BE1E2D]">Trang chủ</Link>
            <span>/</span>
            <Link to="/san-pham" className="hover:text-[#BE1E2D]">Sản phẩm</Link>
            <span>/</span>
            <Link to={`/san-pham/${product.categorySlug}`} className="hover:text-[#BE1E2D]">
              {currentLang === 'vi' ? product.categoryNameVi : product.categoryNameEn}
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold truncate max-w-xs">{productName}</span>
          </div>
        </div>
      </section>

      {/* Main Product Showcase */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Gallery Column (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-md">
                <img
                  src={selectedImage || product.heroImage}
                  alt={productName}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-[#1E4384]/90 text-white font-mono text-xs font-bold px-3 py-1 rounded-md backdrop-blur-xs">
                  Mã: {product.code}
                </div>
              </div>

              {/* Thumbnails */}
              {product.gallery.length > 1 && (
                <div className="flex items-center gap-3">
                  {product.gallery.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedImage === img
                          ? 'border-[#BE1E2D] shadow-sm'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust Badges */}
              <div className="p-4 rounded-2xl bg-[#FAFAFC] border border-slate-200 grid grid-cols-2 gap-3 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Chứng nhận chuẩn FSC® & ISO</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Thời gian sản xuất 5-7 ngày</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Duyệt mẫu mockup miễn phí</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-purple-500 shrink-0" />
                  <span>Bảo hành chất lượng 100%</span>
                </div>
              </div>
            </div>

            {/* Product Details & Specs Column (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#BE1E2D]">
                  {currentLang === 'vi' ? product.categoryNameVi : product.categoryNameEn}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E4384] mt-1.5 leading-snug">
                  {productName}
                </h1>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  {currentLang === 'vi' ? product.descriptionVi : product.descriptionEn}
                </p>
              </div>

              {/* Technical Specifications Table */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-[#FAFAFC]">
                <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 font-bold text-xs uppercase tracking-wider text-[#1E4384]">
                  Thông số kỹ thuật tiêu chuẩn
                </div>
                <div className="divide-y divide-slate-200/80 text-xs">
                  <div className="grid grid-cols-3 p-3">
                    <span className="font-semibold text-slate-500">Chất liệu giấy:</span>
                    <span className="col-span-2 text-slate-800 font-medium">
                      {currentLang === 'vi' ? product.specs.materialVi : product.specs.materialEn}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 p-3">
                    <span className="font-semibold text-slate-500">Kích thước tham khảo:</span>
                    <span className="col-span-2 text-slate-800 font-medium">
                      {currentLang === 'vi' ? product.specs.dimensionsVi : product.specs.dimensionsEn}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 p-3">
                    <span className="font-semibold text-slate-500">Công nghệ in ấn:</span>
                    <span className="col-span-2 text-slate-800 font-medium">
                      {currentLang === 'vi' ? product.specs.printTechniqueVi : product.specs.printTechniqueEn}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 p-3">
                    <span className="font-semibold text-slate-500">Gia công hoàn thiện:</span>
                    <span className="col-span-2 text-slate-800 font-medium">
                      {currentLang === 'vi' ? product.specs.finishingVi : product.specs.finishingEn}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 p-3">
                    <span className="font-semibold text-slate-500">Số lượng tối thiểu (MOQ):</span>
                    <span className="col-span-2 text-[#BE1E2D] font-bold font-mono">
                      {product.specs.moq}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 p-3">
                    <span className="font-semibold text-slate-500">Tiến độ giao hàng:</span>
                    <span className="col-span-2 text-slate-800 font-medium">
                      {currentLang === 'vi' ? product.specs.leadTimeVi : product.specs.leadTimeEn}
                    </span>
                  </div>
                </div>
              </div>

              {/* Outstanding Features */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2.5">
                  Đặc điểm nổi bật & Lợi ích
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {(currentLang === 'vi' ? product.featuresVi : product.featuresEn).map((f, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Applications */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2.5">
                  Ngành hàng ứng dụng
                </h3>
                <div className="flex flex-wrap gap-2 text-xs">
                  {(currentLang === 'vi' ? product.applicationsVi : product.applicationsEn).map((app, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-slate-100 rounded-lg text-slate-700 border border-slate-200"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quotation CTA Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => onOpenQuoteModal(product.nameVi)}
                  icon={<Send className="w-5 h-5" />}
                >
                  Yêu cầu báo giá sản phẩm này
                </Button>
                <Link to="/san-pham">
                  <Button variant="outline" size="lg" icon={<ArrowLeft className="w-4 h-4" />} iconPosition="left">
                    Về danh mục
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-[#FAFAFC] border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-[#1E4384] mb-8">Sản phẩm cùng phân khúc</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/san-pham/${rel.categorySlug}/${rel.slug}`}
                  className="group rounded-2xl bg-white border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                    <img
                      src={rel.heroImage}
                      alt={rel.nameVi}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-bold text-[#BE1E2D] uppercase">
                      {rel.code}
                    </span>
                    <h3 className="text-sm font-bold text-[#1E4384] group-hover:text-[#BE1E2D] transition-colors mt-0.5 line-clamp-1">
                      {currentLang === 'vi' ? rel.nameVi : rel.nameEn}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
