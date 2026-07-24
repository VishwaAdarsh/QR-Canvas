import React, { useState } from 'react';
import { X, LayoutTemplate, Sparkles } from 'lucide-react';
import { CURATED_TEMPLATES } from '../../data/presets';
import { useStudioStore } from '../../store/useStudioStore';
import { formatQRPayload, renderSVGAString } from '../../lib/qr-renderer';
import type { QRDesignPreset } from '../../types/qr';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({ isOpen, onClose }) => {
  const { loadPreset } = useStudioStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', ...Array.from(new Set(CURATED_TEMPLATES.map((t) => t.category)))];

  const filteredTemplates =
    selectedCategory === 'All'
      ? CURATED_TEMPLATES
      : CURATED_TEMPLATES.filter((t) => t.category === selectedCategory);

  const handleApply = (preset: QRDesignPreset) => {
    loadPreset(preset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl space-y-6 relative max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <LayoutTemplate className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Studio Templates</h3>
              <p className="text-xs text-slate-400">
                Choose a professionally designed preset to start instantly
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto pr-1">
          {filteredTemplates.map((preset) => {
            const formatted = formatQRPayload(preset.qrType, preset.samplePayload);
            const svgMarkup = renderSVGAString(formatted, preset.style, 200);

            return (
              <div
                key={preset.id}
                onClick={() => handleApply(preset)}
                className="glass-card p-4 rounded-2xl border border-white/10 hover:border-indigo-500/50 cursor-pointer group flex flex-col justify-between space-y-3 transition transform hover:-translate-y-1"
              >
                {/* SVG Preview Card */}
                <div
                  className="w-full h-44 rounded-xl p-3 flex items-center justify-center relative overflow-hidden"
                  style={{ backgroundColor: preset.style.bgColor || '#090a0f' }}
                >
                  <div
                    className="w-32 h-32 flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: svgMarkup }}
                  />
                  <span className="absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-900/80 text-indigo-300 border border-indigo-500/30">
                    {preset.category}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 group-hover:text-indigo-400 transition">
                      {preset.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      {preset.qrType} PRESET
                    </span>
                  </div>
                  <button className="p-2 rounded-xl bg-indigo-600/20 group-hover:bg-indigo-600 text-indigo-400 group-hover:text-white transition">
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
