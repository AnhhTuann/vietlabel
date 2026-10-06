import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  ChevronDown,
  Upload,
  CheckCircle2,
  FileCheck,
  Send,
  AlertCircle,
} from 'lucide-react';
import { SEO } from '../lib/seo';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
  
  export interface JobPosition {
    id: string;
    departmentVi: string;
    departmentEn: string;
    titleVi: string;
    titleEn: string;
    locationVi: string;
    locationEn: string;
    typeVi: string;
    typeEn: string;
    salaryVi: string;
    salaryEn: string;
    deadline: string;
    responsibilitiesVi: string[];
    responsibilitiesEn: string[];
    requirementsVi: string[];
    requirementsEn: string[];
    benefitsVi: string[];
    benefitsEn: string[];
  }
import { submitJobApplication } from '../services/api';

const applySchema = z.object({
  fullName: z.string().min(2, 'Vui lòng nhập họ và tên'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().min(9, 'Số điện thoại không hợp lệ'),
  jobId: z.string().min(1, 'Vui lòng chọn vị trí ứng tuyển'),
  coverLetter: z.string().optional(),
});

type ApplyFormValues = z.infer<typeof applySchema>;

export const CareersPage: React.FC = () => {
  const { i18n } = useTranslation();
  const [jobsList, setJobsList] = React.useState<JobPosition[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/cms/jobs');
        const mapped = res.data.filter((j: any) => j.status === 'OPEN').map((j: any) => ({
          id: j.id,
          departmentVi: j.department,
          departmentEn: j.department,
          titleVi: j.title,
          titleEn: j.title,
          locationVi: j.location,
          locationEn: j.location,
          typeVi: j.type,
          typeEn: j.type,
          salaryVi: 'Thỏa thuận',
          salaryEn: 'Negotiable',
          deadline: new Date(j.deadline).toLocaleDateString('vi-VN'),
          responsibilitiesVi: j.description ? j.description.split('\\n') : ['Chi tiết trao đổi khi phỏng vấn'],
          responsibilitiesEn: j.description ? j.description.split('\\n') : ['Details discussed during interview'],
          requirementsVi: j.requirements ? j.requirements.split('\\n') : ['Có kinh nghiệm liên quan'],
          requirementsEn: j.requirements ? j.requirements.split('\\n') : ['Relevant experience'],
          benefitsVi: j.benefits ? j.benefits.split('\\n') : ['BHXH đầy đủ', 'Thưởng Lễ Tết'],
          benefitsEn: j.benefits ? j.benefits.split('\\n') : ['Social insurance', 'Holiday bonus']
        }));
        setJobsList(mapped);
      } catch(err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);
  const currentLang = i18n.language;

  const [expandedJobId, setExpandedJobId] = useState<string | null>(jobsList[0]?.id || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ApplyFormValues>({
    resolver: zodResolver(applySchema),
    defaultValues: {
      jobId: jobsList[0]?.id || '',
    },
  });

  const toggleJob = (id: string) => {
    setExpandedJobId(expandedJobId === id ? null : id);
  };

  const handleApplyClick = (job: JobPosition) => {
    setValue('jobId', job.id);
    const formElem = document.getElementById('ung-tuyen-form');
    if (formElem) {
      formElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!validTypes.includes(file.type)) {
        setFileError('Chỉ chấp nhận file định dạng PDF, DOC, DOCX.');
        setSelectedFile(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setFileError('Kích thước file không được vượt quá 5MB.');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
    }
  };

  const onSubmit = async (values: ApplyFormValues) => {
    if (!selectedFile) {
      setFileError('Vui lòng đính kèm file CV của bạn (PDF/DOC, tối đa 5MB).');
      return;
    }

    setIsSubmitting(true);
    const job = jobsList.find((j) => j.id === values.jobId);

    try {
      const res = await submitJobApplication({
        jobId: values.jobId,
        jobTitle: job ? job.titleVi : 'Vị trí chung',
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        coverLetter: values.coverLetter,
        cvFileName: selectedFile.name,
        cvFileSize: selectedFile.size,
      });

      if (res.success) {
        setIsSuccess(true);
        reset();
        setSelectedFile(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-20">
      <SEO
        title="Tuyển Dụng Nhân Tài | Cơ Hội Nghề Nghiệp Tại Vietlabel"
        description="Gia nhập đội ngũ hơn 200 nhân sự tài năng tại Vietlabel: Kỹ sư vận hành máy in Flexo & Offset, chuyên viên thiết kế CAD 3D, kinh doanh B2B."
      />

      {/* Hero */}
      <section className="bg-[#1E4384] text-white py-16 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 inline-block">
            CƠ HỘI NGHỀ NGHIỆP
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight [text-wrap:balance]">
            Cùng Vietlabel kiến tạo tương lai ngành bao bì & tem nhãn
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Chúng tôi luôn tìm kiếm những cộng sự đam mê, tận tâm và không ngừng sáng tạo để cùng mang đến những giải pháp đóng gói đẳng cấp quốc tế.
          </p>
        </div>
      </section>

      {/* Jobs Accordion Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            kicker="VỊ TRÍ TUYỂN DỤNG HIỆN TẠI"
            title="Các cơ hội nghề nghiệp đang mở"
            subtitle="Đãi ngộ cạnh tranh, môi trường làm việc chuẩn 5S hiện đại và cơ hội thăng tiến rộng mở"
          />

          <div className="space-y-4">
            {jobsList.map((job) => {
              const isExpanded = expandedJobId === job.id;
              return (
                <div
                  key={job.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isExpanded
                      ? 'border-[#1E4384] bg-white shadow-lg'
                      : 'border-slate-200 bg-[#FAFAFC] hover:border-slate-300'
                  }`}
                >
                  {/* Header clickable summary */}
                  <div
                    onClick={() => toggleJob(job.id)}
                    className="p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1">
                        <span className="font-semibold text-[#BE1E2D]">{job.departmentVi}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {job.locationVi}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 font-semibold text-emerald-600">
                          <DollarSign className="w-3.5 h-3.5" />
                          {job.salaryVi}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-[#1E4384]">
                        {job.titleVi}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApplyClick(job);
                        }}
                      >
                        Ứng tuyển
                      </Button>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition-transform ${
                          isExpanded ? 'rotate-180 text-[#1E4384]' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-slate-100 space-y-5 text-xs sm:text-sm text-slate-700">
                      <div>
                        <h4 className="font-bold text-[#1E4384] uppercase text-xs tracking-wider mb-2">
                          Mô tả công việc:
                        </h4>
                        <ul className="space-y-1.5 list-disc pl-5">
                          {job.responsibilitiesVi.map((res, idx) => (
                            <li key={idx}>{res}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-bold text-[#1E4384] uppercase text-xs tracking-wider mb-2">
                          Yêu cầu ứng viên:
                        </h4>
                        <ul className="space-y-1.5 list-disc pl-5">
                          {job.requirementsVi.map((req, idx) => (
                            <li key={idx}>{req}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-bold text-[#1E4384] uppercase text-xs tracking-wider mb-2">
                          Quyền lợi được hưởng:
                        </h4>
                        <ul className="space-y-1.5 list-disc pl-5">
                          {job.benefitsVi.map((ben, idx) => (
                            <li key={idx}>{ben}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                        <span>Hạn nộp hồ sơ: <strong>{job.deadline}</strong></span>
                        <Button
                          variant="navy"
                          size="sm"
                          onClick={() => handleApplyClick(job)}
                        >
                          Điền form ứng tuyển vị trí này
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Online Application Form with CV Upload */}
      <section id="ung-tuyen-form" className="py-20 bg-[#F5F7FA]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-10 shadow-xl">
            {isSuccess ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Nộp hồ sơ ứng tuyển thành công!
                </h3>
                <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
                  Cảm ơn bạn đã quan tâm đến cơ hội nghề nghiệp tại Vietlabel. Bộ phận Tuyển dụng sẽ thẩm định hồ sơ và liên hệ phỏng vấn trong 3-5 ngày làm việc.
                </p>
                <div className="mt-6">
                  <Button variant="primary" onClick={() => setIsSuccess(false)}>
                    Ứng tuyển vị trí khác
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#BE1E2D]">
                    GỬI HỒ SƠ TRỰC TUYẾN
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1E4384] mt-1">
                    Biểu mẫu ứng tuyển nhân sự
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Đính kèm CV chi tiết của bạn để Phòng Nhân sự Vietlabel chủ động liên lạc.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Vị trí ứng tuyển <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('jobId')}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm bg-white focus:border-[#1E4384] focus:outline-none focus:ring-1 focus:ring-[#1E4384]"
                    >
                      {jobsList.map((j) => (
                        <option key={j.id} value={j.id}>
                          {j.titleVi} ({j.departmentVi})
                        </option>
                      ))}
                    </select>
                    {errors.jobId && (
                      <p className="mt-1 text-xs text-red-500">{errors.jobId.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Họ và tên ứng viên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('fullName')}
                        placeholder="Nguyễn Văn A"
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#1E4384] focus:outline-none focus:ring-1 focus:ring-[#1E4384]"
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        {...register('phone')}
                        placeholder="0912 345 678"
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#1E4384] focus:outline-none focus:ring-1 focus:ring-[#1E4384]"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email liên hệ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      {...register('email')}
                      placeholder="ungvien@gmail.com"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#1E4384] focus:outline-none focus:ring-1 focus:ring-[#1E4384]"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                  {/* CV File Upload */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Đính kèm hồ sơ CV <span className="text-red-500">*</span>{' '}
                      <span className="text-slate-400 font-normal">(PDF, DOC, DOCX - Tối đa 5MB)</span>
                    </label>
                    <div className="relative border-2 border-dashed border-slate-300 hover:border-[#1E4384] rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50 hover:bg-slate-100">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      {selectedFile ? (
                        <div className="text-xs font-bold text-emerald-600 flex items-center justify-center gap-1.5">
                          <FileCheck className="w-4 h-4" />
                          <span>Đã chọn: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-600">
                          <span className="font-bold text-[#BE1E2D]">Bấm để chọn file</span> hoặc kéo thả CV vào đây
                        </div>
                      )}
                    </div>
                    {fileError && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {fileError}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Thư giới thiệu / Đôi nét về kinh nghiệm của bạn
                    </label>
                    <textarea
                      rows={3}
                      {...register('coverLetter')}
                      placeholder="Giới thiệu tóm tắt kinh nghiệm làm việc hoặc lý do bạn mong muốn gia nhập Vietlabel..."
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#1E4384] focus:outline-none focus:ring-1 focus:ring-[#1E4384] resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full"
                      isLoading={isSubmitting}
                      icon={<Send className="w-4 h-4" />}
                    >
                      {isSubmitting ? 'Đang gửi hồ sơ...' : 'Nộp hồ sơ ứng tuyển ngay'}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
