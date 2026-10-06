import React, { useRef, useState } from 'react';
import { Paperclip, X, FileText, Loader2 } from 'lucide-react';
import { chatApi } from '../../services/chatApi';

export interface UploadedFileItem {
  name: string;
  url?: string;
  size: number;
}

interface FileUploadProps {
  onFilesChange: (files: UploadedFileItem[]) => void;
  files: UploadedFileItem[];
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesChange, files, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploadError(null);
    setIsUploading(true);

    const newFiles: UploadedFileItem[] = [...files];

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];

        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`File ${file.name} lớn hơn 10MB.`);
        }

        const uploaded = await chatApi.uploadFile(file);
        newFiles.push({
          name: uploaded.name,
          url: uploaded.url,
          size: uploaded.size,
        });
      }

      onFilesChange(newFiles);
    } catch (err: any) {
      setUploadError(err.message || 'Lỗi tải file');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, idx) => idx !== index);
    onFilesChange(updated);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.ai,.png,.jpg,.jpeg,.eps,.cdr,.svg"
        className="hidden"
        onChange={handleFileSelect}
        disabled={disabled || isUploading}
      />

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          title="Đính kèm file thiết kế / mẫu in (PDF, AI, PNG, JPG tối đa 10MB)"
          aria-label="Đính kèm file"
          className="p-2 text-slate-500 hover:text-[#BE1E2D] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#BE1E2D]" />
          ) : (
            <Paperclip className="w-4 h-4" />
          )}
        </button>

        {files.length > 0 && (
          <span className="text-[11px] text-slate-500 font-medium">
            {files.length} file đính kèm
          </span>
        )}
      </div>

      {uploadError && (
        <span className="text-[11px] text-rose-500 font-medium px-2">
          {uploadError}
        </span>
      )}

      {/* File Previews */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-2 pb-1">
          {files.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[11px]"
            >
              <FileText className="w-3 h-3 text-[#BE1E2D]" />
              <span className="truncate max-w-[100px]">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="text-slate-400 hover:text-rose-500 p-0.5 rounded"
                aria-label={`Xóa file ${file.name}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
