import React from 'react';
import { CreditCard } from 'lucide-react';
import type { PayloadModule, PayloadComponentProps } from '../types';
import type { QRPayload } from '../../types/qr';

const PaymentComponent: React.FC<PayloadComponentProps> = ({ payload, onChange, errors }) => {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
          UPI ID / VPA Address <span className="text-rose-400">*</span>
        </label>
        <input
          type="text"
          value={payload.upiId || ''}
          onChange={(e) => onChange({ upiId: e.target.value })}
          className={`w-full glass-input rounded-xl px-3 py-2 text-xs focus:ring-1 ${
            errors.upiId ? 'border-rose-500/80 focus:ring-rose-500' : 'focus:ring-indigo-500'
          }`}
          placeholder="merchant@upi or name@okaxis"
        />
        {errors.upiId && <p className="text-[10px] text-rose-400 mt-1">{errors.upiId}</p>}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            Payee Name
          </label>
          <input
            type="text"
            value={payload.payeeName || ''}
            onChange={(e) => onChange({ payeeName: e.target.value })}
            className="w-full glass-input rounded-xl px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500"
            placeholder="Store / Person Name"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            Amount (Optional)
          </label>
          <input
            type="number"
            step="0.01"
            value={payload.amount || ''}
            onChange={(e) => onChange({ amount: e.target.value })}
            className="w-full glass-input rounded-xl px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500"
            placeholder="0.00"
          />
        </div>
      </div>
    </div>
  );
};

export class PaymentPayloadModule implements PayloadModule {
  id = 'payment' as const;
  label = 'UPI / Payment';
  description = 'Instant payment scanning for UPI apps (GPay, PhonePe, Paytm)';
  icon = CreditCard;
  category = 'Business' as const;
  defaultPayload = { upiId: 'qrcanvas@upi', payeeName: 'QR Canvas Studio', amount: '' };

  validate(payload: QRPayload) {
    const errors: Record<string, string> = {};
    if (!payload.upiId || !payload.upiId.trim()) {
      errors.upiId = 'UPI VPA ID is required (e.g. username@upi)';
    } else if (!payload.upiId.includes('@')) {
      errors.upiId = 'Enter a valid UPI handle containing @ (e.g. merchant@okaxis)';
    }
    return { isValid: Object.keys(errors).length === 0, errors };
  }

  format(payload: QRPayload) {
    const upi = (payload.upiId || '').trim();
    const name = encodeURIComponent(payload.payeeName || 'QR Canvas');
    const amt = payload.amount ? `&am=${payload.amount}&cu=INR` : '';
    return `upi://pay?pa=${upi}&pn=${name}${amt}`;
  }

  Component = PaymentComponent;
}

export const paymentPayloadModule = new PaymentPayloadModule();
