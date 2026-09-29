import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Flame,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  MessageCircle,
  Filter,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Building,
  Kanban,
  Table as TableIcon,
  Download,
  ArrowRight,
} from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useAdminRealtime } from '../../hooks/useAdminRealtime';
import { Button } from '../../components/ui/Button';

export const AdminLeadsPage: React.FC = () => {
  const { token, user } = useAdminAuth();
  const [leads, setLeads] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ total: 0, hot: 0, warm: 0, cold: 0, needsHuman: 0, claimed: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'TABLE' | 'KANBAN'>('TABLE');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Realtime updates
  useAdminRealtime((eventName) => {
    if (eventName === 'lead:new' || eventName === 'lead:updated') {
      fetchLeads();
    }
  });

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams();
      if (filterStatus !== 'ALL') query.set('status', filterStatus);
      if (searchQuery) query.set('q', searchQuery);

      const res = await fetch(`/api/admin/leads?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error('Fetch leads failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [filterStatus]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLeads();
  };

  const handleQuickStatusChange = async (leadId: string, newStatus: string) => {
    try {
      await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchLeads();
    } catch (err) {
      console.error('Update status failed:', err);
    }
  };

  const handleExportCsv = () => {
    window.open('/api/admin/export.csv', '_blank');
  };

  const kanbanColumns = [
    { id: 'NEW', title: 'Mới nhận', color: 'border-slate-300 text-slate-700 bg-slate-100' },
    { id: 'NEEDS_HUMAN', title: '🚨 Chờ hỗ trợ', color: 'border-rose-400 text-rose-700 bg-rose-50' },
    { id: 'CLAIMED', title: '✅ Đã tiếp nhận', color: 'border-amber-400 text-amber-800 bg-amber-50' },
    { id: 'CONTACTED', title: '📞 Đã liên hệ', color: 'border-blue-400 text-blue-800 bg-blue-50' },
    { id: 'QUOTED', title: '📄 Đã gửi báo giá', color: 'border-purple-400 text-purple-800 bg-purple-50' },
    { id: 'WON', title: '🎉 Chốt hợp đồng', color: 'border-emerald-400 text-emerald-800 bg-emerald-50' },
    { id: 'LOST', title: 'Đóng/Thất bại', color: 'border-slate-200 text-slate-500 bg-slate-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#E8531D] uppercase tracking-wider">
            <span>HỆ THỐNG QUẢN TRỊ B2B VIETLABEL</span>
            <span>•</span>
            <span className="text-slate-500 font-normal">REALTIME LEAD NOTIFIER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2A4A] mt-1">
            Trung Tâm Quản Lý Yêu Cầu & Báo Giá (CRM)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Theo dõi các hồ sơ Customer Brief từ Trợ lý AI và kênh Telegram/Zalo thông báo tự động.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* View mode toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('TABLE')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'TABLE' ? 'bg-white shadow-xs text-[#0B2A4A]' : 'text-slate-500'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Bảng</span>
            </button>
            <button
              onClick={() => setViewMode('KANBAN')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'KANBAN' ? 'bg-white shadow-xs text-[#0B2A4A]' : 'text-slate-500'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
          </div>

          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer transition-colors"
            title="Xuất dữ liệu Excel CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Xuất CSV</span>
          </button>

          <button
            onClick={fetchLeads}
            disabled={isLoading}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Tổng hồ sơ</span>
          <div className="text-2xl font-black text-slate-800 mt-1">{stats.total}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-orange-200 bg-orange-50/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#E8531D] uppercase">Lead HOT</span>
            <Flame className="w-4 h-4 text-[#E8531D]" />
          </div>
          <div className="text-2xl font-black text-[#E8531D] mt-1">{stats.hot}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-rose-600 uppercase">Chờ hỗ trợ</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 mt-1">{stats.needsHuman}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-emerald-600 uppercase">Đã nhận xử lý</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{stats.claimed}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Lead WARM</span>
          <div className="text-2xl font-black text-amber-600 mt-1">{stats.warm}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Lead COLD</span>
          <div className="text-2xl font-black text-slate-500 mt-1">{stats.cold}</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {[
            { id: 'ALL', label: 'Tất cả' },
            { id: 'NEEDS_HUMAN', label: '🚨 Cần gặp nhân viên' },
            { id: 'CLAIMED', label: '✅ Đã nhận' },
            { id: 'NEW', label: 'Mới' },
            { id: 'WON', label: 'Đã chốt' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterStatus === tab.id
                  ? 'bg-[#0B2A4A] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 w-full sm:w-72">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên, SĐT, mã lead..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:border-[#E8531D] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-[#E8531D] hover:bg-[#D04210] text-white text-xs font-semibold cursor-pointer"
          >
            Tìm
          </button>
        </form>
      </div>

      {/* Main View: Table or Kanban */}
      {viewMode === 'TABLE' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#E8531D] mb-2" />
              Đang tải danh sách yêu cầu...
            </div>
          ) : leads.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              Chưa có yêu cầu nào phù hợp với bộ lọc hiện tại.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 overflow-x-auto">
              {leads.map((lead) => {
                const isHot = lead.score === 'HOT';
                const isNeedsHuman = lead.status === 'NEEDS_HUMAN';
                const isClaimed = lead.status === 'CLAIMED';

                return (
                  <div
                    key={lead.id}
                    className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {lead.code || `#${lead.id.slice(-4)}`}
                        </span>

                        {isNeedsHuman && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                            <AlertCircle className="w-3 h-3" />
                            CẦN GẶP NHÂN VIÊN
                          </span>
                        )}

                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            isHot
                              ? 'bg-orange-100 text-[#E8531D]'
                              : lead.score === 'WARM'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <Flame className="w-3 h-3" />
                          LEAD {lead.score}
                        </span>

                        {isClaimed ? (
                          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            ✅ Đã nhận bởi: {lead.claimedBy}
                          </span>
                        ) : (
                          <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                            ⏳ Chưa có người nhận
                          </span>
                        )}

                        <span className="text-[11px] text-slate-400">
                          {new Date(lead.createdAt).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            day: '2-digit',
                            month: '2-digit',
                          })}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-800">
                        <span className="font-bold text-slate-900">
                          {lead.customerName || 'Khách hàng web'}
                        </span>
                        {lead.company && (
                          <span className="text-slate-500 flex items-center gap-1 text-xs">
                            <Building className="w-3.5 h-3.5" />
                            {lead.company}
                          </span>
                        )}
                        <span className="font-mono text-emerald-700 font-bold flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" />
                          {lead.phone || lead.contact || 'Chưa để lại số'}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span><strong>Sản phẩm:</strong> {lead.productType}</span>
                        {lead.quantity && <span>• <strong>SL:</strong> {lead.quantity}</span>}
                        {lead.deadline && <span>• <strong>Tiến độ:</strong> {lead.deadline}</span>}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      {(lead.phone || lead.contact) && (
                        <>
                          <a
                            href={`tel:${lead.phone || lead.contact}`}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 transition-colors"
                            title="Gọi điện trực tiếp"
                          >
                            <Phone className="w-4 h-4" />
                          </a>

                          <a
                            href={`https://zalo.me/${(lead.phone || lead.contact || '').replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition-colors"
                            title="Mở Zalo nhắn tin"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                        </>
                      )}

                      <Link
                        to={`/admin/leads/${lead.id}`}
                        className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#0B2A4A] hover:bg-[#164373] text-white text-xs font-bold transition-all shadow-xs"
                      >
                        <span>Xem chi tiết</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* KANBAN BOARD VIEW */
        <div className="flex gap-4 overflow-x-auto pb-4">
          {kanbanColumns.map((col) => {
            const colLeads = leads.filter((l) => l.status === col.id);

            return (
              <div
                key={col.id}
                className="w-72 shrink-0 bg-slate-200/60 rounded-2xl p-3 flex flex-col space-y-3"
              >
                <div className="flex items-center justify-between px-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${col.color}`}>
                    {col.title}
                  </span>
                  <span className="text-xs font-bold text-slate-600 bg-white px-2 py-0.5 rounded-full shadow-xs">
                    {colLeads.length}
                  </span>
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto max-h-[calc(100vh-20rem)] pr-0.5">
                  {colLeads.map((l) => (
                    <div
                      key={l.id}
                      className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-2 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                          {l.code}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            l.score === 'HOT'
                              ? 'bg-orange-100 text-[#E8531D]'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {l.score}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-xs text-slate-900 leading-tight">
                          {l.customerName}
                        </h4>
                        {l.company && (
                          <span className="text-[11px] text-slate-500 block truncate">
                            {l.company}
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-600 space-y-0.5">
                        <span className="block truncate font-medium text-slate-800">
                          {l.productType}
                        </span>
                        {l.quantity && <span>SL: {l.quantity}</span>}
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <Link
                          to={`/admin/leads/${l.id}`}
                          className="text-[11px] font-bold text-[#0B2A4A] hover:text-[#E8531D] flex items-center gap-0.5"
                        >
                          <span>Hồ sơ</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>

                        {/* Status Quick Select */}
                        <select
                          value={l.status}
                          onChange={(e) => handleQuickStatusChange(l.id, e.target.value)}
                          className="text-[10px] bg-slate-50 border border-slate-200 rounded px-1 py-0.5 font-semibold text-slate-600"
                        >
                          <option value="NEW">Mới</option>
                          <option value="NEEDS_HUMAN">Chờ hỗ trợ</option>
                          <option value="CLAIMED">Đã nhận</option>
                          <option value="CONTACTED">Đã gọi</option>
                          <option value="QUOTED">Đã báo giá</option>
                          <option value="WON">Chốt đơn</option>
                          <option value="LOST">Đóng</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
