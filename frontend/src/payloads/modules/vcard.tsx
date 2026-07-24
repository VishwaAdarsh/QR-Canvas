import React from 'react';
import { UserCheck } from 'lucide-react';
import type { PayloadModule, PayloadComponentProps } from '../types';
import type { QRPayload } from '../../types/qr';

const VCardComponent: React.FC<PayloadComponentProps> = ({ payload, onChange, errors }) => {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            First Name <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            placeholder="John"
            value={payload.firstName || ''}
            onChange={(e) => onChange({ firstName: e.target.value })}
            className={`w-full glass-input rounded-xl px-2.5 py-1.5 text-xs focus:ring-1 ${
              errors.firstName ? 'border-rose-500/80 focus:ring-rose-500' : 'focus:ring-indigo-500'
            }`}
          />
          {errors.firstName && <p className="text-[10px] text-rose-400 mt-1">{errors.firstName}</p>}
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            Last Name
          </label>
          <input
            type="text"
            placeholder="Doe"
            value={payload.lastName || ''}
            onChange={(e) => onChange({ lastName: e.target.value })}
            className="w-full glass-input rounded-xl px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
          Company / Organization
        </label>
        <input
          type="text"
          placeholder="Acme Corp"
          value={payload.org || ''}
          onChange={(e) => onChange({ org: e.target.value })}
          className="w-full glass-input rounded-xl px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
          Job Title
        </label>
        <input
          type="text"
          placeholder="Product Designer"
          value={payload.title || ''}
          onChange={(e) => onChange({ title: e.target.value })}
          className="w-full glass-input rounded-xl px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
          Mobile Phone
        </label>
        <input
          type="tel"
          placeholder="+1 555 0199"
          value={payload.phone || ''}
          onChange={(e) => onChange({ phone: e.target.value })}
          className="w-full glass-input rounded-xl px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
          Email Address
        </label>
        <input
          type="email"
          placeholder="john.doe@example.com"
          value={payload.email || ''}
          onChange={(e) => onChange({ email: e.target.value })}
          className="w-full glass-input rounded-xl px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
          Website URL
        </label>
        <input
          type="url"
          placeholder="https://johndoe.com"
          value={payload.url || ''}
          onChange={(e) => onChange({ url: e.target.value })}
          className="w-full glass-input rounded-xl px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
};

export class VCardPayloadModule implements PayloadModule {
  id = 'vcard' as const;
  label = 'vCard Contact';
  description = 'Save full digital contact card straight into scanner address book';
  icon = UserCheck;
  category = 'Business' as const;
  defaultPayload = {
    firstName: 'Alex',
    lastName: 'Morgan',
    org: 'QR Canvas Inc',
    title: 'Lead Designer',
    phone: '+1 555 0199',
    email: 'alex@qrcanvas.com',
    url: 'https://qrcanvas.com'
  };

  validate(payload: QRPayload) {
    const errors: Record<string, string> = {};
    if (!payload.firstName || !payload.firstName.trim()) {
      errors.firstName = 'First Name is required';
    }
    return { isValid: Object.keys(errors).length === 0, errors };
  }

  format(payload: QRPayload) {
    const fn = (payload.firstName || '').trim();
    const ln = (payload.lastName || '').trim();
    const full = `${fn} ${ln}`.trim();
    return [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:${ln};${fn};;;`,
      `FN:${full}`,
      payload.org ? `ORG:${payload.org}` : '',
      payload.title ? `TITLE:${payload.title}` : '',
      payload.phone ? `TEL;TYPE=CELL:${payload.phone}` : '',
      payload.email ? `EMAIL:${payload.email}` : '',
      payload.url ? `URL:${payload.url}` : '',
      'END:VCARD'
    ].filter(Boolean).join('\n');
  }

  Component = VCardComponent;
}

export const vcardPayloadModule = new VCardPayloadModule();
