import { ArrowUpRight, Award, Clock, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PRODUCT_CATEGORIES } from '../../data/products';

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
                  src="/images/vietlabel/logo.png"
                  alt="Vietlabel - Công ty Cổ phần Sản xuất Thương mại Vietlabel"
                  className="h-12 w-auto object-contain max-w-[320px] brightness-0 invert shrink-0"
                />
              </div>
            </Link>

            <p className="text-xs text-slate-300 leading-relaxed [text-wrap:balance]">
              {t('footer.about_text')}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1.5 rounded border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>ISO 9001:2015</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1.5 rounded border border-slate-800">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>FSC® CoC Certified</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1.5 rounded border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
                <span>G7 Master Idealliance</span>
              </div>
            </div>

            {/* Social links */}
            <div className="pt-1 flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-[#BE1E2D] flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-[#BE1E2D] flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-[#BE1E2D] flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Facility & Contact Details (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              {t('footer.contact_col')}
            </h4>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#BE1E2D] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">Nhà máy sản xuất chính:</strong>
                  <span>{t('footer.factory_address')}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">Văn phòng đại diện:</strong>
                  <span>{t('footer.office_address')}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <Phone className="w-4 h-4 text-[#BE1E2D] shrink-0" />
                <div>
                  <span>Hotline B2B: </span>
                  <a href="tel:0868968089" className="text-white font-bold hover:text-[#BE1E2D]">
                    (+84) 086 896 8089
                  </a>
                  <span className="text-slate-400"> - </span>
                  <a href="tel:02837658888" className="text-white font-bold hover:text-[#BE1E2D]">
                    (028) 3765 8888
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#BE1E2D] shrink-0" />
                <div>
                  <span>Email dự toán: </span>
                  <a
                    href="mailto:thien@vietlabel.com.vn"
                    className="text-white font-medium hover:text-[#BE1E2D]"
                  >
                    thien@vietlabel.com.vn
                  </a>
                  <span className="text-slate-400"> / </span>
                  <a
                    href="mailto:baogia@vietlabel.com.vn"
                    className="text-white font-medium hover:text-[#BE1E2D]"
                  >
                    baogia@vietlabel.com.vn
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{t('contact.working_hours')}</span>
              </div>
            </div>
          </div>

          {/* Column 3: Quick Navigation & Products (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              {t('footer.products_col')}
            </h4>

            <ul className="space-y-2 text-xs text-slate-300">
              {PRODUCT_CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/san-pham/${cat.slug}`}
                    className="hover:text-amber-400 transition-colors flex items-center justify-between group"
                  >
                    <span>{currentLang === 'vi' ? cat.nameVi : cat.nameEn}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  to="/san-pham"
                  className="text-xs font-semibold text-[#BE1E2D] hover:underline"
                >
                  {t('products_section.view_all')} →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
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
