import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Newspaper, Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import { api } from '../../lib/api';

interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  status: 'DRAFT' | 'PUBLISHED';
  createdAt: string;
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

  const handleDelete = async (id: string) => {
    if (!window.confirm('Xóa bài viết này?')) return;
    try {
      await api.delete(`/cms/posts/${id}`);
      fetchPosts();
    } catch (err) {
      alert('Lỗi khi xóa bài viết');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentPost?.id) {
        await api.put(`/cms/posts/${currentPost.id}`, currentPost);
      } else {
        await api.post('/cms/posts', currentPost);
      }
      setIsModalOpen(false);
      fetchPosts();
    } catch (err) {
      alert('Lỗi khi lưu bài viết');
    }
  };

  const filtered = posts.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <Helmet><title>Quản lý Tin tức - Admin</title></Helmet>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Tin tức & Bài viết</h1>
        <button onClick={() => { setCurrentPost({ status: 'PUBLISHED' }); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-[#E8531D] text-white rounded-lg">
          <Plus className="w-5 h-5" /> Thêm bài viết
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <input type="text" placeholder="Tìm bài viết..." className="w-full max-w-md px-4 py-2 border rounded-lg" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr><th className="p-4">Tiêu đề</th><th className="p-4">Trạng thái</th><th className="p-4">Thao tác</th></tr>
          </thead>
          <tbody>
            {filtered.map(post => (
              <tr key={post.id} className="border-b border-slate-100">
                <td className="p-4 font-medium text-slate-800">{post.title}</td>
                <td className="p-4">{post.status}</td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => { setCurrentPost(post); setIsModalOpen(true); }} className="p-2 text-blue-600"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(post.id)} className="p-2 text-rose-600"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6">
            <div className="flex justify-between mb-4"><h3 className="text-lg font-bold">{currentPost?.id ? 'Sửa' : 'Thêm'} bài viết</h3><button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5" /></button></div>
            <form onSubmit={handleSave} className="space-y-4">
              <input required type="text" placeholder="Tiêu đề" className="w-full px-4 py-2 border rounded-lg" value={currentPost?.title || ''} onChange={e => setCurrentPost({...currentPost, title: e.target.value})} />
              <textarea placeholder="Tóm tắt" className="w-full px-4 py-2 border rounded-lg" value={currentPost?.summary || ''} onChange={e => setCurrentPost({...currentPost, summary: e.target.value})} />
              <textarea rows={5} placeholder="Nội dung..." className="w-full px-4 py-2 border rounded-lg" value={currentPost?.content || ''} onChange={e => setCurrentPost({...currentPost, content: e.target.value})} />
              <button type="submit" className="px-5 py-2 bg-[#0B2A4A] text-white rounded-lg w-full">Lưu bài viết</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
