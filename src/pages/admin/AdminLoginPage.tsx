import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight, Sparkles, KeyRound } from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { Button } from '../../components/ui/Button';

export const AdminLoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotNotice, setShowForgotNotice] = useState(false);

  const from = (location.state as any)?.from || '/admin';

  if (isAuthenticated) {
    navigate('/admin', { replace: true });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Đăng nhập không thành công.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0B2A4A] to-slate-900 flex items-center justify-center p-4">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>Đăng nhập Quản trị | Vietlabel CRM</title>
      </Helmet>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 border border-slate-200">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#E8531D] to-orange-400 mx-auto flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-[#0B2A4A]">Đăng Nhập Quản Trị</h1>
          <p className="text-xs text-slate-500">
            Hệ thống CRM & Hộp thư trực tiếp B2B Vietlabel Packaging
          </p>
        </div>

        {/* Error Callout */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Email làm việc</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sales@vietlabel.com.vn"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-[#E8531D] focus:ring-1 focus:ring-[#E8531D] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Mật khẩu</label>
              <button
                type="button"
                onClick={() => setShowForgotNotice(true)}
                className="text-[11px] text-[#E8531D] hover:underline cursor-pointer"
              >
                Quên mật khẩu?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-[#E8531D] focus:outline-none"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
            className="w-full bg-[#E8531D] hover:bg-[#D04210] font-bold text-sm shadow-md"
          >
            <span>{isLoading ? 'Đang xác thực...' : 'Đăng nhập vào hệ thống'}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        {showForgotNotice && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-1">
            <span className="font-bold block">Khôi phục mật khẩu:</span>
            <p>Vui lòng liên hệ Admin hệ thống qua email <strong>admin@vietlabel.com.vn</strong> hoặc Hotline kỹ thuật nội bộ để đặt lại mật khẩu an toàn.</p>
          </div>
        )}

        {/* Quick Demo Logins for Testing */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
            Tài khoản mẫu để kiểm thử nhanh:
          </span>

          <div className="grid grid-cols-3 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin('sales@vietlabel.com.vn', 'Sales@123456')}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-center font-semibold text-slate-700 cursor-pointer"
            >
              Sales
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('manager@vietlabel.com.vn', 'Manager@123456')}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-center font-semibold text-slate-700 cursor-pointer"
            >
              Manager
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@vietlabel.com.vn', 'Admin@123456')}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-center font-semibold text-slate-700 cursor-pointer"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
