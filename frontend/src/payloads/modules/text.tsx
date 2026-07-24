import React from 'react';
import { FileText } from 'lucide-react';
import type { PayloadModule, PayloadComponentProps } from '../types';
import type { QRPayload } from '../../types/qr';

const TextComponent: React.FC<PayloadComponentProps> = ({ payload, onChange, errors }) => {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
          Text Content <span className="text-rose-400">*</span>
        </label>
        <textarea
          rows={4}
          value={payload.text || ''}
          onChange={(e) => onChange({ text: e.target.value })}
          className={`w-full glass-input rounded-xl px-3 py-2 text-xs focus:ring-1 ${
            errors.text ? 'border-rose-500/80 focus:ring-rose-500' : 'focus:ring-indigo-500'
          }`}
          placeholder="Enter plain text, message, or code snippet..."
        />
        {errors.text && <p className="text-[10px] text-rose-400 mt-1">{errors.text}</p>}
      </div>
    </div>
  );
};

export class TextPayloadModule implements PayloadModule {
  id = 'text' as const;
  label = 'Plain Text';
  description = 'Display raw plain text or message when scanned';
  icon = FileText;
  category = 'Basic' as const;
  defaultPayload = { text: 'QR Canvas — Create Beautiful QR Codes Effortlessly' };

  validate(payload: QRPayload) {
    const errors: Record<string, string> = {};
    if (!payload.text || !payload.text.trim()) {
      errors.text = 'Text message is required';
    }
    return { isValid: Object.keys(errors).length === 0, errors };
  }

  format(payload: QRPayload) {
    return payload.text || 'QR Canvas — Create Beautiful QR Codes Effortlessly';
  }

  Component = TextComponent;
}

export const textPayloadModule = new TextPayloadModule();
