import React from 'react';
import { Send } from 'lucide-react';
import type { PayloadModule, PayloadComponentProps } from '../types';
import type { QRPayload } from '../../types/qr';

const WhatsAppComponent: React.FC<PayloadComponentProps> = ({ payload, onChange, errors }) => {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
          WhatsApp Phone Number (with Country Code) <span className="text-rose-400">*</span>
        </label>
        <input
          type="tel"
          value={payload.phone || ''}
          onChange={(e) => onChange({ phone: e.target.value })}
          className={`w-full glass-input rounded-xl px-3 py-2 text-xs focus:ring-1 ${
            errors.phone ? 'border-rose-500/80 focus:ring-rose-500' : 'focus:ring-indigo-500'
          }`}
          placeholder="e.g. 15551234567"
        />
        {errors.phone && <p className="text-[10px] text-rose-400 mt-1">{errors.phone}</p>}
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
          Pre-filled Message
        </label>
        <textarea
          rows={3}
          value={payload.message || ''}
          onChange={(e) => onChange({ message: e.target.value })}
          className="w-full glass-input rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500"
          placeholder="Hello! I would like to inquire about..."
        />
      </div>
    </div>
  );
};

export class WhatsAppPayloadModule implements PayloadModule {
  id = 'whatsapp' as const;
  label = 'WhatsApp Chat';
  description = 'Open WhatsApp chat directly with a pre-filled message';
  icon = Send;
  category = 'Communication' as const;
  defaultPayload = { phone: '15550199', message: 'Hello! Sent via QR Canvas.' };

  validate(payload: QRPayload) {
    const errors: Record<string, string> = {};
    if (!payload.phone || !payload.phone.trim()) {
      errors.phone = 'WhatsApp phone number is required';
    }
    return { isValid: Object.keys(errors).length === 0, errors };
  }

  format(payload: QRPayload) {
    const cleanPhone = (payload.phone || '').replace(/\+/g, '').replace(/\s/g, '');
    const text = encodeURIComponent(payload.message || '');
    return `https://wa.me/${cleanPhone}?text=${text}`;
  }

  Component = WhatsAppComponent;
}

export const whatsappPayloadModule = new WhatsAppPayloadModule();
