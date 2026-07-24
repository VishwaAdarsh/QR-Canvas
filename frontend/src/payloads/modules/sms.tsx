import React from 'react';
import { MessageSquare } from 'lucide-react';
import type { PayloadModule, PayloadComponentProps } from '../types';
import type { QRPayload } from '../../types/qr';

const SMSComponent: React.FC<PayloadComponentProps> = ({ payload, onChange, errors }) => {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
          Recipient Phone Number <span className="text-rose-400">*</span>
        </label>
        <input
          type="tel"
          value={payload.phone || ''}
          onChange={(e) => onChange({ phone: e.target.value })}
          className={`w-full glass-input rounded-xl px-3 py-2 text-xs focus:ring-1 ${
            errors.phone ? 'border-rose-500/80 focus:ring-rose-500' : 'focus:ring-indigo-500'
          }`}
          placeholder="+1 555 0199"
        />
        {errors.phone && <p className="text-[10px] text-rose-400 mt-1">{errors.phone}</p>}
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
          Pre-filled SMS Text Message
        </label>
        <textarea
          rows={3}
          value={payload.message || ''}
          onChange={(e) => onChange({ message: e.target.value })}
          className="w-full glass-input rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500"
          placeholder="Pre-filled SMS body message..."
        />
      </div>
    </div>
  );
};

export class SMSPayloadModule implements PayloadModule {
  id = 'sms' as const;
  label = 'SMS Message';
  description = 'Send a text message with pre-written text';
  icon = MessageSquare;
  category = 'Communication' as const;
  defaultPayload = { phone: '+1 555 0199', message: 'Hello! I scanned your QR code.' };

  validate(payload: QRPayload) {
    const errors: Record<string, string> = {};
    if (!payload.phone || !payload.phone.trim()) {
      errors.phone = 'Phone number is required';
    }
    return { isValid: Object.keys(errors).length === 0, errors };
  }

  format(payload: QRPayload) {
    const phone = (payload.phone || '').trim();
    const msg = payload.message || '';
    return `SMSTO:${phone}:${msg}`;
  }

  Component = SMSComponent;
}

export const smsPayloadModule = new SMSPayloadModule();
