import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Palette,
  Eye,
  Shapes,
  Image as ImageIcon,
  Sparkles,
  SlidersHorizontal,
  Upload,
  Trash2,
  RotateCcw,
  Wand2
} from 'lucide-react';
import { useStudioStore } from '../../store/useStudioStore';
import type { ModuleShape, EyeStyle } from '../../types/qr';
import { getPayloadModule } from '../../payloads/registry';
import type { BackendCapabilities } from '../../payloads/types';

interface AccordionSectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({
  id,
  title,
  icon,
  isOpen,
  onToggle,
  children
}) => {
  return (
    <div className="border border-white/10 rounded-2xl glass-card overflow-hidden flex flex-col shrink-0">
      <button
        id={`accordion-header-${id}`}
        type="button"
        aria-expanded={isOpen}
        aria-controls={`accordion-panel-${id}`}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-200 bg-white/5 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 transition cursor-pointer select-none shrink-0"
      >
        <div className="flex items-center space-x-2">
          {icon}
          <span>{title}</span>
        </div>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        )}
      </button>

      {isOpen && (
        <div
          id={`accordion-panel-${id}`}
          role="region"
          aria-labelledby={`accordion-header-${id}`}
          tabIndex={0}
          className="p-4 space-y-3 max-h-[350px] overflow-y-auto overflow-x-hidden scroll-smooth custom-scrollbar focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500/30"
        >
          {children}
        </div>
      )}
    </div>
  );
};

