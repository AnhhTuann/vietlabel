import { ArrowRight, Home, MessageCircle, Newspaper, PackageSearch, Search } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../lib/seo';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="relative isolate flex min-h-screen items-center overflow-hidden bg-gradient-to-br from-[#F5F7FA] via-white to-[#E8EDF3] px-4 py-16 sm:px-6 lg:px-8">
      <SEO
        title="404 - Không Tìm Thấy Trang | Vietlabel"
        description="Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển."
        noindex
      />

      {/* Floating Particles */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-[#1E4384]/10 to-[#BE1E2D]/10"
            initial={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              width: Math.random() * 60 + 20,
              height: Math.random() * 60 + 20,
            }}
          />
        ))}
      </div>

      {/* Grid Pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-30 [background-image:linear-gradient(to_right,#dbe3ee_1px,transparent_1px),linear-gradient(to_bottom,#dbe3ee_1px,transparent_1px)] [background-size:48px_48px]"
      />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1fr_0.85fr]">
        <motion.section
          aria-labelledby="not-found-title"
          className="max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Error Badge */}
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#BE1E2D] bg-white px-4 py-2 text-xs font-bold uppercase text-[#1E4384] shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <PackageSearch className="h-4 w-4 text-[#BE1E2D]" aria-hidden="true" />
            </motion.div>
            Lỗi 404
          </motion.div>

          {/* Title */}
          <motion.h1
            id="not-found-title"
            className="mt-8 bg-gradient-to-r from-[#1E4384] via-[#2a5aa0] to-[#BE1E2D] bg-clip-text text-4xl font-extrabold leading-tight text-transparent sm:text-6xl [text-wrap:balance]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            Trang này không tồn tại hoặc đã chuyển địa chỉ.
          </motion.h1>

          {/* Description */}
          <motion.p
            className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Liên kết có thể đã cũ hoặc được nhập chưa chính xác. Bạn có thể tiếp tục từ một trong
            những mục dưới đây.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            className="mt-10 flex flex-col gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <Link
              to="/"
              className="group relative inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-[#BE1E2D] to-[#d12d3e] px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl hover:shadow-[#BE1E2D]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BE1E2D] focus-visible:ring-offset-2"
            >
              <Home className="h-5 w-5" aria-hidden="true" />
              Về trang chủ
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link
              to="/san-pham"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border-2 border-[#1E4384] bg-white px-6 py-3 text-sm font-bold text-[#1E4384] shadow-md transition-all hover:border-[#BE1E2D] hover:bg-gradient-to-r hover:from-white hover:to-[#FFF5F5] hover:text-[#BE1E2D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4384] focus-visible:ring-offset-2"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
              Khám phá sản phẩm
            </Link>
          </motion.div>

          {/* Useful Links */}
          <motion.nav
            aria-label="Liên kết hữu ích"
            className="mt-12 border-t-2 border-slate-200 pt-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-sm font-bold uppercase text-slate-500">Có thể bạn đang tìm</p>
            <div className="mt-4 flex flex-wrap gap-x-8 gap-y-4">
              <Link
                to="/tin-tuc"
                className="group inline-flex items-center gap-2 text-base font-semibold text-[#1E4384] transition-colors hover:text-[#BE1E2D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4384]"
              >
                <Newspaper className="h-5 w-5 transition-transform group-hover:scale-110" aria-hidden="true" />
                Tin tức
              </Link>
              <Link
                to="/lien-he"
                className="group inline-flex items-center gap-2 text-base font-semibold text-[#1E4384] transition-colors hover:text-[#BE1E2D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4384]"
              >
                <MessageCircle className="h-5 w-5 transition-transform group-hover:scale-110" aria-hidden="true" />
                Liên hệ tư vấn
              </Link>
            </div>
          </motion.nav>
        </motion.section>

        {/* 404 Visual */}
        <motion.div
          aria-hidden="true"
          className="relative hidden aspect-[4/3] overflow-hidden rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-[#1E4384] to-[#BE1E2D] shadow-2xl sm:block"
          initial={{ opacity: 0, x: 20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        >
          <img
            src="/images/vietlabel/hero-banner.webp"
            alt=""
            className="h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1E4384]/80 via-[#2a5aa0]/60 to-[#BE1E2D]/50" />
          
          {/* 404 Text */}
          <motion.span
            className="absolute -bottom-8 -left-3 font-mono text-[clamp(10rem,24vw,19rem)] font-black leading-none text-white/95 sm:-bottom-10 sm:-left-5"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            404
          </motion.span>

          {/* Decorative Elements */}
          <motion.div
            className="absolute bottom-6 right-6 h-20 w-2 rounded-full bg-gradient-to-t from-[#BE1E2D] to-[#1E4384]"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          />
          <motion.div
            className="absolute top-6 right-6 h-2 w-20 rounded-full bg-gradient-to-l from-[#BE1E2D] to-[#1E4384]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          />
          
          {/* Floating icon */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Search className="h-16 w-16 text-white/30" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
