import React, { useMemo } from 'react';
import { ZoomIn, ZoomOut, Grid, Smartphone, CreditCard } from 'lucide-react';
import { useStudioStore } from '../../store/useStudioStore';
import { formatQRPayload, renderSVGAString } from '../../lib/qr-renderer';

export const CenterViewport: React.FC = () => {
  const {
    qrType,
    payload,
    style,
    zoomLevel,
    setZoomLevel,
    showGrid,
    toggleGrid,
    deviceMockup,
    setDeviceMockup,
    previewDarkBg
  } = useStudioStore();

  const formattedPayload = useMemo(() => formatQRPayload(qrType, payload), [qrType, payload]);

  const svgMarkup = useMemo(() => {
    return renderSVGAString(formattedPayload, style, 400);
  }, [formattedPayload, style]);

  return (
    <main className="flex-1 h-[calc(100vh-4rem)] relative overflow-hidden flex flex-col items-center justify-center p-6 select-none bg-slate-950">
      {/* Background Grid Pattern */}
      {showGrid && (
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }}
        />
      )}

      {/* Floating Ambient Glow */}
      <div
        className="absolute w-[450px] h-[450px] rounded-full blur-[120px] pointer-events-none opacity-20 transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${style.fgColor || '#6366f1'} 0%, ${style.gradientColor2 || '#c084fc'} 100%)`
        }}
      />

      {/* Canvas Viewport Frame */}
      <div
        className="relative z-10 transition-all duration-300 flex items-center justify-center"
        style={{ transform: `scale(${zoomLevel / 100})` }}
      >
        {deviceMockup === 'iphone' ? (
          /* Phone Device Frame Simulator */
          <div className="w-[320px] h-[640px] bg-slate-900 rounded-[48px] border-4 border-slate-700 p-4 shadow-2xl relative flex flex-col items-center justify-between">
            {/* Notch */}
            <div className="w-32 h-5 bg-slate-950 rounded-b-2xl mb-4" />

            <div className="w-full flex-1 bg-slate-950 rounded-[32px] p-6 flex flex-col items-center justify-center border border-white/5 space-y-4">
              <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                {style.frameText || 'Scan Code'}
              </span>
              <div
                className="w-56 h-56 p-4 rounded-2xl shadow-xl flex items-center justify-center"
                style={{ backgroundColor: previewDarkBg ? '#090a0f' : '#ffffff' }}
                dangerouslySetInnerHTML={{ __html: svgMarkup }}
              />
              <span className="text-xs text-slate-400 text-center truncate max-w-[200px]">
                {formattedPayload}
              </span>
            </div>

            {/* Home Indicator */}
            <div className="w-32 h-1 bg-slate-600 rounded-full mt-3" />
          </div>
        ) : deviceMockup === 'card' ? (
          /* Business Card Mockup */
          <div className="w-[420px] h-[240px] bg-slate-900 rounded-2xl border border-white/10 p-6 shadow-2xl flex items-center justify-between space-x-6 relative overflow-hidden">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                <span className="text-sm font-bold text-white uppercase tracking-wider">
                  {payload.org || 'QR Canvas Studio'}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-300">
                {payload.firstName ? `${payload.firstName} ${payload.lastName}` : 'Scan to Connect'}
              </p>
              <p className="text-[11px] text-slate-400">{payload.title || 'Digital Card'}</p>
              <p className="text-[10px] text-indigo-400 font-mono mt-4 truncate max-w-[180px]">
                {formattedPayload}
              </p>
            </div>

            <div
              className="w-40 h-40 p-2 rounded-xl shadow-lg flex items-center justify-center border border-white/10 shrink-0"
              style={{ backgroundColor: previewDarkBg ? '#090a0f' : '#ffffff' }}
              dangerouslySetInnerHTML={{ __html: svgMarkup }}
            />
          </div>
        ) : (
          /* Studio Standard Standalone QR Canvas */
          <div className="relative group">
            {/* CTA Frame Wrapping Option */}
            <div
              className={`p-6 rounded-3xl transition-all duration-300 ${
                previewDarkBg ? 'bg-slate-900/90 border border-white/10' : 'bg-white text-slate-900 shadow-2xl'
              }`}
            >
              {/* Optional CTA Top Frame */}
              {style.frameStyle === 'badge-top' && (
                <div
                  className="mb-4 text-center py-2 px-4 rounded-xl text-xs font-extrabold tracking-wider uppercase shadow-md"
                  style={{
                    backgroundColor: style.frameColor || '#4f46e5',
                    color: style.frameTextColor || '#ffffff'
                  }}
                >
                  {style.frameText || 'SCAN ME'}
                </div>
              )}

              {/* QR Vector SVG Container */}
              <div
                className={`w-[320px] h-[320px] p-4 rounded-2xl flex items-center justify-center transition-all ${
                  style.transparentBg ? 'bg-checkerboard' : ''
                }`}
                dangerouslySetInnerHTML={{ __html: svgMarkup }}
              />

              {/* Optional CTA Bottom Frame */}
              {style.frameStyle === 'badge-bottom' && (
                <div
                  className="mt-4 text-center py-2.5 px-4 rounded-xl text-xs font-extrabold tracking-wider uppercase shadow-md"
                  style={{
                    backgroundColor: style.frameColor || '#4f46e5',
                    color: style.frameTextColor || '#ffffff'
                  }}
                >
                  {style.frameText || 'SCAN ME'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Viewport Controls Toolbar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 glass-panel px-4 py-2 rounded-2xl flex items-center space-x-4 border border-white/10 shadow-2xl">
        {/* Zoom Controls */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-bold text-slate-300 w-10 text-center">
            {zoomLevel}%
          </span>
          <button
            onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        <div className="h-4 w-[1px] bg-white/10" />

        {/* Grid Toggle */}
        <button
          onClick={toggleGrid}
          className={`p-1.5 rounded-lg transition ${
            showGrid ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:bg-white/10'
          }`}
          title="Toggle Grid Background"
        >
          <Grid className="w-4 h-4" />
        </button>

        <div className="h-4 w-[1px] bg-white/10" />

        {/* Device Frame Simulator Toggles */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setDeviceMockup(deviceMockup === 'iphone' ? 'none' : 'iphone')}
            className={`p-1.5 rounded-lg transition ${
              deviceMockup === 'iphone'
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'text-slate-400 hover:bg-white/10'
            }`}
            title="iPhone Mockup"
          >
            <Smartphone className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceMockup(deviceMockup === 'card' ? 'none' : 'card')}
            className={`p-1.5 rounded-lg transition ${
              deviceMockup === 'card'
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'text-slate-400 hover:bg-white/10'
            }`}
            title="Business Card Mockup"
          >
            <CreditCard className="w-4 h-4" />
          </button>
        </div>
      </div>
    </main>
  );
};
