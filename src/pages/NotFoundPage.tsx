import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, PackageSearch } from 'lucide-react';
import { motion } from 'motion/react';
import { SEO } from '../lib/seo';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center pt-24 pb-16 px-4 overflow-hidden">
      <SEO
        title="404 - Không Tìm Thấy Trang | Vietlabel"
        description="Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển."
      />

      {/* Ambient background rings */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-96 h-96 rounded-full border border-blue-100/60"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full border border-red-100/40"
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <motion.div
        className="relative max-w-md w-full text-center p-8 rounded-3xl bg-white/95 backdrop-blur-sm border border-slate-200 shadow-xl"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <motion.div
          className="w-16 h-16 rounded-2xl bg-red-100 text-[#BE1E2D] flex items-center justify-center mx-auto mb-4 shadow-sm"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <PackageSearch className="w-8 h-8" />
        </motion.div>
        
        <motion.span
          className="block text-5xl font-extrabold font-mono text-[#1E4384] tracking-wider"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
        >
          404
        </motion.span>
        
        <h1 className="text-xl font-bold text-slate-800 mt-2">Trang không tồn tại</h1>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          Địa chỉ trang web bạn truy cập có thể đã thay đổi hoặc không còn khả dụng trên hệ thống Vietlabel.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
            <Link to="/" className="w-full sm:w-auto block">
              <Button variant="primary" size="sm" icon={<Home className="w-4 h-4" />}>
                Về Trang chủ
              </Button>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
            <Link to="/san-pham" className="w-full sm:w-auto block">
              <Button variant="outline" size="sm" icon={<ArrowLeft className="w-4 h-4" />} iconPosition="left">
                Xem Sản phẩm
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
