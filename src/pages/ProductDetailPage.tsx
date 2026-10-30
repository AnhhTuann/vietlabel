import React, { useState, useMemo } from 'react';
import { useParams, Link, useOutletContext, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
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
  Star,
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
    return PRODUCTS_LIST.find((p) => p.slug === slug);
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
          <motion.div
            className="flex items-center gap-2 text-xs text-slate-600"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="hover:text-[#BE1E2D]">Trang chủ</Link>
            <span>/</span>
            <Link to="/san-pham" className="hover:text-[#BE1E2D]">Sản phẩm</Link>
            <span>/</span>
            <Link to={`/san-pham/${product.categorySlug}`} className="hover:text-[#BE1E2D]">
              {currentLang === 'vi' ? product.categoryNameVi : product.categoryNameEn}
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold truncate max-w-xs">{productName}</span>
          </motion.div>
        </div>
      </section>

      {/* Main Product Showcase */}
      <motion.section 
        className="py-16 bg-gradient-to-b from-white to-[#FAFAFC]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Gallery Column (6 cols) */}
            <motion.div
              className="lg:col-span-6 space-y-4"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <motion.div 
                className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 border-2 border-slate-200 shadow-xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage || product.heroImage}
                    src={selectedImage || product.heroImage}
                    alt={productName}
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    onError={(e) => {
                      e.currentTarget.src = '/images/vietlabel/hero-banner.webp';
                    }}
                  />
                </AnimatePresence>
                <motion.div 
                  className="absolute top-4 left-4 bg-gradient-to-r from-[#1E4384] to-[#0a2342] text-white font-mono text-xs font-bold px-4 py-2 rounded-full backdrop-blur-md shadow-lg"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  Mã: {product.code}
                </motion.div>
              </motion.div>

              {/* Thumbnails */}
              {product.gallery.length > 1 && (
                <motion.div 
                  className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {product.gallery.map((img, i) => (
                    <motion.button
                      key={i}
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-24 h-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        (selectedImage || product.heroImage) === img
                          ? 'border-[#BE1E2D] shadow-xl shadow-[#BE1E2D]/30 ring-2 ring-[#BE1E2D]/20'
                          : 'border-slate-200 opacity-60 hover:opacity-100 hover:border-[#1E4384]'
                      }`}
                      whileHover={{ scale: 1.1, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <img
                        src={img}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = '/images/vietlabel/hero-banner.webp';
                        }}
                      />
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {/* Trust Badges */}
              <motion.div 
                className="p-4 rounded-2xl bg-gradient-to-br from-[#FAFAFC] to-white border border-slate-200 shadow-md grid grid-cols-2 gap-3 text-xs text-slate-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {[
                  { icon: ShieldCheck, color: 'text-emerald-500', text: 'Chứng nhận chuẩn FSC® & ISO' },
                  { icon: Clock, color: 'text-blue-500', text: 'Thời gian sản xuất 5-7 ngày' },
                  { icon: Sparkles, color: 'text-amber-500', text: 'Duyệt mẫu mockup miễn phí' },
                  { icon: FileCheck, color: 'text-purple-500', text: 'Bảo hành chất lượng 100%' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-2 p-3 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all"
                    whileHover={{ scale: 1.05, y: -2 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + i * 0.05 }}
                  >
                    <item.icon className={`w-5 h-5 ${item.color} shrink-0`} />
                    <span className="font-medium text-[11px] sm:text-xs">{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Product Details & Specs Column (6 cols) */}
            <motion.div
              className="lg:col-span-6 space-y-6"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.span 
                  className="text-xs font-bold uppercase tracking-wider text-[#BE1E2D] px-3 py-1.5 bg-gradient-to-r from-red-50 to-orange-50 rounded-full border border-red-100 inline-block shadow-sm"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentLang === 'vi' ? product.categoryNameVi : product.categoryNameEn}
                </motion.span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E4384] mt-3 leading-tight">
                  {productName}
                </h1>
                <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
                  {currentLang === 'vi' ? product.descriptionVi : product.descriptionEn}
                </p>
              </motion.div>

              {/* Technical Specifications Table */}
              <motion.div
                className="rounded-3xl border-2 border-slate-200 overflow-hidden bg-gradient-to-br from-[#FAFAFC] to-white shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-gradient-to-r from-[#1E4384] to-[#0a2342] px-5 py-3 border-b border-slate-200 font-bold text-xs uppercase tracking-wider text-white">
                  Thông số kỹ thuật tiêu chuẩn
                </div>
                <div className="divide-y divide-slate-200/80 text-xs">
                  <div className="grid grid-cols-3 p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-colors group">
                    <span className="font-semibold text-slate-500 group-hover:text-[#1E4384]">Chất liệu giấy:</span>
                    <span className="col-span-2 text-slate-800 font-medium">
                      {currentLang === 'vi' ? product.specs.materialVi : product.specs.materialEn}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-colors group">
                    <span className="font-semibold text-slate-500 group-hover:text-[#1E4384]">Kích thước tham khảo:</span>
                    <span className="col-span-2 text-slate-800 font-medium">
                      {currentLang === 'vi' ? product.specs.dimensionsVi : product.specs.dimensionsEn}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-colors group">
                    <span className="font-semibold text-slate-500 group-hover:text-[#1E4384]">Công nghệ in ấn:</span>
                    <span className="col-span-2 text-slate-800 font-medium">
                      {currentLang === 'vi' ? product.specs.printTechniqueVi : product.specs.printTechniqueEn}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-colors group">
                    <span className="font-semibold text-slate-500 group-hover:text-[#1E4384]">Gia công hoàn thiện:</span>
                    <span className="col-span-2 text-slate-800 font-medium">
                      {currentLang === 'vi' ? product.specs.finishingVi : product.specs.finishingEn}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-colors group">
                    <span className="font-semibold text-slate-500 group-hover:text-[#1E4384]">Số lượng tối thiểu (MOQ):</span>
                    <span className="col-span-2 text-[#BE1E2D] font-bold font-mono">
                      {product.specs.moq}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-colors group">
                    <span className="font-semibold text-slate-500 group-hover:text-[#1E4384]">Tiến độ giao hàng:</span>
                    <span className="col-span-2 text-slate-800 font-medium">
                      {currentLang === 'vi' ? product.specs.leadTimeVi : product.specs.leadTimeEn}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Outstanding Features */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1E4384] mb-4 flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#BE1E2D]" />
                  Đặc điểm nổi bật & Lợi ích
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                  {(currentLang === 'vi' ? product.featuresVi : product.featuresEn).map((f, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 shadow-sm"
                      whileHover={{ x: 5, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="font-medium">{f}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Applications */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1E4384] mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#BE1E2D]" />
                  Ngành hàng ứng dụng
                </h3>
                <div className="flex flex-wrap gap-2 text-xs">
                  {(currentLang === 'vi' ? product.applicationsVi : product.applicationsEn).map((app, i) => (
                    <motion.span
                      key={i}
                      className="px-4 py-2 bg-gradient-to-r from-[#1E4384] to-[#0a2342] text-white rounded-lg font-medium shadow-md hover:shadow-lg"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.03 }}
                    >
                      {app}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Quotation CTA Buttons */}
              <motion.div 
                className="pt-6 flex flex-wrap items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => onOpenQuoteModal(product.nameVi)}
                    icon={<Send className="w-5 h-5" />}
                    className="shadow-xl shadow-[#BE1E2D]/30"
                  >
                    Yêu cầu báo giá sản phẩm này
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/san-pham">
                    <Button variant="outline" size="lg" icon={<ArrowLeft className="w-4 h-4" />} iconPosition="left">
                      Về danh mục
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <motion.section 
          className="py-20 bg-gradient-to-b from-[#FAFAFC] to-white border-t border-slate-200"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              className="text-2xl sm:text-3xl font-extrabold text-[#1E4384] mb-10 flex items-center gap-3"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Layers className="w-6 h-6 text-[#BE1E2D]" />
              Sản phẩm cùng phân khúc
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map((rel, rIdx) => (
                <motion.div
                  key={rel.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: rIdx * 0.15 }}
                  whileHover={{ y: -8 }}
                >
                  <Link
                    to={`/san-pham/${rel.categorySlug}/${rel.slug}`}
                    className="group block rounded-3xl bg-white border-2 border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all"
                  >
                    <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                      <motion.img
                        src={rel.heroImage}
                        alt={rel.nameVi}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        onError={(e) => {
                          e.currentTarget.src = '/images/vietlabel/hero-banner.webp';
                        }}
                      />
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-t from-[#1E4384]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      />
                    </div>
                    <div className="p-5">
                      <motion.span 
                        className="text-[11px] font-bold text-[#BE1E2D] uppercase tracking-wider"
                        whileHover={{ scale: 1.05 }}
                      >
                        {rel.code}
                      </motion.span>
                      <h3 className="text-base font-bold text-[#1E4384] group-hover:text-[#BE1E2D] transition-colors mt-2 line-clamp-2">
                        {currentLang === 'vi' ? rel.nameVi : rel.nameEn}
                      </h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
};
