import React, { useState } from 'react';
import {
  Sparkles,
  Download,
  LayoutTemplate,
  History,
  Sun,
  Moon,
  Save,
  Check,
  RotateCcw,
  Shuffle
} from 'lucide-react';
import { useStudioStore } from '../../store/useStudioStore';

interface HeaderProps {
  onOpenExport: () => void;
  onOpenTemplates: () => void;
  onOpenHistory: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenExport,
  onOpenTemplates,
  onOpenHistory
}) => {
  const {
    designTitle,
    setDesignTitle,
    saveCurrentDesign,
    previewDarkBg,
    togglePreviewDarkBg,
    resetStyle,
    randomizeStyle
  } = useStudioStore();
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    saveCurrentDesign();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <header className="h-16 border-b border-white/10 glass-panel px-3 sm:px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Brand Logo & Title */}
      <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <span className="font-extrabold text-base sm:text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
              QR Canvas
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              STUDIO PRO
            </span>
          </div>
        </div>

        <div className="h-5 w-[1px] bg-white/10 hidden md:block" />

        {/* Editable Title Input */}
        <div className="hidden md:flex items-center space-x-2">
          <input
            type="text"
            value={designTitle}
            onChange={(e) => setDesignTitle(e.target.value)}
            className="bg-transparent border border-transparent hover:border-white/10 focus:border-indigo-500/50 rounded-lg px-2.5 py-1 text-sm font-medium text-slate-200 focus:outline-none focus:bg-slate-900/50 transition max-w-[140px] lg:max-w-xs"
            placeholder="Name your QR design..."
          />
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
        {/* Reset Style Button */}
        <button
          onClick={resetStyle}
          title="Reset Customization to Default"
          className="flex items-center space-x-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        {/* Shuffle Style Button */}
        <button
          onClick={randomizeStyle}
          title="Magic Shuffle Style"
          className="flex items-center space-x-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 transition"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Shuffle</span>
        </button>

        {/* Templates Button */}
        <button
          onClick={onOpenTemplates}
          className="flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition"
        >
          <LayoutTemplate className="w-4 h-4 text-indigo-400" />
          <span className="hidden sm:inline">Templates</span>
        </button>

        {/* History Button */}
        <button
          onClick={onOpenHistory}
          className="flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition"
        >
          <History className="w-4 h-4 text-purple-400" />
          <span className="hidden sm:inline">History</span>
        </button>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="flex items-center space-x-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 transition"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">Save</span>
            </>
          )}
        </button>

        {/* Toggle Dark/Light Preview */}
        <button
          onClick={togglePreviewDarkBg}
          title="Toggle Canvas Preview Theme"
          className="p-1.5 sm:p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition"
        >
          {previewDarkBg ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Export Button */}
        <button
          onClick={onOpenExport}
          className="flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white shadow-lg shadow-indigo-500/25 active:scale-95 transition"
        >
          <Download className="w-4 h-4" />
          <span className="text-xs">Export</span>
        </button>
      </div>
    </header>
  );
};
