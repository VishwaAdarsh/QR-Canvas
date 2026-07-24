import React from 'react';
import { Share2 } from 'lucide-react';
import type { PayloadModule, PayloadComponentProps } from '../types';
import type { QRPayload } from '../../types/qr';

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', base: 'https://instagram.com/' },
  { id: 'x', label: 'X (Twitter)', base: 'https://x.com/' },
  { id: 'github', label: 'GitHub', base: 'https://github.com/' },
  { id: 'linkedin', label: 'LinkedIn', base: 'https://linkedin.com/in/' },
  { id: 'youtube', label: 'YouTube', base: 'https://youtube.com/@' },
  { id: 'facebook', label: 'Facebook', base: 'https://facebook.com/' }
];

const SocialComponent: React.FC<PayloadComponentProps> = ({ payload, onChange, errors }) => {
  const currentPlatform = payload.socialPlatform || 'instagram';

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
          Select Social Platform
        </label>
        <select
          value={currentPlatform}
          onChange={(e) => onChange({ socialPlatform: e.target.value })}
          className="w-full glass-input rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 bg-slate-900 text-slate-100"
        >
          {PLATFORMS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
          Username / Profile Handle <span className="text-rose-400">*</span>
        </label>
        <input
          type="text"
          value={payload.socialHandle || ''}
          onChange={(e) => onChange({ socialHandle: e.target.value.replace(/^@/, '') })}
          className={`w-full glass-input rounded-xl px-3 py-2 text-xs focus:ring-1 ${
            errors.socialHandle ? 'border-rose-500/80 focus:ring-rose-500' : 'focus:ring-indigo-500'
          }`}
          placeholder="username (without @)"
        />
        {errors.socialHandle && (
          <p className="text-[10px] text-rose-400 mt-1">{errors.socialHandle}</p>
        )}
      </div>
    </div>
  );
};

export class SocialPayloadModule implements PayloadModule {
  id = 'social' as const;
  label = 'Social Media';
  description = 'Direct link to profile on Instagram, X, LinkedIn, GitHub, YouTube, or Facebook';
  icon = Share2;
  category = 'Marketing' as const;
  defaultPayload = { socialPlatform: 'instagram', socialHandle: 'qrcanvas' };

  validate(payload: QRPayload) {
    const errors: Record<string, string> = {};
    if (!payload.socialHandle || !payload.socialHandle.trim()) {
      errors.socialHandle = 'Social handle / username is required';
    }
    return { isValid: Object.keys(errors).length === 0, errors };
  }

  format(payload: QRPayload) {
    const platform = payload.socialPlatform || 'instagram';
    const handle = (payload.socialHandle || '').replace(/^@/, '').trim();
    const config = PLATFORMS.find((p) => p.id === platform) || PLATFORMS[0];
    return `${config.base}${handle}`;
  }

  Component = SocialComponent;
}

export const socialPayloadModule = new SocialPayloadModule();
