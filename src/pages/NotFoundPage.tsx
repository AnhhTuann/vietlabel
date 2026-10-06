import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, PackageSearch } from 'lucide-react';
import { SEO } from '../lib/seo';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-24 pb-16 px-4">
      <SEO
        title="404 - Không Tìm Thấy Trang | Vietlabel"
        description="Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển."
      />

      <div className="max-w-md w-full text-center p-8 rounded-3xl bg-white border border-slate-200 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-red-100 text-[#BE1E2D] flex items-center justify-center mx-auto mb-4">
          <PackageSearch className="w-8 h-8" />
        </div>
        <span className="text-4xl font-extrabold font-mono text-[#1E4384]">404</span>
        <h1 className="text-xl font-bold text-slate-800 mt-2">Trang không tồn tại</h1>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          Địa chỉ trang web bạn truy cập có thể đã thay đổi hoặc không còn khả dụng trên hệ thống Vietlabel.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/" className="w-full sm:w-auto">
            <Button variant="primary" size="sm" icon={<Home className="w-4 h-4" />}>
              Về Trang chủ
            </Button>
          </Link>
          <Link to="/san-pham" className="w-full sm:w-auto">
            <Button variant="outline" size="sm" icon={<ArrowLeft className="w-4 h-4" />} iconPosition="left">
              Xem Sản phẩm
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
