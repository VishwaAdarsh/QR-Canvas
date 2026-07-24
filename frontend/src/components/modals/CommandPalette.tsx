import React, { useEffect, useState } from 'react';
import { Search, Link as LinkIcon, Wifi, UserCheck, LayoutTemplate, History, Download } from 'lucide-react';
import { useStudioStore } from '../../store/useStudioStore';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTemplates: () => void;
  onOpenHistory: () => void;
  onOpenExport: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenTemplates,
  onOpenHistory,
  onOpenExport
}) => {
  const { setQRType } = useStudioStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const ACTIONS = [
    {
      id: 'type_url',
      label: 'Switch to URL / Web Link Payload',
      icon: LinkIcon,
      action: () => setQRType('url')
    },
    {
      id: 'type_wifi',
      label: 'Switch to WiFi Network Payload',
      icon: Wifi,
      action: () => setQRType('wifi')
    },
    {
      id: 'type_vcard',
      label: 'Switch to vCard Digital Business Card',
      icon: UserCheck,
      action: () => setQRType('vcard')
    },
    {
      id: 'open_templates',
      label: 'Browse Preset Templates Gallery',
      icon: LayoutTemplate,
      action: onOpenTemplates
    },
    {
      id: 'open_history',
      label: 'Open Saved Designs History',
      icon: History,
      action: onOpenHistory
    },
    {
      id: 'open_export',
      label: 'Export Current QR (PNG / SVG / PDF)',
      icon: Download,
      action: onOpenExport
    }
  ];

  const filtered = ACTIONS.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (act: () => void) => {
    act();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl glass-panel rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
        {/* Input */}
        <div className="p-4 border-b border-white/10 flex items-center space-x-3">
          <Search className="w-5 h-5 text-indigo-400" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or search actions (Ctrl+K)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-slate-500"
          />
        </div>

        {/* List */}
        <div className="max-h-72 overflow-y-auto p-2 space-y-1">
          {filtered.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.action)}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-2xl hover:bg-white/10 text-slate-300 hover:text-white transition text-xs font-semibold text-left"
              >
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                  <Icon className="w-4 h-4" />
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
