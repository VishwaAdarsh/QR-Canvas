import React, { useState } from 'react';
import { X, Download, FileCode, Image as ImageIcon, FileText, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import jsPDF from 'jspdf';
import { useStudioStore } from '../../store/useStudioStore';
import { formatQRPayload, renderSVGAString } from '../../lib/qr-renderer';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { qrType, payload, style, designTitle } = useStudioStore();
  const [resolution, setResolution] = useState(1024);
  const [format, setFormat] = useState<'png' | 'svg' | 'pdf'>('png');
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleDownload = async () => {
    setIsExporting(true);
    const formattedPayload = formatQRPayload(qrType, payload);
    const svgStr = renderSVGAString(formattedPayload, style, resolution);

    const filename = `${designTitle.replace(/\s+/g, '_').toLowerCase() || 'qr_canvas'}_${Date.now()}`;

    if (format === 'svg') {
      const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.svg`;
      link.click();
      URL.revokeObjectURL(url);
      triggerConfetti();
    } else if (format === 'png') {
      const img = new Image();
      const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = resolution;
        canvas.height = resolution;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, resolution, resolution);
          const pngUrl = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = pngUrl;
          a.download = `${filename}.png`;
          a.click();
          triggerConfetti();
        }
        URL.revokeObjectURL(url);
      };
      img.src = url;
    } else if (format === 'pdf') {
      const img = new Image();
      const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, 1024, 1024);
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
          pdf.setFontSize(18);
          pdf.text(designTitle || 'QR Canvas Design', 105, 30, { align: 'center' });
          pdf.addImage(imgData, 'PNG', 55, 55, 100, 100);
          pdf.setFontSize(10);
          pdf.text(`Payload: ${formattedPayload}`, 105, 170, { align: 'center' });
          pdf.save(`${filename}.pdf`);
          triggerConfetti();
        }
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }

    setIsExporting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-[94vw] sm:w-full max-w-md glass-panel rounded-3xl p-4 sm:p-6 border border-white/10 shadow-2xl space-y-4 sm:space-y-6 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Export QR Design</h3>
            <p className="text-xs text-slate-400">Download studio-grade vector & raster files</p>
          </div>
        </div>

        {/* Format Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Export Format
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setFormat('png')}
              className={`p-3 rounded-2xl border flex flex-col items-center space-y-1 transition ${
                format === 'png'
                  ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-white/5 border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-5 h-5" />
              <span className="text-xs font-bold">PNG</span>
              <span className="text-[9px] text-slate-400">Raster Image</span>
            </button>

            <button
              onClick={() => setFormat('svg')}
              className={`p-3 rounded-2xl border flex flex-col items-center space-y-1 transition ${
                format === 'svg'
                  ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-white/5 border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <FileCode className="w-5 h-5" />
              <span className="text-xs font-bold">SVG</span>
              <span className="text-[9px] text-slate-400">Vector Print</span>
            </button>

            <button
              onClick={() => setFormat('pdf')}
              className={`p-3 rounded-2xl border flex flex-col items-center space-y-1 transition ${
                format === 'pdf'
                  ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-white/5 border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="text-xs font-bold">PDF</span>
              <span className="text-[9px] text-slate-400">Document</span>
            </button>
          </div>
        </div>

        {/* Resolution Slider (for PNG) */}
        {format === 'png' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">Image Resolution</span>
              <span className="font-mono text-indigo-400 font-bold">
                {resolution} x {resolution} px
              </span>
            </div>
            <input
              type="range"
              min={512}
              max={4096}
              step={256}
              value={resolution}
              onChange={(e) => setResolution(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>
        )}

        {/* Download Trigger */}
        <button
          onClick={handleDownload}
          disabled={isExporting}
          className="w-full py-3.5 rounded-2xl text-sm font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white shadow-xl shadow-indigo-500/25 active:scale-95 transition flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isExporting ? 'Generating...' : `Download ${format.toUpperCase()}`}</span>
        </button>
      </div>
    </div>
  );
};
