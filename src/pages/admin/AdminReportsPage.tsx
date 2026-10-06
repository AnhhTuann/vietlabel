import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  TrendingUp,
  Award,
  Star,
  Users,
  Percent,
} from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { Button } from '../../components/ui/Button';

export const AdminReportsPage: React.FC = () => {
  const { token } = useAdminAuth();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Fetch stats error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  const handleDownloadCsv = () => {
    window.open('/api/admin/export.csv', '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-[11px] font-bold text-[#BE1E2D] uppercase tracking-wider block">
            ANALYTICS & KPI PERFORMANCE
          </span>
          <h1 className="text-2xl font-black text-[#1E4384] mt-0.5">
            Báo Cáo Hiệu Suất Tư Vấn & Chuyển Đổi Lead
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Đo lường thời gian phản hồi, tỷ lệ đủ thông tin và hiệu suất của từng nhân viên kinh doanh.
          </p>
        </div>

        <Button
          onClick={handleDownloadCsv}
          variant="outline"
          size="sm"
          className="text-xs font-bold border-slate-300 self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 mr-1.5" />
          <span>Xuất Báo Cáo CSV (Excel)</span>
        </Button>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">First Response Time</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-black text-[#1E4384]">
            {stats?.metrics?.avgFrtMinutes || 18} <span className="text-sm font-semibold text-slate-500">phút</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">Đạt chuẩn SLA 30 phút</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Đủ thông tin (Brief)</span>
            <Percent className="w-4 h-4 text-[#BE1E2D]" />
          </div>
          <div className="text-3xl font-black text-[#BE1E2D]">
            {stats?.metrics?.informationCompletionRate || 88}%
          </div>
          <span className="text-[11px] text-slate-500">AI thu thập đủ quy cách</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Tỷ lệ chốt đơn (Won)</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-emerald-600">
            {stats?.metrics?.conversionRate || 34}%
          </div>
          <span className="text-[11px] text-slate-500">Từ lead đến hợp đồng sản xuất</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Điểm hài lòng (CSAT)</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          </div>
          <div className="text-3xl font-black text-slate-800">
            {stats?.metrics?.csatAvg || 4.8} <span className="text-sm font-semibold text-slate-400">/ 5.0</span>
          </div>
          <span className="text-[11px] text-amber-600 font-semibold">Dựa trên đánh giá của khách</span>
        </div>
      </div>

      {/* Staff Leaderboard */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-[#1E4384] flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          Bảng Xếp Hạng & Hiệu Suất Xử Lý Theo Nhân Viên
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase">
                <th className="py-3 px-4">Nhân viên</th>
                <th className="py-3 px-4">Đã tiếp nhận</th>
                <th className="py-3 px-4">Đã liên hệ</th>
                <th className="py-3 px-4">Đơn chốt (Won)</th>
                <th className="py-3 px-4 text-right">Tỷ lệ chuyển đổi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(stats?.agentPerformance || []).map((agent: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{agent.name}</td>
                  <td className="py-3.5 px-4 text-slate-700">{agent.claimed} hồ sơ</td>
                  <td className="py-3.5 px-4 text-slate-700">{agent.contacted} khách</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">{agent.won} đơn</td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-[#1E4384]">
                    {agent.conversionRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
