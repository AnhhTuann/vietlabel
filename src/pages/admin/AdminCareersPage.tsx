import { Edit2, Plus, Trash2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { api } from '../../services/api';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  benefits: string;
  deadline: string;
  status: 'OPEN' | 'CLOSED';
}

export const AdminCareersPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState<Partial<Job> | null>(null);

  const fetchJobs = async () => {
    const res = await api.get('/cms/jobs');
    setJobs(res.data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentJob?.id) await api.put(`/cms/jobs/${currentJob.id}`, currentJob);
    else await api.post('/cms/jobs', currentJob);
    setIsModalOpen(false);
    fetchJobs();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Xóa job này?')) return;
    await api.delete(`/cms/jobs/${id}`);
    fetchJobs();
  };

  const deadlineValue =
    currentJob?.deadline && Number.isFinite(Date.parse(currentJob.deadline))
      ? new Date(currentJob.deadline).toISOString().slice(0, 10)
      : '';

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Tuyển dụng - Admin</title>
      </Helmet>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Quản lý Tuyển dụng</h1>
        <button
          onClick={() => {
            setCurrentJob({ status: 'OPEN', deadline: new Date().toISOString().slice(0, 10) });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#BE1E2D] text-white rounded-lg"
        >
          <Plus className="w-5 h-5" /> Thêm vị trí
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4">Vị trí</th>
              <th className="p-4">Phòng ban</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-b border-slate-100">
                <td className="p-4 font-medium">{job.title}</td>
                <td className="p-4">{job.department}</td>
                <td className="p-4">{job.status}</td>
                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => {
                      setCurrentJob(job);
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-blue-600"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(job.id)} className="p-2 text-rose-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-bold">{currentJob?.id ? 'Sửa' : 'Thêm'} việc làm</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <input
                required
                type="text"
                placeholder="Chức danh"
                className="w-full px-4 py-2 border rounded-lg"
                value={currentJob?.title || ''}
                onChange={(e) => setCurrentJob({ ...currentJob, title: e.target.value })}
              />
              <input
                type="text"
                placeholder="Phòng ban"
                className="w-full px-4 py-2 border rounded-lg"
                value={currentJob?.department || ''}
                onChange={(e) => setCurrentJob({ ...currentJob, department: e.target.value })}
              />
              <input
                type="text"
                placeholder="Địa điểm làm việc"
                className="w-full px-4 py-2 border rounded-lg"
                value={currentJob?.location || ''}
                onChange={(e) => setCurrentJob({ ...currentJob, location: e.target.value })}
              />
              <input
                type="text"
                placeholder="Hình thức làm việc"
                className="w-full px-4 py-2 border rounded-lg"
                value={currentJob?.type || ''}
                onChange={(e) => setCurrentJob({ ...currentJob, type: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <label className="space-y-1 text-xs font-medium text-slate-700">
                  Hạn nộp
                  <input
                    type="date"
                    value={deadlineValue}
                    onChange={(e) => setCurrentJob({ ...currentJob, deadline: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </label>
                <label className="space-y-1 text-xs font-medium text-slate-700">
                  Trạng thái
                  <select
                    value={currentJob?.status || 'OPEN'}
                    onChange={(e) =>
                      setCurrentJob({ ...currentJob, status: e.target.value as Job['status'] })
                    }
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="OPEN">Đang tuyển</option>
                    <option value="CLOSED">Đã đóng</option>
                  </select>
                </label>
              </div>
              <textarea
                rows={3}
                placeholder="Mô tả công việc"
                className="w-full px-4 py-2 border rounded-lg"
                value={currentJob?.description || ''}
                onChange={(e) => setCurrentJob({ ...currentJob, description: e.target.value })}
              />
              <textarea
                rows={3}
                placeholder="Yêu cầu ứng viên"
                className="w-full px-4 py-2 border rounded-lg"
                value={currentJob?.requirements || ''}
                onChange={(e) => setCurrentJob({ ...currentJob, requirements: e.target.value })}
              />
              <textarea
                rows={3}
                placeholder="Quyền lợi"
                className="w-full px-4 py-2 border rounded-lg"
                value={currentJob?.benefits || ''}
                onChange={(e) => setCurrentJob({ ...currentJob, benefits: e.target.value })}
              />
              <button type="submit" className="px-5 py-2 bg-[#1E4384] text-white rounded-lg w-full">
                Lưu
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
