import { ArrowUpRight, Clock, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PRODUCTS_LIST, PRODUCT_CATEGORIES } from '../../data/products';

export const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  return (
    <footer className="bg-[#1E4384] text-white pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          {/* Column 1: Brand & Credentials (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="inline-block">
              <div className="inline-flex items-center">
                <img
                  src="/images/vietlabel/logo-white.png"
                  alt="Vietlabel - Công ty Cổ phần Sản xuất Thương mại Vietlabel"
                  className="h-11 w-auto object-contain max-w-[280px] shrink-0"
                />
              </div>
            </Link>

            <p className="text-sm text-slate-300 leading-relaxed [text-wrap:balance]">
              {t('footer.about_text')}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-sm text-slate-400">
              <div className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1.5 rounded border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>ISO 9001:2015</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1.5 rounded border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
                <span>G7 Master Idealliance</span>
              </div>
            </div>

            {/* Social links */}
            <div className="pt-1 flex items-center gap-3">
              <a
                href="https://www.facebook.com/vietlabelhcm"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-[#BE1E2D] flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <span
                title="LinkedIn"
                role="img"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </span>
              <a
                href="https://www.youtube.com/@Vietlabel"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-[#BE1E2D] flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@vietlabel.hcm.2019"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-[#BE1E2D] flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.4V2h-3.94v13.67a2.89 2.89 0 0 1-2.9 2.76 2.9 2.9 0 0 1 0-5.8c.3 0 .6.05.88.14V8.75a6.85 6.85 0 1 0 5.96 6.8V8.58a8.72 8.72 0 0 0 5.1 1.64V6.3a4.87 4.87 0 0 1-1.33.39Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Facility & Contact Details (5 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-base font-bold uppercase tracking-wider text-slate-200">
              {t('footer.contact_col')}
            </h4>

            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#BE1E2D] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">{t('footer.factory_label')}</strong>
                  <span>{t('footer.factory_address')}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">{t('footer.office_label')}</strong>
                  <span>{t('footer.office_address')}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <Phone className="w-4 h-4 text-[#BE1E2D] shrink-0" />
                <div>
                  <span>{t('footer.hotline_label')}: </span>
                  <a href="tel:0868968089" className="text-white font-bold hover:text-[#BE1E2D]">
                    (+84) 086 896 8089
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#BE1E2D] shrink-0" />
                <div>
                  <span>{t('footer.quote_email_label')}: </span>
                  <a
                    href="mailto:thien@vietlabel.com.vn"
                    className="text-white font-medium hover:text-[#BE1E2D]"
                  >
                    thien@vietlabel.com.vn
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{t('contact.working_hours')}</span>
              </div>
            </div>
          </div>

          {/* Column 3: Packaging Categories (3 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-base font-bold uppercase tracking-wider text-slate-200">
              DANH MỤC BAO BÌ
            </h4>

            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-300">
              {PRODUCT_CATEGORIES.map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/san-pham/${category.slug}`}
                    className="hover:text-amber-400 transition-colors flex items-center justify-between group"
                  >
                    <span>{currentLang === 'vi' ? category.nameVi : category.nameEn}</span>
                    <ArrowUpRight className="ml-1 h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to="/san-pham"
              className="inline-block text-sm font-semibold text-[#BE1E2D] hover:underline"
            >
              Xem tất cả →
            </Link>
          </div>
        </div>

        {/* Bottom copyright & legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <div>{t('footer.copyright')}</div>
          <div className="flex items-center gap-4 text-slate-400">
            <Link to="/gioi-thieu" className="hover:text-white transition-colors">
              Chính sách chất lượng
            </Link>
            <span>·</span>
            <Link to="/phat-trien-ben-vung" className="hover:text-white transition-colors">
              Cam kết môi trường FSC
            </Link>
            <span>·</span>
            <Link to="/lien-he" className="hover:text-white transition-colors">
              Bảo mật thông tin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