export const RightPanel: React.FC = () => {
  const {
    qrType,
    payload,
    setPayload,
    style,
    setStyle,
    resetStyle,
    randomizeStyle,
    designTitle,
    setDesignTitle
  } = useStudioStore();

  const [capabilities, setCapabilities] = useState<BackendCapabilities>({
    cloudStorageConfigured: false,
    maxUploadSizeMb: 0
  });

  useEffect(() => {
    fetch('/api/v1/capabilities')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.cloud_storage_configured === 'boolean') {
          setCapabilities({
            cloudStorageConfigured: data.cloud_storage_configured,
            maxUploadSizeMb: data.max_upload_size_mb || 0
          });
        }
      })
      .catch(() => {
        // Fallback for offline backend
      });
  }, []);

  const [openSections, setOpenSections] = useState({
    content: true,
    shapes: true,
    eyes: false,
    colors: false,
    logo: false,
    frame: false
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const activeModule = getPayloadModule(qrType);
  const validation = activeModule.validate(payload);
  const PayloadFormComponent = activeModule.Component;

  const SHAPE_OPTIONS: { id: ModuleShape; label: string }[] = [
    { id: 'square', label: 'Square' },
    { id: 'rounded', label: 'Rounded' },
    { id: 'dots', label: 'Dots' },
    { id: 'diamond', label: 'Diamond' },
    { id: 'bubble', label: 'Bubble' },
    { id: 'circle', label: 'Circle' },
    { id: 'hexagon', label: 'Hexagon' }
  ];

  const EYE_OPTIONS: { id: EyeStyle; label: string }[] = [
    { id: 'square', label: 'Square' },
    { id: 'rounded', label: 'Rounded' },
    { id: 'circle', label: 'Circle' }
  ];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setStyle({ logoUrl: evt.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <aside className="w-full md:w-72 lg:w-80 border-t md:border-t-0 md:border-l border-white/10 glass-panel h-full md:h-[calc(100vh-4rem)] p-4 flex flex-col shrink-0 overflow-y-auto md:overflow-hidden custom-scrollbar">
      {/* QUICK STYLE ACTIONS HEADER */}
      <div className="flex items-center space-x-2 pb-3 mb-3 border-b border-white/10 shrink-0">
        <button
          onClick={resetStyle}
          className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 transition flex items-center justify-center space-x-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Customization</span>
        </button>

        <button
          onClick={randomizeStyle}
          className="py-2 px-3 rounded-xl text-xs font-bold bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 transition flex items-center justify-center space-x-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
          title="Magic Shuffle Design"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>Shuffle</span>
        </button>
      </div>

      {/* ACCORDION SECTIONS WRAPPER */}
      <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar min-h-0 pr-0.5">
        {/* 1. CONTENT PAYLOAD SECTION */}
        <AccordionSection
          id="content"
          title={`1. Payload Content (${activeModule.label})`}
          icon={<SlidersHorizontal className="w-4 h-4 text-indigo-400" />}
          isOpen={openSections.content}
          onToggle={() => toggleSection('content')}
        >
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Design Title
              </label>
              <input
                type="text"
                value={designTitle}
                onChange={(e) => setDesignTitle(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500"
                placeholder="e.g. My Project QR Design"
              />
            </div>

            <div className="pt-2 border-t border-white/5">
              <PayloadFormComponent
                payload={payload}
                onChange={setPayload}
                errors={validation.errors}
                capabilities={capabilities}
              />
            </div>
          </div>
        </AccordionSection>

        {/* 2. MODULE SHAPES */}
        <AccordionSection
          id="shapes"
          title="2. Module Shapes"
          icon={<Shapes className="w-4 h-4 text-purple-400" />}
          isOpen={openSections.shapes}
          onToggle={() => toggleSection('shapes')}
        >
          <div className="grid grid-cols-3 gap-2">
            {SHAPE_OPTIONS.map((shape) => (
              <button
                key={shape.id}
                onClick={() => setStyle({ moduleShape: shape.id })}
                className={`py-2 px-2 rounded-xl text-xs font-semibold border text-center transition ${
                  style.moduleShape === shape.id
                    ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-md'
                    : 'bg-white/5 border-transparent text-slate-400 hover:text-white'
                }`}
              >
                {shape.label}
              </button>
            ))}
          </div>
        </AccordionSection>

        {/* 3. EYE STYLING */}
        <AccordionSection
          id="eyes"
          title="3. Eye Style & Colors"
          icon={<Eye className="w-4 h-4 text-pink-400" />}
          isOpen={openSections.eyes}
          onToggle={() => toggleSection('eyes')}
        >
          <div className="grid grid-cols-3 gap-2">
            {EYE_OPTIONS.map((eye) => (
              <button
                key={eye.id}
                onClick={() => setStyle({ eyeStyle: eye.id })}
                className={`py-2 px-2 rounded-xl text-xs font-semibold border text-center transition ${
                  style.eyeStyle === eye.id
                    ? 'bg-purple-600/30 border-purple-500 text-white'
                    : 'bg-white/5 border-transparent text-slate-400 hover:text-white'
                }`}
              >
                {eye.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                Outer Eye Color
              </label>
              <input
                type="color"
                value={style.eyeOuterColor || style.fgColor}
                onChange={(e) => setStyle({ eyeOuterColor: e.target.value })}
                className="w-full h-8 rounded-lg cursor-pointer bg-transparent"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                Inner Eye Color
              </label>
              <input
                type="color"
                value={style.eyeInnerColor || style.fgColor}
                onChange={(e) => setStyle({ eyeInnerColor: e.target.value })}
                className="w-full h-8 rounded-lg cursor-pointer bg-transparent"
              />
            </div>
          </div>
        </AccordionSection>

        {/* 4. COLORS & GRADIENTS */}
        <AccordionSection
          id="colors"
          title="4. Colors & Gradients"
          icon={<Palette className="w-4 h-4 text-emerald-400" />}
          isOpen={openSections.colors}
          onToggle={() => toggleSection('colors')}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                  Foreground
                </label>
                <input
                  type="color"
                  value={style.fgColor}
                  onChange={(e) => setStyle({ fgColor: e.target.value })}
                  className="w-full h-8 rounded-lg cursor-pointer bg-transparent"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                  Background
                </label>
                <input
                  type="color"
                  value={style.bgColor}
                  disabled={style.transparentBg}
                  onChange={(e) => setStyle({ bgColor: e.target.value })}
                  className="w-full h-8 rounded-lg cursor-pointer bg-transparent disabled:opacity-30"
                />
              </div>
            </div>

            {/* Transparent Background Checkbox */}
            <label className="flex items-center space-x-2 text-xs font-semibold text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={style.transparentBg}
                onChange={(e) => setStyle({ transparentBg: e.target.checked })}
                className="rounded border-slate-700 text-indigo-500 focus:ring-0"
              />
              <span>Transparent Background</span>
            </label>

            {/* Gradient Toggle */}
            <div className="pt-2 border-t border-white/5 space-y-3">
              <label className="flex items-center space-x-2 text-xs font-semibold text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={style.useGradient}
                  onChange={(e) => setStyle({ useGradient: e.target.checked })}
                  className="rounded border-slate-700 text-indigo-500 focus:ring-0"
                />
                <span>Enable Gradient Fill</span>
              </label>

              {style.useGradient && (
                <div className="space-y-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                      Gradient Stop Color
                    </label>
                    <input
                      type="color"
                      value={style.gradientColor2 || '#7c3aed'}
                      onChange={(e) => setStyle({ gradientColor2: e.target.value })}
                      className="w-full h-8 rounded-lg cursor-pointer bg-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </AccordionSection>

        {/* 5. LOGO OVERLAY */}
        <AccordionSection
          id="logo"
          title="5. Brand Logo Overlay"
          icon={<ImageIcon className="w-4 h-4 text-amber-400" />}
          isOpen={openSections.logo}
          onToggle={() => toggleSection('logo')}
        >
          {style.logoUrl ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-white/10">
              <img src={style.logoUrl} alt="Logo preview" className="w-10 h-10 object-contain rounded-lg" />
              <button
                onClick={() => setStyle({ logoUrl: '' })}
                className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-white/10 hover:border-indigo-500/50 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition">
              <Upload className="w-6 h-6 text-slate-400 mb-1" />
              <span className="text-xs font-semibold text-slate-300">Upload Brand Logo</span>
              <span className="text-[10px] text-slate-500">PNG, SVG, JPG up to 5MB</span>
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
          )}
        </AccordionSection>

        {/* 6. CALL TO ACTION FRAME */}
        <AccordionSection
          id="frame"
          title="6. CTA Frame & Badge"
          icon={<Sparkles className="w-4 h-4 text-cyan-400" />}
          isOpen={openSections.frame}
          onToggle={() => toggleSection('frame')}
        >
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setStyle({ frameStyle: 'none' })}
              className={`py-2 px-2 rounded-xl text-xs font-semibold border transition ${
                style.frameStyle === 'none'
                  ? 'bg-indigo-600/30 border-indigo-500 text-white'
                  : 'bg-white/5 border-transparent text-slate-400'
              }`}
            >
              No Frame
            </button>
            <button
              onClick={() => setStyle({ frameStyle: 'badge-bottom' })}
              className={`py-2 px-2 rounded-xl text-xs font-semibold border transition ${
                style.frameStyle === 'badge-bottom'
                  ? 'bg-indigo-600/30 border-indigo-500 text-white'
                  : 'bg-white/5 border-transparent text-slate-400'
              }`}
            >
              Bottom Badge
            </button>
          </div>

          {style.frameStyle !== 'none' && (
            <div className="space-y-2 pt-2">
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                  Frame CTA Text
                </label>
                <input
                  type="text"
                  value={style.frameText}
                  onChange={(e) => setStyle({ frameText: e.target.value })}
                  className="w-full glass-input rounded-xl px-3 py-1.5 text-xs"
                  placeholder="SCAN ME"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                  Badge Color
                </label>
                <input
                  type="color"
                  value={style.frameColor}
                  onChange={(e) => setStyle({ frameColor: e.target.value })}
                  className="w-full h-8 rounded-lg cursor-pointer bg-transparent"
                />
              </div>
            </div>
          )}
        </AccordionSection>
      </div>
    </aside>
  );
};
