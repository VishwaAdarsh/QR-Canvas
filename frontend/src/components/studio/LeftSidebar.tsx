import React from 'react';
import { useStudioStore } from '../../store/useStudioStore';
import { getAllPayloadModules } from '../../payloads/registry';

export const LeftSidebar: React.FC = () => {
  const { qrType, setQRType } = useStudioStore();
  const payloadModules = getAllPayloadModules();

  return (
    <aside className="w-64 border-r border-white/10 glass-panel h-[calc(100vh-4rem)] overflow-y-auto p-4 flex flex-col space-y-6 shrink-0 hidden md:block custom-scrollbar">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-2">
          QR Payload Type
        </h3>
        <div className="space-y-1.5">
          {payloadModules.map((item) => {
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
