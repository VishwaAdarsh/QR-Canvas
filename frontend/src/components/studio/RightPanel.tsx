import React, { useState } from 'react';
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
    <aside className="w-80 border-l border-white/10 glass-panel h-[calc(100vh-4rem)] overflow-y-auto p-4 flex flex-col space-y-4 shrink-0 pb-16">
      {/* QUICK STYLE ACTIONS HEADER */}
      <div className="flex items-center space-x-2 pb-1 border-b border-white/10">
        <button
          onClick={resetStyle}
          className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 transition flex items-center justify-center space-x-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Customization</span>
        </button>

        <button
          onClick={randomizeStyle}
          className="py-2 px-3 rounded-xl text-xs font-bold bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 transition flex items-center justify-center space-x-1"
          title="Magic Shuffle Design"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>Shuffle</span>
        </button>
      </div>

      {/* 1. CONTENT PAYLOAD SECTION (Scrollable container) */}
      <div className="border border-white/10 rounded-2xl glass-card overflow-hidden">
        <button
          onClick={() => toggleSection('content')}
          className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-200 bg-white/5 hover:bg-white/10 transition"
        >
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
            <span>1. Payload Content ({qrType.toUpperCase()})</span>
          </div>
          {openSections.content ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {openSections.content && (
          <div className="p-4 space-y-3 max-h-60 overflow-y-auto pr-1">
            {qrType === 'url' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Website URL Link
                  </label>
                  <input
                    type="url"
                    value={payload.url || ''}
                    onChange={(e) => setPayload({ url: e.target.value })}
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Design File Name / Title
                  </label>
                  <input
                    type="text"
                    value={designTitle}
                    onChange={(e) => setDesignTitle(e.target.value)}
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g. My Project QR Design"
                  />
                </div>
              </div>
            )}

            {qrType === 'text' && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Text Message
                </label>
                <textarea
                  rows={3}
                  value={payload.text || ''}
                  onChange={(e) => setPayload({ text: e.target.value })}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500"
                  placeholder="Enter text payload..."
                />
              </div>
            )}

            {qrType === 'wifi' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Network Name (SSID)
                  </label>
                  <input
                    type="text"
                    value={payload.ssid || ''}
                    onChange={(e) => setPayload({ ssid: e.target.value })}
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                    placeholder="MyWiFiNetwork"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={payload.password || ''}
                    onChange={(e) => setPayload({ password: e.target.value })}
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                    placeholder="WiFi Password"
                  />
                </div>
              </div>
            )}

            {qrType === 'vcard' && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={payload.firstName || ''}
                    onChange={(e) => setPayload({ firstName: e.target.value })}
                    className="glass-input rounded-xl px-2.5 py-1.5 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={payload.lastName || ''}
                    onChange={(e) => setPayload({ lastName: e.target.value })}
                    className="glass-input rounded-xl px-2.5 py-1.5 text-xs"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Company / Org"
                  value={payload.org || ''}
                  onChange={(e) => setPayload({ org: e.target.value })}
                  className="w-full glass-input rounded-xl px-2.5 py-1.5 text-xs"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={payload.email || ''}
                  onChange={(e) => setPayload({ email: e.target.value })}
                  className="w-full glass-input rounded-xl px-2.5 py-1.5 text-xs"
                />
              </div>
            )}

            {qrType === 'email' && (
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="Recipient Email"
                  value={payload.email || ''}
                  onChange={(e) => setPayload({ email: e.target.value })}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                />
                <input
                  type="text"
                  placeholder="Subject"
                  value={payload.subject || ''}
                  onChange={(e) => setPayload({ subject: e.target.value })}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                />
              </div>
            )}

            {qrType === 'phone' && (
              <input
                type="tel"
                placeholder="+1 555 000 0000"
                value={payload.phone || ''}
                onChange={(e) => setPayload({ phone: e.target.value })}
                className="w-full glass-input rounded-xl px-3 py-2 text-xs"
              />
            )}
          </div>
        )}
      </div>

      {/* 2. MODULE SHAPES */}
      <div className="border border-white/10 rounded-2xl glass-card overflow-hidden">
        <button
          onClick={() => toggleSection('shapes')}
          className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-200 bg-white/5 hover:bg-white/10 transition"
        >
          <div className="flex items-center space-x-2">
            <Shapes className="w-4 h-4 text-purple-400" />
            <span>2. Module Shapes</span>
          </div>
          {openSections.shapes ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {openSections.shapes && (
          <div className="p-4 grid grid-cols-3 gap-2">
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
        )}
      </div>

      {/* 3. EYE STYLING */}
      <div className="border border-white/10 rounded-2xl glass-card overflow-hidden">
        <button
          onClick={() => toggleSection('eyes')}
          className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-200 bg-white/5 hover:bg-white/10 transition"
        >
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-pink-400" />
            <span>3. Eye Style & Colors</span>
          </div>
          {openSections.eyes ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {openSections.eyes && (
          <div className="p-4 space-y-3">
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
          </div>
        )}
      </div>

      {/* 4. COLORS & GRADIENTS */}
      <div className="border border-white/10 rounded-2xl glass-card overflow-hidden">
        <button
          onClick={() => toggleSection('colors')}
          className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-200 bg-white/5 hover:bg-white/10 transition"
        >
          <div className="flex items-center space-x-2">
            <Palette className="w-4 h-4 text-emerald-400" />
            <span>4. Colors & Gradients</span>
          </div>
          {openSections.colors ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {openSections.colors && (
          <div className="p-4 space-y-4">
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
        )}
      </div>

      {/* 5. LOGO OVERLAY */}
      <div className="border border-white/10 rounded-2xl glass-card overflow-hidden">
        <button
          onClick={() => toggleSection('logo')}
          className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-200 bg-white/5 hover:bg-white/10 transition"
        >
          <div className="flex items-center space-x-2">
            <ImageIcon className="w-4 h-4 text-amber-400" />
            <span>5. Brand Logo Overlay</span>
          </div>
          {openSections.logo ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {openSections.logo && (
          <div className="p-4 space-y-3">
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
          </div>
        )}
      </div>

      {/* 6. CALL TO ACTION FRAME */}
      <div className="border border-white/10 rounded-2xl glass-card overflow-hidden">
        <button
          onClick={() => toggleSection('frame')}
          className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-200 bg-white/5 hover:bg-white/10 transition"
        >
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>6. CTA Frame & Badge</span>
          </div>
          {openSections.frame ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {openSections.frame && (
          <div className="p-4 space-y-3">
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
          </div>
        )}
      </div>
    </aside>
  );
};
