import React from 'react';
import { Wifi } from 'lucide-react';
import type { PayloadModule, PayloadComponentProps } from '../types';
import type { QRPayload } from '../../types/qr';

const WiFiComponent: React.FC<PayloadComponentProps> = ({ payload, onChange, errors }) => {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
          Network Name (SSID) <span className="text-rose-400">*</span>
        </label>
        <input
          type="text"
          value={payload.ssid || ''}
          onChange={(e) => onChange({ ssid: e.target.value })}
          className={`w-full glass-input rounded-xl px-3 py-2 text-xs focus:ring-1 ${
            errors.ssid ? 'border-rose-500/80 focus:ring-rose-500' : 'focus:ring-indigo-500'
          }`}
          placeholder="MyHomeWiFi"
        />
        {errors.ssid && <p className="text-[10px] text-rose-400 mt-1">{errors.ssid}</p>}
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
          Security Type
        </label>
        <select
          value={payload.encryption || 'WPA'}
          onChange={(e) => onChange({ encryption: e.target.value as any })}
          className="w-full glass-input rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 bg-slate-900 text-slate-100"
        >
          <option value="WPA">WPA / WPA2 / WPA3 (Recommended)</option>
          <option value="WEP">WEP</option>
          <option value="nopass">Open Network (No Password)</option>
        </select>
      </div>

      {payload.encryption !== 'nopass' && (
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            Network Password <span className="text-rose-400">*</span>
          </label>
          <input
            type="password"
            value={payload.password || ''}
            onChange={(e) => onChange({ password: e.target.value })}
            className={`w-full glass-input rounded-xl px-3 py-2 text-xs focus:ring-1 ${
              errors.password ? 'border-rose-500/80 focus:ring-rose-500' : 'focus:ring-indigo-500'
            }`}
            placeholder="WiFi Password"
          />
          {errors.password && <p className="text-[10px] text-rose-400 mt-1">{errors.password}</p>}
        </div>
      )}

      <label className="flex items-center space-x-2 text-xs font-semibold text-slate-300 cursor-pointer pt-1">
        <input
          type="checkbox"
          checked={!!payload.hidden}
          onChange={(e) => onChange({ hidden: e.target.checked })}
          className="rounded border-slate-700 text-indigo-500 focus:ring-0"
        />
        <span>Hidden Network (SSID Broadcast Disabled)</span>
      </label>
    </div>
  );
};

export class WiFiPayloadModule implements PayloadModule {
  id = 'wifi' as const;
  label = 'WiFi Network';
  description = 'Connect devices instantly to Wi-Fi without typing passwords';
  icon = Wifi;
  category = 'Utility' as const;
  defaultPayload = { ssid: 'QR_Canvas_WiFi', password: 'secretpassword123', encryption: 'WPA' as const, hidden: false };

  validate(payload: QRPayload) {
    const errors: Record<string, string> = {};
    if (!payload.ssid || !payload.ssid.trim()) {
      errors.ssid = 'Network SSID name is required';
    }
    if (payload.encryption !== 'nopass' && (!payload.password || !payload.password.trim())) {
      errors.password = 'Password is required for encrypted networks';
    }
    return { isValid: Object.keys(errors).length === 0, errors };
  }

  format(payload: QRPayload) {
    const ssid = (payload.ssid || '').trim();
    const pass = payload.password || '';
    const enc = payload.encryption || 'WPA';
    const hidden = payload.hidden ? 'true' : 'false';
    return `WIFI:S:${ssid};T:${enc};P:${pass};H:${hidden};;`;
  }

  Component = WiFiComponent;
}

export const wifiPayloadModule = new WiFiPayloadModule();
