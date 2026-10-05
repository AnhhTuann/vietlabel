import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { AdminLayout } from './components/admin/AdminLayout';

// Public pages
const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ProductsListPage = lazy(() => import('./pages/ProductsListPage').then((m) => ({ default: m.ProductsListPage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })));
const CapabilitiesPage = lazy(() => import('./pages/CapabilitiesPage').then((m) => ({ default: m.CapabilitiesPage })));
const SustainabilityPage = lazy(() => import('./pages/SustainabilityPage').then((m) => ({ default: m.SustainabilityPage })));
const TechnologyPage = lazy(() => import('./pages/TechnologyPage').then((m) => ({ default: m.TechnologyPage })));
const NewsPage = lazy(() => import('./pages/NewsPage').then((m) => ({ default: m.NewsPage })));
const NewsDetailPage = lazy(() => import('./pages/NewsDetailPage').then((m) => ({ default: m.NewsDetailPage })));
const CareersPage = lazy(() => import('./pages/CareersPage').then((m) => ({ default: m.CareersPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

// Admin pages (lazy-loaded to keep public bundle light)
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })));
const AdminOverviewPage = lazy(() => import('./pages/admin/AdminOverviewPage').then((m) => ({ default: m.AdminOverviewPage })));
const AdminLeadsPage = lazy(() => import('./pages/admin/AdminLeadsPage').then((m) => ({ default: m.AdminLeadsPage })));
const AdminProductsPage = lazy(() => import('./pages/admin/AdminProductsPage').then((m) => ({ default: m.AdminProductsPage })));
const AdminNewsPage = lazy(() => import('./pages/admin/AdminNewsPage').then((m) => ({ default: m.AdminNewsPage })));
const AdminCareersPage = lazy(() => import('./pages/admin/AdminCareersPage').then((m) => ({ default: m.AdminCareersPage })));
const AdminLeadDetailPage = lazy(() => import('./pages/admin/AdminLeadDetailPage').then((m) => ({ default: m.AdminLeadDetailPage })));
const AdminInboxPage = lazy(() => import('./pages/admin/AdminInboxPage').then((m) => ({ default: m.AdminInboxPage })));
const AdminKbPage = lazy(() => import('./pages/admin/AdminKbPage').then((m) => ({ default: m.AdminKbPage })));
const AdminReportsPage = lazy(() => import('./pages/admin/AdminReportsPage').then((m) => ({ default: m.AdminReportsPage })));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage').then((m) => ({ default: m.AdminSettingsPage })));

const LoadingFallback: React.FC = () => (
  <div className="min-h-[70vh] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-[#E8531D] rounded-full animate-spin" />
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        Đang tải hệ thống...
      </span>
    </div>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <AdminAuthProvider>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Website Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/gioi-thieu" element={<AboutPage />} />
            <Route path="/san-pham" element={<ProductsListPage />} />
            <Route path="/san-pham/:danhMuc" element={<ProductsListPage />} />
            <Route path="/san-pham/:danhMuc/:slug" element={<ProductDetailPage />} />
            <Route path="/nang-luc" element={<CapabilitiesPage />} />
            <Route path="/phat-trien-ben-vung" element={<SustainabilityPage />} />
            <Route path="/cong-nghe" element={<TechnologyPage />} />
            <Route path="/tin-tuc" element={<NewsPage />} />
            <Route path="/tin-tuc/:slug" element={<NewsDetailPage />} />
            <Route path="/tuyen-dung" element={<CareersPage />} />
            <Route path="/lien-he" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Admin Authentication */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin CRM & Live Inbox Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverviewPage />} />
            <Route path="leads" element={<AdminLeadsPage />} />
            <Route path="leads/:id" element={<AdminLeadDetailPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="news" element={<AdminNewsPage />} />
            <Route path="careers" element={<AdminCareersPage />} />
            <Route path="inbox" element={<AdminInboxPage />} />
            <Route path="kb" element={<AdminKbPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
        </Routes>
      </Suspense>
    </AdminAuthProvider>
  );
};
