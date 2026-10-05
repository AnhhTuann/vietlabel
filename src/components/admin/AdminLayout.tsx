import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Volume2,
  VolumeX,
  Radio,
  Menu,
  X,
  ShieldCheck,
  UserCheck,
  Flame,
  Package,
  Newspaper,
  Briefcase,
} from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useAdminRealtime } from '../../hooks/useAdminRealtime';

export const AdminLayout: React.FC = () => {
  const { user, logout, isAuthenticated, isLoading } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOnDuty, setIsOnDuty] = useState(true);

  const { isConnected, soundEnabled, toggleSound, lastNotification } = useAdminRealtime();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest text-slate-400">Đang xác thực bảo mật...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  const navItems = [
    { path: '/admin', label: 'Tổng quan', icon: LayoutDashboard, exact: true },
    { path: '/admin/inbox', label: 'Hộp thư trực tiếp', icon: MessageSquare },
    { path: '/admin/leads', label: 'Quản lý Leads', icon: Users },
    { path: '/admin/products', label: 'Quản lý Sản phẩm', icon: Package },
    { path: '/admin/news', label: 'Tin tức & Bài viết', icon: Newspaper },
    { path: '/admin/careers', label: 'Tuyển dụng', icon: Briefcase },
    { path: '/admin/kb', label: 'Kiến thức AI (KB)', icon: BookOpen },
    { path: '/admin/reports', label: 'Báo cáo KPI', icon: BarChart3 },
    ...(user?.role === 'ADMIN' || user?.role === 'MANAGER'
      ? [{ path: '/admin/settings', label: 'Cài đặt hệ thống', icon: Settings }]
      : []),
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased text-slate-800">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>Vietlabel CRM Mini | Hệ Thống Quản Trị Trực Tiếp</title>
      </Helmet>

      {/* Top Navigation Bar */}
      <header className="h-16 bg-[#0B2A4A] text-white flex items-center justify-between px-4 sm:px-6 fixed top-0 left-0 right-0 z-40 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-slate-300 hover:text-white rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#E8531D] to-orange-400 flex items-center justify-center font-black text-white text-sm shadow-xs">
              VL
            </div>
            <div>
              <span className="font-extrabold text-sm sm:text-base tracking-tight leading-tight block">
                VIETLABEL CRM
              </span>
              <span className="text-[10px] text-amber-300 font-mono tracking-wider block">
                MINI LIVE INBOX
              </span>
            </div>
          </Link>
        </div>

        {/* Status Indicators & Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Realtime Live Pulse */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
              isConnected
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                : 'bg-rose-950/80 text-rose-400 border border-rose-500/40'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
              }`}
            />
            <span className="text-[11px]">{isConnected ? 'Realtime Live' : 'Mất kết nối'}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title={soundEnabled ? 'Tắt âm báo' : 'Bật chuông thông báo'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Duty Switch */}
          <button
            onClick={() => setIsOnDuty(!isOnDuty)}
            className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
              isOnDuty
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-700 text-slate-400'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{isOnDuty ? 'Đang trực' : 'Nghỉ ca'}</span>
          </button>

          {/* User profile dropdown & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-white/15">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-white block leading-tight truncate max-w-[140px]">
                {user?.name}
              </span>
              <span className="text-[10px] text-amber-400 font-mono block">
                {user?.role}
              </span>
            </div>

            <button
              onClick={() => {
                logout();
                navigate('/admin/login');
              }}
              className="p-2 text-rose-300 hover:text-rose-100 hover:bg-rose-900/40 rounded-lg transition-colors cursor-pointer"
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace with Sidebar */}
      <div className="flex-1 flex pt-16">
        {/* Sidebar Desktop */}
        <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0 select-none fixed top-16 bottom-0 z-30">
          <div className="p-4 space-y-1 flex-1 overflow-y-auto">
            <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase px-3 pb-2 block">
              Điều hướng chính
            </span>

            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path, item.exact);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-[#E8531D] text-white shadow-md shadow-orange-900/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Sidebar Footer info */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Phiên bản 2.4-PRO
              </span>
              <span className="text-[10px] font-mono text-slate-500">v2.4</span>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="w-64 bg-slate-900 text-white h-full p-4 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="font-bold text-sm text-amber-400">VIETLABEL CRM</span>
                  <button onClick={() => setMobileMenuOpen(false)}>
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <nav className="space-y-1 pt-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path, item.exact);

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold ${
                          active
                            ? 'bg-[#E8531D] text-white'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    logout();
                    navigate('/admin/login');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-rose-600/20 text-rose-300 rounded-xl text-xs font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Outlet */}
        <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-4rem)] max-w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
