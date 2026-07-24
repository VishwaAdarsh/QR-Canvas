import React from 'react';
import { Smartphone } from 'lucide-react';
import type { PayloadModule, PayloadComponentProps } from '../types';
import type { QRPayload } from '../../types/qr';

const AppStoreComponent: React.FC<PayloadComponentProps> = ({ payload, onChange, errors }) => {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
          Store Platform
        </label>
        <select
          value={payload.appPlatform || 'ios'}
          onChange={(e) => onChange({ appPlatform: e.target.value })}
          className="w-full glass-input rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 bg-slate-900 text-slate-100"
        >
          <option value="ios">Apple App Store (iOS)</option>
          <option value="android">Google Play Store (Android)</option>
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
          {payload.appPlatform === 'android' ? 'Package ID / Play Store Link' : 'App Store URL / App ID'}{' '}
          <span className="text-rose-400">*</span>
        </label>
        <input
          type="text"
          value={payload.appUrl || ''}
          onChange={(e) => onChange({ appUrl: e.target.value })}
          className={`w-full glass-input rounded-xl px-3 py-2 text-xs focus:ring-1 ${
            errors.appUrl ? 'border-rose-500/80 focus:ring-rose-500' : 'focus:ring-indigo-500'
          }`}
          placeholder={
            payload.appPlatform === 'android'
              ? 'com.example.myapp or https://play.google.com/...'
              : 'https://apps.apple.com/app/id123456789'
          }
        />
        {errors.appUrl && <p className="text-[10px] text-rose-400 mt-1">{errors.appUrl}</p>}
      </div>
    </div>
  );
};

export class AppStorePayloadModule implements PayloadModule {
  id = 'appstore' as const;
  label = 'App Store';
  description = 'Direct scanner to iOS App Store or Android Google Play download page';
  icon = Smartphone;
  category = 'Marketing' as const;
  defaultPayload = { appPlatform: 'ios', appUrl: 'https://apps.apple.com/app/id123456789' };

  validate(payload: QRPayload) {
    const errors: Record<string, string> = {};
    if (!payload.appUrl || !payload.appUrl.trim()) {
      errors.appUrl = 'App URL or package identifier is required';
    }
    return { isValid: Object.keys(errors).length === 0, errors };
  }

  format(payload: QRPayload) {
    const raw = (payload.appUrl || '').trim();
    if (!raw) return 'https://apps.apple.com';
    if (raw.startsWith('http://') || raw.startsWith('https://')) {
      return raw;
    }
    if (payload.appPlatform === 'android') {
      return `https://play.google.com/store/apps/details?id=${raw}`;
    }
    return `https://apps.apple.com/app/id${raw}`;
  }

  Component = AppStoreComponent;
}

export const appStorePayloadModule = new AppStorePayloadModule();
