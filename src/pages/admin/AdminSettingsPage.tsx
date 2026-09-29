import React, { useState, useEffect } from 'react';
import {
  Settings,
  Users,
  Shield,
  Clock,
  Send,
  Plus,
  Save,
  CheckCircle2,
  KeyRound,
  UserCheck,
  AlertCircle,
} from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { Button } from '../../components/ui/Button';

export const AdminSettingsPage: React.FC = () => {
  const { token, user } = useAdminAuth();
  const [settings, setSettings] = useState<any>({
    working_hours: '08:00 - 17:30',
    escalation_minutes: 10,
    hot_threshold_quantity: 5000,
    telegram_enabled: true,
    zalo_enabled: false,
    email_enabled: true,
  });
  const [usersList, setUsersList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New user form state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPass, setNewUserPass] = useState('');
  const [newUserRole, setNewUserRole] = useState<'SALES' | 'MANAGER' | 'ADMIN'>('SALES');
  const [newUserTele, setNewUserTele] = useState('');
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);

  const fetchSettingsAndUsers = async () => {
    setIsLoading(true);
    try {
      const [settingsRes, usersRes] = await Promise.all([
        fetch('/api/admin/settings', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (settingsRes.ok) {
        const sData = await settingsRes.json();
        setSettings(sData.settings || {});
      }
      if (usersRes.ok) {
        const uData = await usersRes.json();
        setUsersList(uData.users || []);
      }
    } catch (err) {
      console.error('Fetch settings failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettingsAndUsers();
  }, [token]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ settings }),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Save settings error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserError(null);
    setIsCreatingUser(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          password: newUserPass,
          role: newUserRole,
          telegramUserId: newUserTele,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Tạo nhân viên thất bại.');
      }

      setShowAddUserModal(false);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPass('');
      setNewUserTele('');
      fetchSettingsAndUsers();
    } catch (err: any) {
      setUserError(err.message);
    } finally {
      setIsCreatingUser(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <span className="text-[11px] font-bold text-[#E8531D] uppercase tracking-wider block">
          SYSTEM CONFIGURATION & ACCESS CONTROL
        </span>
        <h1 className="text-2xl font-black text-[#0B2A4A] mt-0.5">
          Cài Đặt Hệ Thống & Quản Lý Người Dùng
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Cấu hình quy tắc chấm điểm Lead, giờ trực và phân quyền nhân viên kinh doanh.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Đã lưu thành công cấu hình hệ thống!</span>
        </div>
      )}

      {/* 1. Core Operating Settings */}
      <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-[#0B2A4A] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#E8531D]" />
            Khung Giờ Hoạt Động & Quy Tắc Nhắc Việc
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Khung giờ làm việc trực tiếp</label>
            <input
              type="text"
              value={settings.working_hours || ''}
              onChange={(e) => setSettings({ ...settings, working_hours: e.target.value })}
              placeholder="08:00 - 17:30"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:border-[#E8531D] focus:outline-none"
            />
            <span className="text-[11px] text-slate-400">Ngoài giờ này bot sẽ hẹn phản hồi trước 9h00 sáng mai</span>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Thời gian nhắc nhở Telegram (phút)</label>
            <input
              type="number"
              value={settings.escalation_minutes || 10}
              onChange={(e) => setSettings({ ...settings, escalation_minutes: Number(e.target.value) })}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:border-[#E8531D] focus:outline-none"
            />
            <span className="text-[11px] text-slate-400">Nếu lead HOT chưa có ai nhận sau số phút này</span>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Ngưỡng số lượng xếp hạng HOT</label>
            <input
              type="number"
              value={settings.hot_threshold_quantity || 5000}
              onChange={(e) => setSettings({ ...settings, hot_threshold_quantity: Number(e.target.value) })}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:border-[#E8531D] focus:outline-none"
            />
            <span className="text-[11px] text-slate-400">Đơn hàng từ ngưỡng này trở lên sẽ xếp hạng HOT</span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Kênh thông báo tự động</label>
            <div className="flex flex-wrap gap-4 pt-1">
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.telegram_enabled}
                  onChange={(e) => setSettings({ ...settings, telegram_enabled: e.target.checked })}
                  className="rounded text-[#E8531D]"
                />
                <span>Telegram Bot</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.zalo_enabled}
                  onChange={(e) => setSettings({ ...settings, zalo_enabled: e.target.checked })}
                  className="rounded text-[#E8531D]"
                />
                <span>Zalo OA API</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.email_enabled}
                  onChange={(e) => setSettings({ ...settings, email_enabled: e.target.checked })}
                  className="rounded text-[#E8531D]"
                />
                <span>Email Sales</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <Button
            type="submit"
            disabled={isSaving}
            variant="primary"
            size="md"
            className="bg-[#E8531D] hover:bg-[#D04210] font-bold text-xs"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            <span>{isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}</span>
          </Button>
        </div>
      </form>

      {/* 2. User Management Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-[#0B2A4A] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#E8531D]" />
              Danh Sách Nhân Viên & Phân Quyền
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Nhân viên có thể nhận lead từ Telegram hoặc trực tiếp trên giao diện CRM.
            </p>
          </div>

          {user?.role === 'ADMIN' && (
            <Button
              onClick={() => setShowAddUserModal(true)}
              variant="outline"
              size="sm"
              className="text-xs font-bold border-slate-300"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Thêm nhân viên</span>
            </Button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase">
                <th className="py-2.5 px-3">Họ và tên</th>
                <th className="py-2.5 px-3">Email</th>
                <th className="py-2.5 px-3">Vai trò</th>
                <th className="py-2.5 px-3">Telegram ID</th>
                <th className="py-2.5 px-3 text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-bold text-slate-900">{u.name}</td>
                  <td className="py-3 px-3 text-slate-600 font-mono">{u.email}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        u.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-800'
                          : u.role === 'MANAGER'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500">{u.telegramUserId || 'Chưa liên kết'}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Hoạt động
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-base text-[#0B2A4A] border-b border-slate-100 pb-3">
              Thêm Nhân Viên Mới
            </h3>

            {userError && (
              <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{userError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block">Họ và tên</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Nguyễn Văn B"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:border-[#E8531D] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block">Email làm việc</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="b.nguyen@vietlabel.com.vn"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:border-[#E8531D] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block">Mật khẩu ban đầu</label>
                <input
                  type="password"
                  required
                  value={newUserPass}
                  onChange={(e) => setNewUserPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:border-[#E8531D] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block">Vai trò</label>
                  <select
                    value={newUserRole}
                    onChange={(e: any) => setNewUserRole(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:border-[#E8531D] focus:outline-none"
                  >
                    <option value="SALES">SALES (Kinh doanh)</option>
                    <option value="MANAGER">MANAGER (Quản lý)</option>
                    <option value="ADMIN">ADMIN (Quản trị)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block">Telegram Username</label>
                  <input
                    type="text"
                    value={newUserTele}
                    onChange={(e) => setNewUserTele(e.target.value)}
                    placeholder="@username"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:border-[#E8531D] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddUserModal(false)}>
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={isCreatingUser}
                  variant="primary"
                  size="sm"
                  className="bg-[#E8531D] hover:bg-[#D04210] font-bold text-xs"
                >
                  {isCreatingUser ? 'Đang tạo...' : 'Tạo tài khoản'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
