import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import type { PayloadModule, PayloadComponentProps } from '../types';
import type { QRPayload } from '../../types/qr';

const LocationComponent: React.FC<PayloadComponentProps> = ({ payload, onChange, errors }) => {
  const locationUrl = payload.locationUrl || payload.url || '';

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
          Google Maps URL / Share Link <span className="text-rose-400">*</span>
        </label>
        <input
          type="url"
          value={locationUrl}
          onChange={(e) => onChange({ locationUrl: e.target.value, url: e.target.value })}
          className={`w-full glass-input rounded-xl px-3 py-2 text-xs focus:ring-1 ${
            errors.locationUrl ? 'border-rose-500/80 focus:ring-rose-500' : 'focus:ring-indigo-500'
          }`}
          placeholder="https://maps.app.goo.gl/... or https://maps.google.com/..."
        />
        {errors.locationUrl && (
          <p className="text-[10px] text-rose-400 mt-1">{errors.locationUrl}</p>
        )}
      </div>

      <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300 space-y-1">
        <div className="flex items-center space-x-1.5 font-semibold">
          <ExternalLink className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>Google Maps Integration</span>
        </div>
        <p className="text-[10px] leading-relaxed text-indigo-300/80">
          Paste any Google Maps place link, share link, or location search URL. Scanners will open Google Maps navigation directly.
        </p>
      </div>
    </div>
  );
};

export class LocationPayloadModule implements PayloadModule {
  id = 'location' as const;
  label = 'Geo Location';
  description = 'Direct scanner to exact Google Maps location or directions link';
  icon = MapPin;
  category = 'Utility' as const;
  defaultPayload = {
    locationUrl: 'https://maps.google.com/?q=San+Francisco+CA',
    url: 'https://maps.google.com/?q=San+Francisco+CA'
  };

  validate(payload: QRPayload) {
    const errors: Record<string, string> = {};
    const val = (payload.locationUrl || payload.url || '').trim();

    if (!val) {
      errors.locationUrl = 'Google Maps URL link is required';
    } else {
      const hasProtocol = val.startsWith('http://') || val.startsWith('https://');
      const testUrl = hasProtocol ? val : `https://${val}`;
      try {
        new URL(testUrl);
      } catch {
        errors.locationUrl = 'Enter a valid web link (e.g. https://maps.app.goo.gl/...)';
      }
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  }

  format(payload: QRPayload) {
    let val = (payload.locationUrl || payload.url || '').trim();
    if (!val) {
      if (payload.lat && payload.lng) {
        return `https://maps.google.com/?q=${payload.lat},${payload.lng}`;
      }
      return 'https://maps.google.com/?q=San+Francisco+CA';
    }
    if (!val.startsWith('http://') && !val.startsWith('https://')) {
      val = 'https://' + val;
    }
    return val;
  }

  Component = LocationComponent;
}

export const locationPayloadModule = new LocationPayloadModule();
