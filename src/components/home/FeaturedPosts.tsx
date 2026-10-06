import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { POSTS_LIST } from '../../data/posts';
import { SectionTitle } from '../ui/SectionTitle';

export const FeaturedPosts: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  return (
    <section className="py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <SectionTitle
            kicker={t('news_section.badge')}
            title={t('news_section.title')}
            align="left"
            className="mb-0 max-w-2xl"
          />
          <Link
            to="/tin-tuc"
            className="mt-4 sm:mt-0 text-sm font-bold text-[#BE1E2D] hover:text-[#D04210] flex items-center gap-1.5 whitespace-nowrap group shrink-0"
          >
            <span>{t('news_section.view_all')}</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 3 Featured Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {POSTS_LIST.slice(0, 3).map((post) => (
            <article
              key={post.id}
              className="group flex flex-col justify-between rounded-2xl bg-[#FAFAFC] border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
            >
              <div>
                {/* Image */}
                <Link
                  to={`/tin-tuc/${post.slug}`}
                  className="block relative aspect-[16/10] overflow-hidden bg-slate-100"
                >
                  <img
                    src={post.image}
                    alt={currentLang === 'vi' ? post.titleVi : post.titleEn}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-[#1E4384]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider backdrop-blur-xs">
                    {currentLang === 'vi' ? post.categoryNameVi : post.categoryNameEn}
                  </div>
                </Link>

                {/* Content */}
                <div className="p-6">
                  {/* Clean unboxed metadata with dot separators */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.date}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {currentLang === 'vi' ? post.readTimeVi : post.readTimeEn}
                    </span>
                  </div>

                  {/* Title max 2 lines */}
                  <h3 className="text-base sm:text-lg font-bold text-[#1E4384] group-hover:text-[#BE1E2D] transition-colors line-clamp-2 leading-snug">
                    <Link to={`/tin-tuc/${post.slug}`}>
                      {currentLang === 'vi' ? post.titleVi : post.titleEn}
                    </Link>
                  </h3>

                  {/* Summary */}
                  <p className="mt-2.5 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {currentLang === 'vi' ? post.summaryVi : post.summaryEn}
                  </p>
                </div>
              </div>

              {/* Read more link */}
              <div className="px-6 pb-6 pt-0">
                <Link
                  to={`/tin-tuc/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E4384] group-hover:text-[#BE1E2D] transition-colors"
                >
                  <span>Chi tiết bài viết</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
