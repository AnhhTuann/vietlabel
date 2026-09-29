import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  RefreshCw,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Edit2,
  Trash2,
  Save,
  X,
  Sparkles,
} from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { Button } from '../../components/ui/Button';

export const AdminKbPage: React.FC = () => {
  const { token, user } = useAdminAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [flaggedAnswers, setFlaggedAnswers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestSuccessMessage, setIngestSuccessMessage] = useState<string | null>(null);

  // Editor modal state
  const [editingDoc, setEditingDoc] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editStatus, setEditStatus] = useState<'DRAFT' | 'APPROVED'>('APPROVED');
  const [isSaving, setIsSaving] = useState(false);

  const fetchKbData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/kb', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents || []);
        setFlaggedAnswers(data.flaggedAnswers || []);
      }
    } catch (err) {
      console.error('Fetch KB data failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKbData();
  }, []);

  const handleOpenEditor = (doc?: any) => {
    if (doc) {
      setEditingDoc(doc);
      setEditTitle(doc.title);
      setEditContent(doc.content);
      setEditStatus(doc.status);
    } else {
      setEditingDoc({ isNew: true });
      setEditTitle('');
      setEditContent('# TIÊU ĐỀ TÀI LIỆU\n\nNội dung chi tiết về vật liệu, quy cách hoặc chứng nhận...');
      setEditStatus('APPROVED');
    }
  };

  const handleSaveDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim() || !editContent.trim()) return;

    setIsSaving(true);
    try {
      if (editingDoc.isNew) {
        await fetch('/api/admin/kb', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ title: editTitle, content: editContent, status: editStatus }),
        });
      } else {
        await fetch(`/api/admin/kb/${editingDoc.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ title: editTitle, content: editContent, status: editStatus }),
        });
      }

      setEditingDoc(null);
      fetchKbData();
    } catch (err) {
      console.error('Save KB doc error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDoc = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài liệu kiến thức này?')) return;
    try {
      await fetch(`/api/admin/kb/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchKbData();
    } catch (err) {
      console.error('Delete doc failed:', err);
    }
  };

  const handleReingest = async () => {
    setIsIngesting(true);
    setIngestSuccessMessage(null);
    try {
      const res = await fetch('/api/admin/kb/ingest', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setIngestSuccessMessage(`✅ Đã đồng bộ thành công ${data.chunksCount} đoạn tri thức vào mô hình RAG!`);
        fetchKbData();
      }
    } catch (err) {
      console.error('Ingest error:', err);
    } finally {
      setIsIngesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-[11px] font-bold text-[#E8531D] uppercase tracking-wider block">
            KNOWLEDGE BASE (RAG) MANAGEMENT
          </span>
          <h1 className="text-2xl font-black text-[#0B2A4A] mt-0.5">
            Quản Lý Tài Liệu Kiến Thức & Huấn Luyện AI
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Nội dung ở đây là nguồn duy nhất Trợ lý AI sử dụng để trả lời khách hàng. Tuyệt đối không bịa đặt.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            onClick={handleReingest}
            disabled={isIngesting}
            variant="outline"
            size="sm"
            className="text-xs font-bold border-orange-300 text-[#E8531D] hover:bg-orange-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isIngesting ? 'animate-spin' : ''}`} />
            <span>{isIngesting ? 'Đang nạp tri thức...' : 'Cập nhật kiến thức (Ingest)'}</span>
          </Button>

          <Button
            onClick={() => handleOpenEditor()}
            variant="primary"
            size="sm"
            className="bg-[#0B2A4A] hover:bg-[#164373] text-xs font-bold"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            <span>Thêm tài liệu mới</span>
          </Button>
        </div>
      </div>

      {ingestSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{ingestSuccessMessage}</span>
        </div>
      )}

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    doc.status === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {doc.status === 'APPROVED' ? 'ĐÃ PHÊ DUYỆT (ONLINE)' : 'BẢN NHÁP (DRAFT)'}
                </span>

                <span className="text-[11px] text-slate-400 font-mono">
                  {doc.filePath}
                </span>
              </div>

              <h3 className="font-bold text-base text-[#0B2A4A]">{doc.title}</h3>

              <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                {doc.content.replace(/^#+.*$/gm, '').trim()}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">
                Cập nhật: {new Date(doc.updatedAt).toLocaleDateString('vi-VN')}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEditor(doc)}
                  className="p-1.5 text-slate-600 hover:text-[#E8531D] hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                  title="Chỉnh sửa nội dung"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                {user?.role === 'ADMIN' && (
                  <button
                    onClick={() => handleDeleteDoc(doc.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                    title="Xóa tài liệu"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Flagged Answers Section */}
      {flaggedAnswers.length > 0 && (
        <div className="bg-white rounded-2xl border border-rose-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-rose-700">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <h3 className="font-bold text-sm">Câu Trả Lời Của Bot Bị Đánh Dấu Cần Cải Thiện</h3>
          </div>
          <p className="text-xs text-slate-500">
            Danh sách tin nhắn khách hàng hoặc nhân viên phản hồi chưa chính xác để bổ sung vào tài liệu huấn luyện.
          </p>

          <div className="divide-y divide-slate-100 text-xs">
            {flaggedAnswers.map((item, idx) => (
              <div key={idx} className="py-2.5 space-y-1">
                <span className="font-semibold text-slate-800">
                  Lead {item.lead?.code || '#'} - {item.lead?.customerName}:
                </span>
                <p className="p-2.5 bg-rose-50/50 rounded-xl border border-rose-100 text-rose-950 font-mono text-[11px]">
                  {item.message?.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Document Editor Modal */}
      {editingDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl p-6 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-[#0B2A4A] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#E8531D]" />
                {editingDoc.isNew ? 'Thêm Tài Liệu Mới' : `Chỉnh Sửa: ${editingDoc.title}`}
              </h3>
              <button onClick={() => setEditingDoc(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDoc} className="space-y-4 flex-1 flex flex-col overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tiêu đề tài liệu</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Quy trình sản xuất tem nhãn cuộn Flexo..."
                    className="w-full text-xs p-2 border border-slate-300 rounded-xl focus:border-[#E8531D] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Trạng thái</label>
                  <select
                    value={editStatus}
                    onChange={(e: any) => setEditStatus(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded-xl focus:border-[#E8531D] focus:outline-none"
                  >
                    <option value="APPROVED">Đã phê duyệt (Cho phép AI học)</option>
                    <option value="DRAFT">Bản nháp (Tạm ẩn)</option>
                  </select>
                </div>
              </div>

              <div className="flex-1 flex flex-col space-y-1 overflow-hidden">
                <label className="text-xs font-bold text-slate-700">Nội dung Markdown</label>
                <textarea
                  required
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="flex-1 font-mono text-xs p-3 border border-slate-300 rounded-xl resize-none focus:border-[#E8531D] focus:outline-none bg-slate-50 overflow-y-auto min-h-[300px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <Button type="button" variant="outline" size="sm" onClick={() => setEditingDoc(null)}>
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  variant="primary"
                  size="sm"
                  className="bg-[#E8531D] hover:bg-[#D04210] font-bold text-xs"
                >
                  <Save className="w-3.5 h-3.5 mr-1" />
                  <span>{isSaving ? 'Đang lưu...' : 'Lưu tài liệu'}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
