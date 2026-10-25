import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  FileSpreadsheet, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { api } from '../services/api';

interface BatchImportModalProps {
  entityType: 'accounts' | 'contacts' | 'tech-specs';
  entityLabel: string;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

export const BatchImportModal: React.FC<BatchImportModalProps> = ({
  entityType,
  entityLabel,
  onClose,
  onSuccess
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    created_count: number;
    total_rows: number;
    errors: string[];
  } | null>(null);

  const templateTypeMap: Record<string, 'accounts' | 'contacts' | 'tech_specs'> = {
    'accounts': 'accounts',
    'contacts': 'contacts',
    'tech-specs': 'tech_specs'
  };

  const templateType = templateTypeMap[entityType] || 'accounts';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      setUploading(true);
      const res = await api.importData(entityType, file);
      setResult(res);
      if (res.created_count > 0) {
        await onSuccess();
      }
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Batch Upload {entityLabel}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-sm">
          {/* Download Template Banner */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-semibold text-white text-xs">Standard Data Templates</div>
              <p className="text-[11px] text-slate-400">
                Download the official template with pre-filled headers and sample values.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <a
                href={api.getTemplateUrl(templateType, 'excel')}
                download
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Excel (.xlsx)</span>
              </a>
              <a
                href={api.getTemplateUrl(templateType, 'csv')}
                download
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV</span>
              </a>
            </div>
          </div>

          {/* Upload Form */}
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl p-6 text-center cursor-pointer transition bg-slate-950/40 relative">
              <input
                type="file"
                required
                accept=".csv, .xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-2 pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 mx-auto flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                {file ? (
                  <div>
                    <span className="font-semibold text-emerald-400">{file.name}</span>
                    <span className="text-xs text-slate-500 block">({Math.round(file.size / 1024)} KB)</span>
                  </div>
                ) : (
                  <div>
                    <span className="font-semibold text-white">Click or drag file here to import</span>
                    <span className="text-xs text-slate-500 block">Supports .xlsx (Excel) and .csv</span>
                  </div>
                )}
              </div>
            </div>

            {/* Results feedback */}
            {result && (
              <div className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                result.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}>
                <div className="flex items-center space-x-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Import Completed: {result.created_count} record(s) processed successfully.</span>
                </div>
                {result.errors.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-amber-300 space-y-1">
                    <div className="font-semibold">Notice / Warnings:</div>
                    <ul className="list-disc pl-4 space-y-0.5">
                      {result.errors.slice(0, 5).map((e, i) => (
                        <li key={i}>{e}</li>
                      ))}
                      {result.errors.length > 5 && (
                        <li>...and {result.errors.length - 5} more</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={!file || uploading}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-blue-500/20"
              >
                {uploading ? 'Processing File...' : 'Start Batch Import'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
