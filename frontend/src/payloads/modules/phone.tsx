import React from 'react';
import { Phone } from 'lucide-react';
import type { PayloadModule, PayloadComponentProps } from '../types';
import type { QRPayload } from '../../types/qr';

const PhoneComponent: React.FC<PayloadComponentProps> = ({ payload, onChange, errors }) => {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
          Phone Number <span className="text-rose-400">*</span>
        </label>
        <input
          type="tel"
          value={payload.phone || ''}
          onChange={(e) => onChange({ phone: e.target.value })}
          className={`w-full glass-input rounded-xl px-3 py-2 text-xs focus:ring-1 ${
            errors.phone ? 'border-rose-500/80 focus:ring-rose-500' : 'focus:ring-indigo-500'
          }`}
          placeholder="+1 555 123 4567"
        />
        {errors.phone && <p className="text-[10px] text-rose-400 mt-1">{errors.phone}</p>}
      </div>
    </div>
  );
};

export class PhonePayloadModule implements PayloadModule {
  id = 'phone' as const;
  label = 'Phone Call';
  description = 'Prompt scanner device to dial a phone number';
  icon = Phone;
  category = 'Communication' as const;
  defaultPayload = { phone: '+1 800 555 0199' };

  validate(payload: QRPayload) {
    const errors: Record<string, string> = {};
    if (!payload.phone || !payload.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else {
      const cleanPhone = payload.phone.replace(/[\s\-\(\)\+]/g, '');
      if (!/^\d+$/.test(cleanPhone)) {
        errors.phone = 'Phone number must contain digits';
      }
    }
    return { isValid: Object.keys(errors).length === 0, errors };
  }

  format(payload: QRPayload) {
    const phone = (payload.phone || '').trim();
    return `tel:${phone}`;
  }

  Component = PhoneComponent;
}

export const phonePayloadModule = new PhonePayloadModule();
