import React from 'react';
import { Mail } from 'lucide-react';
import type { PayloadModule, PayloadComponentProps } from '../types';
import type { QRPayload } from '../../types/qr';

const EmailComponent: React.FC<PayloadComponentProps> = ({ payload, onChange, errors }) => {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
          Recipient Email Address <span className="text-rose-400">*</span>
        </label>
        <input
          type="email"
          value={payload.email || ''}
          onChange={(e) => onChange({ email: e.target.value })}
          className={`w-full glass-input rounded-xl px-3 py-2 text-xs focus:ring-1 ${
            errors.email ? 'border-rose-500/80 focus:ring-rose-500' : 'focus:ring-indigo-500'
          }`}
          placeholder="contact@example.com"
        />
        {errors.email && <p className="text-[10px] text-rose-400 mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
          Subject Line
        </label>
        <input
          type="text"
          value={payload.subject || ''}
          onChange={(e) => onChange({ subject: e.target.value })}
          className="w-full glass-input rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500"
          placeholder="e.g. Inquiry regarding services"
        />
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
          Email Body / Message
        </label>
        <textarea
          rows={3}
          value={payload.body || ''}
          onChange={(e) => onChange({ body: e.target.value })}
          className="w-full glass-input rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500"
          placeholder="Pre-filled email message content..."
        />
      </div>
    </div>
  );
};

export class EmailPayloadModule implements PayloadModule {
  id = 'email' as const;
  label = 'Email Draft';
  description = 'Open default email app with pre-filled recipient and subject';
  icon = Mail;
  category = 'Communication' as const;
  defaultPayload = { email: 'hello@qrcanvas.com', subject: 'Inquiry', body: 'Hello QR Canvas team,' };

  validate(payload: QRPayload) {
    const errors: Record<string, string> = {};
    if (!payload.email || !payload.email.trim()) {
      errors.email = 'Recipient email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(payload.email.trim())) {
        errors.email = 'Enter a valid email address';
      }
    }
    return { isValid: Object.keys(errors).length === 0, errors };
  }

  format(payload: QRPayload) {
    const email = (payload.email || '').trim();
    const subject = encodeURIComponent(payload.subject || '');
    const body = encodeURIComponent(payload.body || '');
    return `mailto:${email}?subject=${subject}&body=${body}`;
  }

  Component = EmailComponent;
}

export const emailPayloadModule = new EmailPayloadModule();
