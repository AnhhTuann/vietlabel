import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Package,
  Users,
  ChevronRight,
  RefreshCw,
  Phone,
  MessageCircle,
  Award,
} from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

export const AdminOverviewPage: React.FC = () => {
  const { token } = useAdminAuth();
  const [stats, setStats] = useState<any>(null);
  const [urgentLeads, setUrgentLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, leadsRes] = await Promise.all([
        fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/leads?status=NEEDS_HUMAN&limit=5', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (leadsRes.ok) {
        const leadsData = await leadsRes.json();
        setUrgentLeads(leadsData.leads || []);
      }
    } catch (err) {
      console.error('Fetch dashboard failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-[11px] font-bold text-[#E8531D] uppercase tracking-wider block">
            TRUNG TÂM ĐIỀU HÀNH B2B REALTIME
          </span>
          <h1 className="text-2xl font-black text-[#0B2A4A] mt-0.5">
            Tổng Quan Hoạt Động Tư Vấn & Kinh Doanh
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi dòng chảy khách hàng tiềm năng, hiệu suất phản hồi và tỷ lệ chuyển đổi đơn hàng.
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Làm mới số liệu</span>
        </button>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Tổng hồ sơ lead</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-black text-[#0B2A4A]">
            {stats?.metrics?.totalLeads || 0}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +18% so với tuần trước
          </span>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-orange-200 bg-orange-50/20 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase text-[#E8531D]">Lead HOT</span>
            <Flame className="w-4 h-4 text-[#E8531D]" />
          </div>
          <div className="text-3xl font-black text-[#E8531D]">
            {stats?.metrics?.hotLeads || 0}
          </div>
          <span className="text-[11px] text-slate-500">
            Số lượng lớn hoặc deadline gấp
          </span>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase text-rose-600">Chờ hỗ trợ</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-black text-rose-600">
            {stats?.metrics?.needsHuman || 0}
          </div>
          <span className="text-[11px] text-rose-700 font-medium">
            Khách đang chờ nhân viên
          </span>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Thời gian phản hồi</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-800">
            {stats?.metrics?.avgFrtMinutes || 18} <span className="text-sm font-semibold text-slate-500">phút</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Mục tiêu cam kết &lt; 30 phút
          </span>
        </div>
      </div>

      {/* Urgent Leads Need Action List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <h2 className="text-sm sm:text-base font-bold text-[#0B2A4A]">
              Hồ Sơ Cần Xử Lý Ngay (HOT / Khách Yêu Cầu Hỗ Trợ)
            </h2>
          </div>
          <Link
            to="/admin/leads?status=NEEDS_HUMAN"
            className="text-xs font-bold text-[#E8531D] hover:underline flex items-center gap-1"
          >
            <span>Xem tất cả</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {urgentLeads.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            Hiện không có hồ sơ nào đang chờ khẩn cấp. Mọi yêu cầu đã được phân bổ!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {urgentLeads.map((l) => (
              <div
                key={l.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 rounded-xl px-2 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {l.code}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{l.customerName}</span>
                    {l.company && <span className="text-xs text-slate-500">({l.company})</span>}
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                      CẦN GẶP NGƯỜI
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 flex items-center gap-3">
                    <span><strong>Nhu cầu:</strong> {l.productType}</span>
                    {l.quantity && <span>• <strong>SL:</strong> {l.quantity}</span>}
                    {l.phone && (
                      <span className="text-emerald-700 font-bold font-mono">
                        📞 {l.phone}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {l.phone && (
                    <a
                      href={`tel:${l.phone}`}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Gọi ngay</span>
                    </a>
                  )}
                  <Link
                    to={`/admin/leads/${l.id}`}
                    className="px-3 py-1.5 rounded-lg bg-[#0B2A4A] hover:bg-[#164373] text-white font-bold text-xs"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Two Column Layout: Top Products & Agent Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products Requested */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-[#0B2A4A] flex items-center gap-2">
            <Package className="w-4 h-4 text-[#E8531D]" />
            Nhóm Sản Phẩm Được Hỏi Nhiều Nhất
          </h3>

          <div className="space-y-3">
            {(stats?.topProducts || []).map((item: any, idx: number) => {
              const max = Math.max(...(stats?.topProducts || []).map((p: any) => p.count), 1);
              const percentage = Math.round((item.count / max) * 100);

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>{item.product}</span>
                    <span className="font-bold text-slate-900">{item.count} yêu cầu</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#E8531D] to-orange-400 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Agent Performance Leaderboard */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-[#0B2A4A] flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            Hiệu Suất Chăm Sóc Của Nhân Viên Kinh Doanh
          </h3>

          <div className="divide-y divide-slate-100">
            {(stats?.agentPerformance || []).map((agent: any, idx: number) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800 block">{agent.name}</span>
                  <span className="text-[11px] text-slate-400">
                    Đã nhận: {agent.claimed} • Đã liên hệ: {agent.contacted}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-emerald-700 text-sm block">
                    {agent.won} đơn chốt
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Tỷ lệ: {agent.conversionRate}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
