import React from 'react';
import { FileCode, AlertCircle, Upload, CheckCircle2 } from 'lucide-react';
import type { PayloadModule, PayloadComponentProps, BackendCapabilities } from '../types';
import type { QRPayload } from '../../types/qr';

const PDFComponent: React.FC<PayloadComponentProps> = ({ payload, onChange, errors, capabilities }) => {
  const isCloudConfigured = capabilities?.cloudStorageConfigured ?? false;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isCloudConfigured) {
      // Real upload handler when cloud backend is active
      const formData = new FormData();
      formData.append('file', file);

      fetch('/api/v1/upload-document', {
        method: 'POST',
        body: formData
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.url) {
            onChange({ pdfUrl: data.url, pdfFileName: file.name });
          }
        })
        .catch(() => {
          // Handle upload error
        });
    }
  };

  return (
    <div className="space-y-3">
      {!isCloudConfigured ? (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 space-y-2">
          <div className="flex items-center space-x-2 font-semibold text-xs">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Cloud Storage Required</span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-300/90">
            Document QR requires cloud storage configuration.
          </p>
          <div className="text-[10px] text-amber-400/80 border-t border-amber-500/10 pt-2">
            Configure S3, Cloudinary, or GCS credentials in your backend environment to enable PDF hosting.
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {payload.pdfUrl ? (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs text-emerald-300">
              <div className="flex items-center space-x-2 truncate">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">{payload.pdfFileName || 'Document uploaded'}</span>
              </div>
              <button
                type="button"
                onClick={() => onChange({ pdfUrl: '', pdfFileName: '' })}
                className="text-[10px] text-slate-400 hover:text-slate-200 underline shrink-0"
              >
                Change
              </button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-white/10 hover:border-indigo-500/50 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition">
              <Upload className="w-6 h-6 text-slate-400 mb-1" />
              <span className="text-xs font-semibold text-slate-300">Upload PDF / Document</span>
              <span className="text-[10px] text-slate-500">PDF, DOCX, EPUB up to 10MB</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.epub"
                onChange={handleFileUpload}
                className="hidden"
                disabled={!isCloudConfigured}
              />
            </label>
          )}
        </div>
      )}

      {errors.pdfUrl && <p className="text-[10px] text-rose-400 mt-1">{errors.pdfUrl}</p>}
    </div>
  );
};

export class PDFPayloadModule implements PayloadModule {
  id = 'pdf' as const;
  label = 'PDF / Document';
  description = 'Host & link PDF documents or downloadable whitepapers';
  icon = FileCode;
  category = 'Marketing' as const;
  defaultPayload = { pdfUrl: '' };

  checkAvailability(capabilities?: BackendCapabilities) {
    if (!capabilities?.cloudStorageConfigured) {
      return {
        available: false,
        reason: 'Document QR requires cloud storage configuration.'
      };
    }
    return { available: true };
  }

  validate(payload: QRPayload) {
    const errors: Record<string, string> = {};
    if (!payload.pdfUrl || !payload.pdfUrl.trim()) {
      errors.pdfUrl = 'Document QR requires cloud storage configuration.';
    }
    return { isValid: Object.keys(errors).length === 0, errors };
  }

  format(payload: QRPayload) {
    return payload.pdfUrl || 'https://qr-canvas.com/docs/unconfigured';
  }

  Component = PDFComponent;
}

export const pdfPayloadModule = new PDFPayloadModule();
