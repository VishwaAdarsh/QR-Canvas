import React from 'react';
import { Calendar } from 'lucide-react';
import type { PayloadModule, PayloadComponentProps } from '../types';
import type { QRPayload } from '../../types/qr';

const EventComponent: React.FC<PayloadComponentProps> = ({ payload, onChange, errors }) => {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
          Event Title <span className="text-rose-400">*</span>
        </label>
        <input
          type="text"
          value={payload.eventTitle || ''}
          onChange={(e) => onChange({ eventTitle: e.target.value })}
          className={`w-full glass-input rounded-xl px-3 py-2 text-xs focus:ring-1 ${
            errors.eventTitle ? 'border-rose-500/80 focus:ring-rose-500' : 'focus:ring-indigo-500'
          }`}
          placeholder="e.g. Design Studio Launch Party"
        />
        {errors.eventTitle && <p className="text-[10px] text-rose-400 mt-1">{errors.eventTitle}</p>}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            Start Date & Time
          </label>
          <input
            type="datetime-local"
            value={payload.startDate || ''}
            onChange={(e) => onChange({ startDate: e.target.value })}
            className="w-full glass-input rounded-xl px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 bg-slate-900 text-slate-100"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            End Date & Time
          </label>
          <input
            type="datetime-local"
            value={payload.endDate || ''}
            onChange={(e) => onChange({ endDate: e.target.value })}
            className="w-full glass-input rounded-xl px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 bg-slate-900 text-slate-100"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
          Location
        </label>
        <input
          type="text"
          value={payload.location || ''}
          onChange={(e) => onChange({ location: e.target.value })}
          className="w-full glass-input rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500"
          placeholder="e.g. San Francisco Convention Center / Online Zoom"
        />
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
          Description
        </label>
        <textarea
          rows={3}
          value={payload.description || ''}
          onChange={(e) => onChange({ description: e.target.value })}
          className="w-full glass-input rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500"
          placeholder="Add agenda, details, or notes..."
        />
      </div>
    </div>
  );
};

export class EventPayloadModule implements PayloadModule {
  id = 'event' as const;
  label = 'Calendar Event';
  description = 'Add scheduled event directly to scanner calendar';
  icon = Calendar;
  category = 'Utility' as const;
  defaultPayload = {
    eventTitle: 'QR Canvas Product Launch',
    startDate: '2026-08-01T10:00',
    endDate: '2026-08-01T12:00',
    location: 'San Francisco, CA',
    description: 'Join us for live demonstrations and keynote.'
  };

  validate(payload: QRPayload) {
    const errors: Record<string, string> = {};
    if (!payload.eventTitle || !payload.eventTitle.trim()) {
      errors.eventTitle = 'Event title is required';
    }
    return { isValid: Object.keys(errors).length === 0, errors };
  }

  format(payload: QRPayload) {
    const title = payload.eventTitle || 'Event';
    const start = (payload.startDate || '').replace(/[-:]/g, '').replace('T', 'T') + '00Z';
    const end = (payload.endDate || '').replace(/[-:]/g, '').replace('T', 'T') + '00Z';
    const loc = payload.location || '';
    const desc = payload.description || '';

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//QR Canvas Studio//NONSGML v1.0//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      start ? `DTSTART:${start}` : '',
      end ? `DTEND:${end}` : '',
      loc ? `LOCATION:${loc}` : '',
      desc ? `DESCRIPTION:${desc}` : '',
      'END:VEVENT',
      'END:VCALENDAR'
    ].filter(Boolean).join('\n');
  }

  Component = EventComponent;
}

export const eventPayloadModule = new EventPayloadModule();
