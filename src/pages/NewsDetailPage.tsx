import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
  Bookmark,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { SEO } from '../lib/seo';
import { POSTS_LIST } from '../data/posts';
import { Button } from '../components/ui/Button';

export const NewsDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  const navigate = useNavigate();

  const post = useMemo(() => {
    return POSTS_LIST.find((p) => p.slug === slug) || POSTS_LIST[0];
  }, [slug]);

  const relatedPosts = useMemo(() => {
    return POSTS_LIST.filter((p) => p.id !== post?.id).slice(0, 2);
  }, [post]);

  if (!post) {
    return (
      <div className="pt-32 pb-20 text-center">
        <h2 className="text-xl font-bold">Bài viết không tồn tại</h2>
        <Button className="mt-4" onClick={() => navigate('/tin-tuc')}>
          Quay lại danh mục tin tức
        </Button>
      </div>
    );
  }

  const title = currentLang === 'vi' ? post.titleVi : post.titleEn;
  const paragraphs = currentLang === 'vi' ? post.contentVi : post.contentEn;

  return (
    <div className="pt-24 pb-20">
      <SEO
        title={`${title} | Vietlabel`}
        description={currentLang === 'vi' ? post.summaryVi : post.summaryEn}
        ogImage={post.image}
        ogType="article"
      />

      {/* Breadcrumb Header */}
      <section className="bg-slate-100 py-4 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Link to="/" className="hover:text-[#E8531D]">Trang chủ</Link>
            <span>/</span>
            <Link to="/tin-tuc" className="hover:text-[#E8531D]">Tin tức</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold truncate max-w-sm">{title}</span>
          </div>
        </div>
      </section>

      {/* Main Article Container */}
      <article className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Metadata */}
          <div className="flex items-center gap-2 text-xs font-semibold text-[#E8531D] uppercase tracking-wider mb-2">
            <span>{currentLang === 'vi' ? post.categoryNameVi : post.categoryNameEn}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B2A4A] tracking-tight leading-tight [text-wrap:balance]">
            {title}
          </h1>

          <div className="mt-4 pb-6 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <User className="w-3.5 h-3.5 text-[#E8531D]" />
                {post.author}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {post.date}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {currentLang === 'vi' ? post.readTimeVi : post.readTimeEn}
              </span>
            </div>

            {/* Share action */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Đã sao chép liên kết bài viết!');
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer text-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Chia sẻ</span>
              </button>
            </div>
          </div>

          {/* Featured Image */}
          <div className="my-8 rounded-2xl overflow-hidden aspect-[16/9] bg-slate-100 shadow-md">
            <img
              src={post.image}
              alt={title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Lead Summary */}
          <div className="p-5 rounded-2xl bg-[#FAFAFC] border-l-4 border-[#E8531D] text-sm font-medium text-slate-700 leading-relaxed mb-8">
            {currentLang === 'vi' ? post.summaryVi : post.summaryEn}
          </div>

          {/* Article Body */}
          <div className="space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            {paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}

            <div className="p-6 rounded-2xl bg-[#0B2A4A] text-white my-8 space-y-3">
              <h3 className="text-lg font-bold text-white">Bạn đang tìm kiếm giải pháp bao bì & tem nhãn tương tự?</h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Hãy liên hệ ngay với đội ngũ R&D và kỹ thuật của Vietlabel để nhận tư vấn cấu trúc, dựng mẫu thử 3D và báo giá chi tiết trong 2 giờ.
              </p>
              <div className="pt-2">
                <Link to="/lien-he">
                  <Button variant="primary" size="sm">
                    Tư vấn miễn phí cùng chuyên gia
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Back button */}
          <div className="pt-8 mt-8 border-t border-slate-200 flex justify-between items-center">
            <Link to="/tin-tuc">
              <Button variant="outline" size="sm" icon={<ArrowLeft className="w-4 h-4" />} iconPosition="left">
                Quay lại danh sách bài viết
              </Button>
            </Link>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-12 bg-[#FAFAFC] border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg font-bold text-[#0B2A4A] mb-6">Bài viết liên quan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/tin-tuc/${rel.slug}`}
                  className="group rounded-2xl bg-white border border-slate-200 p-5 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-[#E8531D] uppercase">
                      {rel.categoryNameVi}
                    </span>
                    <h3 className="text-sm font-bold text-[#0B2A4A] group-hover:text-[#E8531D] transition-colors mt-1 line-clamp-2">
                      {currentLang === 'vi' ? rel.titleVi : rel.titleEn}
                    </h3>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                    <span>{rel.date}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#E8531D]" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
