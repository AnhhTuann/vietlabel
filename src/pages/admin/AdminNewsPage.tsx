import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Newspaper,
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  ExternalLink,
  Image,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { api } from '../../services/api';

interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  imageUrl?: string;
  category?: string;
  status: 'DRAFT' | 'PUBLISHED';
  createdAt: string;
  updatedAt?: string;
}

const CATEGORY_OPTIONS = [
  { value: 'du-an-noi-bat', label: 'Dự án & Case Study OCOP' },
  { value: 'nganh-bao-bi', label: 'Tin tức ngành bao bì' },
  { value: 'hoat-dong-cong-ty', label: 'Hoạt động công ty' },
];

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export const AdminNewsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<Post> | null>(null);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/cms/posts');
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa bài viết "${title}"?`)) return;
    try {
      await api.delete(`/cms/posts/${id}`);
      fetchPosts();
    } catch (err) {
      alert('Lỗi khi xóa bài viết');
    }
  };

  const handleOpenAdd = () => {
    setCurrentPost({
      title: '',
      slug: '',
      summary: '',
      content: '',
      imageUrl: '/images/vietlabel/label-cafe-ocop.webp',
      category: 'du-an-noi-bat',
      status: 'PUBLISHED',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: Post) => {
    setCurrentPost({ ...post });
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    const isNew = !currentPost?.id;
    setCurrentPost((prev) => ({
      ...prev,
      title: val,
      slug: isNew ? generateSlug(val) : prev?.slug || generateSlug(val),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...currentPost,
        slug: currentPost?.slug || generateSlug(currentPost?.title || ''),
        category: currentPost?.category || 'du-an-noi-bat',
        status: currentPost?.status || 'PUBLISHED',
      };

      if (currentPost?.id) {
        await api.put(`/cms/posts/${currentPost.id}`, payload);
      } else {
        await api.post('/cms/posts', payload);
      }
      setIsModalOpen(false);
      fetchPosts();
    } catch (err) {
      alert('Lỗi khi lưu bài viết');
    }
  };

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Quản lý Bài viết & Tin tức - Admin Vietlabel</title>
      </Helmet>

      {/* Header and Add action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-[#1E4384]" />
            Quản lý Bài viết & Tin tức
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Các bài viết có trạng thái <strong>PUBLISHED</strong> sẽ tự động hiển thị ở Slider trang chủ và trang Tin tức.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#BE1E2D] hover:bg-[#a61725] text-white rounded-xl font-semibold text-xs transition-all shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Đăng bài viết mới
        </button>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Search & Filter Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề hoặc chuyên mục..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:border-[#1E4384] focus:outline-none focus:ring-1 focus:ring-[#1E4384] bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
          <span className="text-xs font-medium text-slate-500 self-end sm:self-auto">
            Tổng cộng: <strong>{filtered.length}</strong> bài viết
          </span>
        </div>

        {/* Posts Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-700 uppercase tracking-wider font-semibold text-[11px]">
              <tr>
                <th className="p-4 w-20">Ảnh</th>
                <th className="p-4 min-w-[240px]">Tiêu đề & Đường dẫn</th>
                <th className="p-4 w-36">Chuyên mục</th>
                <th className="p-4 w-32">Trạng thái</th>
                <th className="p-4 w-32">Ngày tạo</th>
                <th className="p-4 w-32 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Đang tải dữ liệu bài viết...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Không tìm thấy bài viết nào. Bấm nút <strong>"Đăng bài viết mới"</strong> để thêm bài.
                  </td>
                </tr>
              ) : (
                filtered.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        <img
                          src={post.imageUrl || '/images/vietlabel/label-cafe-ocop.webp'}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/images/vietlabel/label-cafe-ocop.webp';
                          }}
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800 text-sm line-clamp-1">{post.title}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5 truncate max-w-md">
                        /tin-tuc/{post.slug}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {CATEGORY_OPTIONS.find((c) => c.value === post.category)?.label || post.category || 'Tin tức'}
                      </span>
                    </td>
                    <td className="p-4">
                      {post.status === 'PUBLISHED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Công khai
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3" /> Bản nháp
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-slate-500 whitespace-nowrap">
                      {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={`/tin-tuc/${post.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          title="Xem trên web"
                          className="p-1.5 text-slate-500 hover:text-[#1E4384] hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleOpenEdit(post)}
                          title="Chỉnh sửa bài viết"
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          title="Xóa bài viết"
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-5">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-[#1E4384]" />
                {currentPost?.id ? 'Chỉnh sửa bài viết' : 'Đăng bài viết mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tiêu đề bài viết <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="Nhập tiêu đề bài viết..."
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:border-[#1E4384] focus:outline-none focus:ring-1 focus:ring-[#1E4384]"
                  value={currentPost?.title || ''}
                  onChange={(e) => handleTitleChange(e.target.value)}
                />
              </div>

              {/* Slug & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Đường dẫn tĩnh (Slug URL) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="duong-dan-bai-viet"
                    className="w-full px-3.5 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:border-[#1E4384] focus:outline-none focus:ring-1 focus:ring-[#1E4384]"
                    value={currentPost?.slug || ''}
                    onChange={(e) => setCurrentPost({ ...currentPost, slug: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Chuyên mục</label>
                  <select
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:border-[#1E4384] focus:outline-none focus:ring-1 focus:ring-[#1E4384] bg-white cursor-pointer"
                    value={currentPost?.category || 'du-an-noi-bat'}
                    onChange={(e) => setCurrentPost({ ...currentPost, category: e.target.value })}
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image URL & Preview */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Đường dẫn ảnh đại diện (Image URL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="/images/vietlabel/... hoặc https://..."
                    className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:border-[#1E4384] focus:outline-none focus:ring-1 focus:ring-[#1E4384]"
                    value={currentPost?.imageUrl || ''}
                    onChange={(e) => setCurrentPost({ ...currentPost, imageUrl: e.target.value })}
                  />
                  {currentPost?.imageUrl && (
                    <div className="w-10 h-9 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <img
                        src={currentPost.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
                {/* Image presets */}
                <div className="mt-1.5 flex flex-wrap gap-1.5 text-[11px] text-slate-500">
                  <span className="font-medium text-slate-600">Gợi ý ảnh:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPost({ ...currentPost, imageUrl: '/images/vietlabel/label-cafe-ocop.webp' })
                    }
                    className="text-[#1E4384] hover:underline cursor-pointer"
                  >
                    [Tem OCOP]
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPost({ ...currentPost, imageUrl: '/images/vietlabel/label-dau-nhot.webp' })
                    }
                    className="text-[#1E4384] hover:underline cursor-pointer"
                  >
                    [Tem dầu nhớt]
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPost({ ...currentPost, imageUrl: '/images/vietlabel/label-popup.webp' })
                    }
                    className="text-[#1E4384] hover:underline cursor-pointer"
                  >
                    [Tem Pop-up]
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPost({ ...currentPost, imageUrl: '/images/vietlabel/team-vietlabel.webp' })
                    }
                    className="text-[#1E4384] hover:underline cursor-pointer"
                  >
                    [Nhà máy Vietlabel]
                  </button>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Trạng thái đăng bài</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="postStatus"
                      value="PUBLISHED"
                      checked={currentPost?.status === 'PUBLISHED'}
                      onChange={() => setCurrentPost({ ...currentPost, status: 'PUBLISHED' })}
                      className="text-[#1E4384]"
                    />
                    <span className="font-medium text-emerald-700">Công khai (Xuất hiện trên Slider & Tin tức)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="postStatus"
                      value="DRAFT"
                      checked={currentPost?.status === 'DRAFT'}
                      onChange={() => setCurrentPost({ ...currentPost, status: 'DRAFT' })}
                      className="text-[#1E4384]"
                    />
                    <span className="font-medium text-amber-700">Lưu bản nháp</span>
                  </label>
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Đoạn tóm tắt bài viết (Lead Summary)
                </label>
                <textarea
                  rows={2}
                  placeholder="Mô tả ngắn gọn nội dung bài viết hiển thị ở danh sách..."
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:border-[#1E4384] focus:outline-none focus:ring-1 focus:ring-[#1E4384]"
                  value={currentPost?.summary || ''}
                  onChange={(e) => setCurrentPost({ ...currentPost, summary: e.target.value })}
                />
              </div>

              {/* Full Content */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nội dung chi tiết bài viết <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Nhập nội dung bài viết chi tiết..."
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:border-[#1E4384] focus:outline-none focus:ring-1 focus:ring-[#1E4384] leading-relaxed"
                  value={currentPost?.content || ''}
                  onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1E4384] hover:bg-[#153265] text-white text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  {currentPost?.id ? 'Lưu thay đổi' : 'Đăng bài viết ngay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

