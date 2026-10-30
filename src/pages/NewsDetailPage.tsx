import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
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
import { api } from '../services/api';

export const NewsDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  const navigate = useNavigate();
  const [cmsPost, setCmsPost] = useState<any | null>(null);

  useEffect(() => {
    const localPost = POSTS_LIST.find((p) => p.slug === slug);
    if (!localPost && slug) {
      api.get('/cms/posts').then((res) => {
        if (res.data && Array.isArray(res.data)) {
          const found = res.data.find((p: any) => p.slug === slug && p.status === 'PUBLISHED');
          if (found) {
            setCmsPost({
              id: found.id,
              slug: found.slug,
              category: found.category || 'nganh-bao-bi',
              categoryNameVi: found.category || 'Tin tức',
              categoryNameEn: found.category || 'News',
              titleVi: found.title,
              titleEn: found.title,
              summaryVi: found.summary,
              summaryEn: found.summary,
              image: found.imageUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
              date: new Date(found.createdAt).toLocaleDateString('vi-VN'),
              readTimeVi: '5 phút đọc',
              readTimeEn: '5 min read',
              author: found.author || 'Ban biên tập Vietlabel',
              contentVi: typeof found.content === 'string' ? found.content.split('\n\n') : [found.content],
              contentEn: typeof found.content === 'string' ? found.content.split('\n\n') : [found.content],
            });
          }
        }
      }).catch(console.error);
    }
  }, [slug]);

  const post = useMemo(() => {
    return POSTS_LIST.find((p) => p.slug === slug) || cmsPost || POSTS_LIST[0];
  }, [slug, cmsPost]);

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
  const rawParagraphs = currentLang === 'vi' ? post.contentVi : post.contentEn;
  const paragraphs: string[] = Array.isArray(rawParagraphs)
    ? rawParagraphs
    : typeof rawParagraphs === 'string'
    ? [rawParagraphs]
    : [];

  return (
    <div className="pt-24 pb-20">
      <SEO
        title={`${title} | Vietlabel`}
        description={currentLang === 'vi' ? post.summaryVi : post.summaryEn}
        ogImage={post.image}
        ogType="article"
      />

      {/* Breadcrumb Header */}
      <motion.section 
        className="bg-gradient-to-r from-slate-100 to-white py-5 border-b border-slate-200"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex items-center gap-2 text-xs text-slate-600"
            animate={{ opacity: 1 }}
          >
            <Link to="/" className="hover:text-[#BE1E2D] transition-colors">Trang chủ</Link>
            <span className="text-slate-400">/</span>
            <Link to="/tin-tuc" className="hover:text-[#BE1E2D] transition-colors">Tin tức</Link>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900 font-semibold truncate max-w-sm">{title}</span>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Article Container */}
      <article className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Metadata */}
            <div className="flex items-center gap-2 text-xs font-semibold text-[#BE1E2D] uppercase tracking-wider mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-red-50 border border-red-100">
                {currentLang === 'vi' ? post.categoryNameVi : post.categoryNameEn}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1E4384] tracking-tight leading-tight [text-wrap:balance]">
              {title}
            </h1>

            <div className="mt-4 pb-6 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <User className="w-3.5 h-3.5 text-[#BE1E2D]" />
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
                <motion.button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Đã sao chép liên kết bài viết!');
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer text-xs"
                  whileTap={{ scale: 0.95 }}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Chia sẻ</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Featured Image */}
          <motion.div
            className="my-8 rounded-2xl overflow-hidden aspect-[16/9] bg-slate-100 shadow-md group"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <motion.img
              src={post.image}
              alt={title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            />
          </motion.div>

          {/* Lead Summary */}
          <motion.div
            className="p-5 rounded-2xl bg-[#FAFAFC] border-l-4 border-[#BE1E2D] text-sm font-medium text-slate-700 leading-relaxed mb-8 shadow-2xs"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {currentLang === 'vi' ? post.summaryVi : post.summaryEn}
          </motion.div>

          {/* Article Body */}
          <motion.div
            className="space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {post.contentHtml ? (
              <div
                className="article-content max-w-none text-slate-700 leading-relaxed space-y-4
                  [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-[#1E4384] [&>h2]:mt-8 [&>h2]:mb-4
                  [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-[#1E4384] [&>h3]:mt-6 [&>h3]:mb-3
                  [&>h4]:text-lg [&>h4]:font-bold [&>h4]:text-[#1E4384] [&>h4]:mt-4 [&>h4]:mb-2
                  [&>p]:my-4 [&>p]:leading-relaxed
                  [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:my-4 [&>ul]:space-y-2
                  [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:my-4 [&>ol]:space-y-2
                  [&_img]:rounded-xl [&_img]:shadow-md [&_img]:my-6 [&_img]:mx-auto [&_img]:max-w-full [&_img]:h-auto
                  [&_strong]:text-slate-900 [&_strong]:font-semibold
                  [&>table]:w-full [&>table]:border-collapse [&>table]:my-6
                  [&_th]:bg-slate-100 [&_th]:p-3 [&_th]:border [&_th]:border-slate-200 [&_th]:text-left
                  [&_td]:p-3 [&_td]:border [&_td]:border-slate-200"
                dangerouslySetInnerHTML={{ __html: post.contentHtml }}
              />
            ) : (
              paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))
            )}

            <motion.div
              className="p-6 rounded-2xl bg-[#1E4384] text-white my-8 space-y-3 shadow-lg"
              whileHover={{ scale: 1.01 }}
            >
              <h3 className="text-lg font-bold text-white">Bạn đang tìm kiếm giải pháp bao bì & tem nhãn tương tự?</h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Hãy liên hệ ngay với đội ngũ R&D và kỹ thuật của Vietlabel để nhận tư vấn cấu trúc, dựng mẫu thử 3D và báo giá chi tiết trong 2 giờ.
              </p>
              <div className="pt-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                  <Link to="/lien-he">
                    <Button variant="primary" size="sm">
                      Tư vấn miễn phí cùng chuyên gia
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Back button */}
          <div className="pt-8 mt-8 border-t border-slate-200 flex justify-between items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/tin-tuc">
                <Button variant="outline" size="sm" icon={<ArrowLeft className="w-4 h-4" />} iconPosition="left">
                  Quay lại danh sách bài viết
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-12 bg-[#FAFAFC] border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg font-bold text-[#1E4384] mb-6">Bài viết liên quan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((rel, idx) => (
                <motion.div
                  key={rel.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -6 }}
                >
                  <Link
                    to={`/tin-tuc/${rel.slug}`}
                    className="group rounded-2xl bg-white border border-slate-200 p-5 hover:shadow-lg transition-all flex flex-col justify-between h-full"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-[#BE1E2D] uppercase">
                        {rel.categoryNameVi}
                      </span>
                      <h3 className="text-sm font-bold text-[#1E4384] group-hover:text-[#BE1E2D] transition-colors mt-1 line-clamp-2">
                        {currentLang === 'vi' ? rel.titleVi : rel.titleEn}
                      </h3>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                      <span>{rel.date}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#BE1E2D] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
