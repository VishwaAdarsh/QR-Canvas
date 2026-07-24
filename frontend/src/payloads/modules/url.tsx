import React from 'react';
import { Link as LinkIcon } from 'lucide-react';
import type { PayloadModule, PayloadComponentProps } from '../types';
import type { QRPayload } from '../../types/qr';

const URLComponent: React.FC<PayloadComponentProps> = ({ payload, onChange, errors }) => {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
          Website URL Link <span className="text-rose-400">*</span>
        </label>
        <input
          type="url"
          value={payload.url || ''}
          onChange={(e) => onChange({ url: e.target.value })}
          className={`w-full glass-input rounded-xl px-3 py-2 text-xs focus:ring-1 ${
            errors.url ? 'border-rose-500/80 focus:ring-rose-500' : 'focus:ring-indigo-500'
          }`}
          placeholder="https://example.com"
        />
        {errors.url && <p className="text-[10px] text-rose-400 mt-1">{errors.url}</p>}
      </div>
    </div>
  );
};

export class URLPayloadModule implements PayloadModule {
  id = 'url' as const;
  label = 'URL / Link';
  description = 'Direct scanner to a website or web link';
  icon = LinkIcon;
  category = 'Basic' as const;
  defaultPayload = { url: 'https://qr-canvas.com' };

  validate(payload: QRPayload) {
    const errors: Record<string, string> = {};
    if (!payload.url || !payload.url.trim()) {
      errors.url = 'URL is required';
    } else {
      const val = payload.url.trim();
      const hasProtocol = val.startsWith('http://') || val.startsWith('https://');
      const testUrl = hasProtocol ? val : `https://${val}`;
      try {
        new URL(testUrl);
      } catch {
        errors.url = 'Enter a valid URL address (e.g. https://example.com)';
      }
    }
    return { isValid: Object.keys(errors).length === 0, errors };
  }

  format(payload: QRPayload) {
    let url = (payload.url || '').trim();
    if (!url) return 'https://qr-canvas.com';
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    return url;
  }

  Component = URLComponent;
}

export const urlPayloadModule = new URLPayloadModule();
