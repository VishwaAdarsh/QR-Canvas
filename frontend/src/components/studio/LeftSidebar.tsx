import React from 'react';
import {
  Link as LinkIcon,
  FileText,
  Mail,
  Phone,
  MessageSquare,
  Send,
  Wifi,
  UserCheck,
  Calendar,
  MapPin,
  Share2,
  FileCode,
  CreditCard
} from 'lucide-react';
import type { QRType } from '../../types/qr';
import { useStudioStore } from '../../store/useStudioStore';

interface TypeOption {
  id: QRType;
  label: string;
  icon: React.FC<{ className?: string }>;
  category: string;
}

const TYPE_OPTIONS: TypeOption[] = [
  { id: 'url', label: 'URL / Link', icon: LinkIcon, category: 'Basic' },
  { id: 'text', label: 'Plain Text', icon: FileText, category: 'Basic' },
  { id: 'wifi', label: 'WiFi Network', icon: Wifi, category: 'Utility' },
  { id: 'vcard', label: 'vCard Contact', icon: UserCheck, category: 'Business' },
  { id: 'email', label: 'Email Draft', icon: Mail, category: 'Communication' },
  { id: 'phone', label: 'Phone Call', icon: Phone, category: 'Communication' },
  { id: 'sms', label: 'SMS Message', icon: MessageSquare, category: 'Communication' },
  { id: 'whatsapp', label: 'WhatsApp Chat', icon: Send, category: 'Communication' },
  { id: 'event', label: 'Calendar Event', icon: Calendar, category: 'Utility' },
  { id: 'location', label: 'Geo Location', icon: MapPin, category: 'Utility' },
  { id: 'social', label: 'Social Media', icon: Share2, category: 'Marketing' },
  { id: 'pdf', label: 'PDF Document', icon: FileCode, category: 'Marketing' },
  { id: 'payment', label: 'UPI / Payment', icon: CreditCard, category: 'Business' }
];

export const LeftSidebar: React.FC = () => {
  const { qrType, setQRType } = useStudioStore();

  return (
    <aside className="w-64 border-r border-white/10 glass-panel h-[calc(100vh-4rem)] overflow-y-auto p-4 flex flex-col space-y-6 shrink-0 hidden md:block">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-2">
          QR Payload Type
        </h3>
        <div className="space-y-1.5">
          {TYPE_OPTIONS.map((item) => {
            const Icon = item.icon;
            const isActive = qrType === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setQRType(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border border-indigo-500/40 text-white shadow-md shadow-indigo-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg ${
                    isActive ? 'bg-indigo-500 text-white' : 'bg-slate-800/80 text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
