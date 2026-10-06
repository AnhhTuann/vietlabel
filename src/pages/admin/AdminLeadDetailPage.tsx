import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  Mail,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Flame,
  Building,
  User,
  Package,
  Copy,
  Check,
  Send,
  UserCheck,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Edit2,
  Save,
  Plus,
  Radio,
} from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useAdminRealtime } from '../../hooks/useAdminRealtime';
import { Button } from '../../components/ui/Button';

export const AdminLeadDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token, user } = useAdminAuth();

  const [leadData, setLeadData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Brief editing
  const [isEditingBrief, setIsEditingBrief] = useState(false);
  const [briefForm, setBriefForm] = useState<any>({});
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Message composer in center column
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  // Internal note in right column
  const [noteText, setNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Realtime hook
  useAdminRealtime((eventName, data) => {
    if (
      (eventName === 'message:new' && data.leadId === id) ||
      (eventName === 'lead:updated' && data.id === id) ||
      (eventName === 'conversation:modeChanged' && data.leadId === id)
    ) {
      fetchDetail();
    }
  });

  const fetchDetail = async () => {
    if (!id) return;
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setLeadData(data);
        setBriefForm(data.lead.brief || {});
      } else {
        setError('Không tìm thấy thông tin hồ sơ lead.');
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [leadData?.messages]);

  const handleClaim = async () => {
    try {
      const res = await fetch(`/api/admin/leads/${id}/claim`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Nhận xử lý thất bại');
      fetchDetail();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchDetail();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSaveBrief = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          brief: briefForm,
          productType: briefForm.productType,
          quantity: briefForm.quantity,
          deadline: briefForm.deadline,
        }),
      });
      setIsEditingBrief(false);
      fetchDetail();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCopySummary = () => {
    if (!leadData?.lead) return;
    const l = leadData.lead;
    const text = `📋 TÓM TẮT ĐƠN HÀNG #${l.code}
Khách: ${l.customerName} (${l.company || 'Cá nhân'})
SĐT: ${l.phone || 'Chưa có'} | Email: ${l.email || 'Chưa có'}
Sản phẩm: ${l.productType}
Số lượng: ${l.quantity || 'Thỏa thuận'}
Kích thước: ${l.brief?.dimensions || 'Tiêu chuẩn'}
Chất liệu: ${l.brief?.material || 'Tư vấn xưởng'}
Tiến độ: ${l.deadline || 'Bình thường'}
Ghi chú: ${l.brief?.notes || 'Không'}`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !leadData?.conversation?.id) return;
    setIsSendingReply(true);

    try {
      await fetch(`/api/admin/conversations/${leadData.conversation.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text: replyText.trim() }),
      });
      setReplyText('');
      fetchDetail();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleTakeoverToggle = async () => {
    if (!leadData?.conversation?.id) return;
    const isHuman = leadData.conversation.mode === 'HUMAN';
    const action = isHuman ? 'release' : 'takeover';

    try {
      await fetch(`/api/admin/conversations/${leadData.conversation.id}/${action}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDetail();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setIsAddingNote(true);

    try {
      await fetch(`/api/admin/leads/${id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text: noteText.trim() }),
      });
      setNoteText('');
      fetchDetail();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsAddingNote(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-[#BE1E2D] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-semibold">Đang tải hồ sơ lead #{id}...</p>
        </div>
      </div>
    );
  }

  if (error || !leadData) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-3">
        <AlertCircle className="w-12 h-12 text-rose-500" />
        <h2 className="text-lg font-bold text-slate-800">{error}</h2>
        <Link to="/admin/leads" className="text-xs font-bold text-[#BE1E2D] hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách Leads
        </Link>
      </div>
    );
  }

  const { lead, conversation, messages, notes, events, notificationLogs } = leadData;
  const isClaimed = lead.status === 'CLAIMED' || Boolean(lead.claimedBy);
  const isHumanMode = conversation?.mode === 'HUMAN';
  const cleanPhone = (lead.phone || '').replace(/\D/g, '');

  return (
    <div className="space-y-4">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/leads"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-extrabold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                {lead.code || `#${lead.id.slice(-4)}`}
              </span>
              <h1 className="text-base sm:text-lg font-black text-[#1E4384]">
                {lead.customerName || 'Khách hàng web'}
              </h1>
            </div>
            <span className="text-xs text-slate-500">
              {lead.company ? `${lead.company} • ` : ''}Tạo lúc: {new Date(lead.createdAt).toLocaleString('vi-VN')}
            </span>
          </div>
        </div>

        {/* Claim button if unclaimed */}
        <div className="flex items-center gap-2">
          {!isClaimed ? (
            <Button
              onClick={handleClaim}
              variant="primary"
              size="sm"
              className="bg-[#BE1E2D] hover:bg-[#D04210] font-bold text-xs shadow-xs"
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              <span>Nhận xử lý hồ sơ này</span>
            </Button>
          ) : (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Đã nhận: <strong>{lead.claimedBy}</strong></span>
            </span>
          )}

          {/* Quick status dropdown */}
          <select
            value={lead.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="text-xs font-bold bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-700"
          >
            <option value="NEW">Trạng thái: MỚI</option>
            <option value="NEEDS_HUMAN">🚨 CHỜ NHÂN VIÊN</option>
            <option value="CLAIMED">✅ ĐÃ TIẾP NHẬN</option>
            <option value="CONTACTED">📞 ĐÃ LIÊN HỆ</option>
            <option value="QUOTED">📄 ĐÃ GỬI BÁO GIÁ</option>
            <option value="WON">🎉 ĐÃ CHỐT ĐƠN</option>
            <option value="LOST">ĐÓNG/THẤT BẠI</option>
          </select>
        </div>
      </div>

      {/* 3-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ==================================================== */}
        {/* COLUMN 1 (LEFT - 3.5 cols): Customer Brief + Lead Score */}
        {/* ==================================================== */}
        <div className="lg:col-span-4 space-y-4">
          {/* Quick Action Contacts */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-400">Kết nối khách hàng</h3>
            <div className="flex gap-2">
              {cleanPhone && (
                <>
                  <a
                    href={`tel:${cleanPhone}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Gọi điện</span>
                  </a>
                  <a
                    href={`https://zalo.me/${cleanPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Mở Zalo</span>
                  </a>
                </>
              )}
              {lead.email && (
                <a
                  href={`mailto:${lead.email}`}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all"
                  title="Gửi Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
              <button
                onClick={handleCopySummary}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
                title="Sao chép tóm tắt đơn hàng"
              >
                {copiedSummary ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Lead Scoring Box */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-400">Xếp hạng Lead</span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                  lead.score === 'HOT'
                    ? 'bg-red-100 text-[#BE1E2D]'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                {lead.score}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-snug">
              Chấm điểm tự động theo số lượng, deadline & liên hệ do AI thu thập.
            </p>
          </div>

          {/* Customer Brief Form / View */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="font-bold text-sm text-[#1E4384] flex items-center gap-1.5">
                <Package className="w-4 h-4 text-[#BE1E2D]" />
                Customer Brief
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingBrief(!isEditingBrief)}
                className="text-xs font-bold text-[#BE1E2D] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>{isEditingBrief ? 'Hủy' : 'Sửa'}</span>
              </button>
            </div>

            {isEditingBrief ? (
              <form onSubmit={handleSaveBrief} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-500 font-semibold block">Sản phẩm</label>
                  <input
                    type="text"
                    value={briefForm.productType || ''}
                    onChange={(e) => setBriefForm({ ...briefForm, productType: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-500 font-semibold block">Số lượng</label>
                  <input
                    type="text"
                    value={briefForm.quantity || ''}
                    onChange={(e) => setBriefForm({ ...briefForm, quantity: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-500 font-semibold block">Kích thước</label>
                  <input
                    type="text"
                    value={briefForm.dimensions || ''}
                    onChange={(e) => setBriefForm({ ...briefForm, dimensions: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-500 font-semibold block">Chất liệu</label>
                  <input
                    type="text"
                    value={briefForm.material || ''}
                    onChange={(e) => setBriefForm({ ...briefForm, material: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-500 font-semibold block">Tiến độ giao</label>
                  <input
                    type="text"
                    value={briefForm.deadline || ''}
                    onChange={(e) => setBriefForm({ ...briefForm, deadline: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <Button type="submit" variant="primary" size="sm" className="w-full bg-[#BE1E2D]">
                  Lưu thay đổi
                </Button>
              </form>
            ) : (
              <div className="space-y-2 text-xs divide-y divide-slate-100">
                <div className="pt-1.5 flex justify-between">
                  <span className="text-slate-400">Sản phẩm:</span>
                  <span className="font-bold text-slate-800 text-right">{lead.productType}</span>
                </div>
                <div className="pt-1.5 flex justify-between">
                  <span className="text-slate-400">Số lượng:</span>
                  <span className="font-bold text-slate-800">{lead.quantity || 'Chưa rõ'}</span>
                </div>
                <div className="pt-1.5 flex justify-between">
                  <span className="text-slate-400">Kích thước:</span>
                  <span className="text-slate-800">{lead.brief?.dimensions || 'Theo chuẩn'}</span>
                </div>
                <div className="pt-1.5 flex justify-between">
                  <span className="text-slate-400">Chất liệu:</span>
                  <span className="text-slate-800 text-right max-w-[180px] truncate">{lead.brief?.material || 'Tư vấn xưởng'}</span>
                </div>
                <div className="pt-1.5 flex justify-between">
                  <span className="text-slate-400">Gia công:</span>
                  <span className="text-slate-800">{lead.brief?.finishing || 'Cán màng/bế'}</span>
                </div>
                <div className="pt-1.5 flex justify-between">
                  <span className="text-slate-400">Tiến độ:</span>
                  <span className="font-semibold text-slate-800">{lead.deadline || 'Tiêu chuẩn'}</span>
                </div>
                {lead.brief?.notes && (
                  <div className="pt-2">
                    <span className="text-slate-400 block mb-1">Ghi chú:</span>
                    <p className="bg-slate-50 p-2 rounded-lg text-slate-700 font-mono text-[11px]">
                      {lead.brief.notes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ==================================================== */}
        {/* COLUMN 2 (CENTER - 5 cols): Live Conversation & Chat */}
        {/* ==================================================== */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[750px] overflow-hidden">
          {/* Conversation Header */}
          <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#1E4384]">Hội thoại khách hàng</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isHumanMode ? 'bg-red-100 text-[#BE1E2D]' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {isHumanMode ? '👤 HUMAN TAKEOVER' : '🤖 BOT AI'}
              </span>
            </div>

            <Button
              onClick={handleTakeoverToggle}
              variant="outline"
              size="sm"
              className="text-xs font-bold"
            >
              {isHumanMode ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 mr-1 text-[#BE1E2D]" />
                  <span>Trả lại AI</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-3.5 h-3.5 mr-1 text-[#BE1E2D]" />
                  <span>Tiếp quản</span>
                </>
              )}
            </Button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8FAFC]">
            {(!messages || messages.length === 0) ? (
              <div className="text-center text-xs text-slate-400 pt-8">Chưa có tin nhắn nào.</div>
            ) : (
              messages.map((m: any) => {
                const isCustomer = m.sender === 'CUSTOMER';
                const isStaff = m.sender === 'STAFF';
                const isSystem = m.sender === 'SYSTEM';

                if (isSystem) {
                  return (
                    <div key={m.id} className="text-center my-2">
                      <span className="text-[10px] text-slate-500 bg-slate-200/80 px-2.5 py-0.5 rounded-full inline-block">
                        {m.text}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5">
                      {isCustomer ? (
                        <span>Khách</span>
                      ) : isStaff ? (
                        <span className="text-[#BE1E2D] font-bold">{m.staffName || 'Nhân viên'}</span>
                      ) : (
                        <span className="text-blue-600 font-semibold">Bot</span>
                      )}
                      <span>• {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    <div
                      className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-xs whitespace-pre-wrap shadow-xs ${
                        isCustomer
                          ? 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                          : isStaff
                          ? 'bg-[#BE1E2D] text-white rounded-tr-xs'
                          : 'bg-[#1E4384] text-white rounded-tr-xs'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Send Input Form */}
          <form onSubmit={handleSendReply} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Soạn tin nhắn gửi khách..."
              className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-xl focus:border-[#BE1E2D] focus:outline-none"
            />
            <Button
              type="submit"
              disabled={!replyText.trim() || isSendingReply}
              variant="primary"
              size="sm"
              className="bg-[#BE1E2D] hover:bg-[#D04210]"
            >
              <Send className="w-3.5 h-3.5 mr-1" />
              <span>Gửi</span>
            </Button>
          </form>
        </div>

        {/* ==================================================== */}
        {/* COLUMN 3 (RIGHT - 3.5 cols): Internal Notes & Events */}
        {/* ==================================================== */}
        <div className="lg:col-span-3 space-y-4">
          {/* Internal Notes Box */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-xs uppercase text-slate-400">Ghi chú nội bộ (Khách không thấy)</h3>

            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                rows={2}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Ví dụ: Đã gọi điện, khách hẹn gửi mẫu lúc 14h..."
                className="w-full text-xs p-2 border border-slate-300 rounded-xl focus:border-[#BE1E2D] focus:outline-none resize-none"
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={isAddingNote || !noteText.trim()} variant="primary" size="sm" className="bg-[#1E4384] text-xs">
                  Thêm ghi chú
                </Button>
              </div>
            </form>

            <div className="space-y-2 max-h-48 overflow-y-auto divide-y divide-slate-100 text-xs">
              {notes?.map((n: any) => (
                <div key={n.id} className="pt-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-bold text-slate-700">{n.authorName}</span>
                    <span>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-slate-800 mt-0.5">{n.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* LeadEvent Audit Timeline */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <h3 className="font-bold text-xs uppercase text-slate-400">Dòng thời gian sự kiện</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto text-xs divide-y divide-slate-100">
              {events?.map((ev: any) => (
                <div key={ev.id} className="pt-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span className="font-semibold text-slate-700">{ev.type}</span>
                    <span>{new Date(ev.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <span className="text-slate-500 block truncate">
                    {ev.actorName ? `Bởi ${ev.actorName}` : 'Hệ thống tự động'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Notification Logs */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <h3 className="font-bold text-xs uppercase text-slate-400">Log thông báo đã gửi</h3>
            <div className="space-y-1.5 text-xs">
              {notificationLogs?.map((nl: any) => (
                <div key={nl.id} className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-slate-50">
                  <span className="font-bold uppercase text-slate-700">{nl.channel}</span>
                  <span
                    className={`font-semibold px-2 py-0.2 rounded text-[10px] ${
                      nl.status === 'SENT' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {nl.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
