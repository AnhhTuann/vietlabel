import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';

// Code-splitting via React.lazy
const HomePage = lazy(() =>
  import('./pages/HomePage').then((module) => ({ default: module.HomePage }))
);
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((module) => ({ default: module.AboutPage }))
);
const ProductsListPage = lazy(() =>
  import('./pages/ProductsListPage').then((module) => ({ default: module.ProductsListPage }))
);
const ProductDetailPage = lazy(() =>
  import('./pages/ProductDetailPage').then((module) => ({ default: module.ProductDetailPage }))
);
const CapabilitiesPage = lazy(() =>
  import('./pages/CapabilitiesPage').then((module) => ({ default: module.CapabilitiesPage }))
);
const SustainabilityPage = lazy(() =>
  import('./pages/SustainabilityPage').then((module) => ({ default: module.SustainabilityPage }))
);
const TechnologyPage = lazy(() =>
  import('./pages/TechnologyPage').then((module) => ({ default: module.TechnologyPage }))
);
const NewsPage = lazy(() =>
  import('./pages/NewsPage').then((module) => ({ default: module.NewsPage }))
);
const NewsDetailPage = lazy(() =>
  import('./pages/NewsDetailPage').then((module) => ({ default: module.NewsDetailPage }))
);
const CareersPage = lazy(() =>
  import('./pages/CareersPage').then((module) => ({ default: module.CareersPage }))
);
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((module) => ({ default: module.ContactPage }))
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage }))
);

const LoadingFallback: React.FC = () => (
  <div className="min-h-[70vh] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-[#E8531D] rounded-full animate-spin" />
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        Đang tải nội dung...
      </span>
    </div>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
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
      </Routes>
    </Suspense>
  );
};
