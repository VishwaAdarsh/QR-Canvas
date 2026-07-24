import { useState, useEffect } from 'react';
import { Sparkles, Eye, SlidersHorizontal } from 'lucide-react';
import { Header } from './components/layout/Header';
import { LeftSidebar } from './components/studio/LeftSidebar';
import { CenterViewport } from './components/canvas/CenterViewport';
import { RightPanel } from './components/studio/RightPanel';
import { ExportModal } from './components/modals/ExportModal';
import { TemplatesModal } from './components/modals/TemplatesModal';
import { HistoryDrawer } from './components/modals/HistoryDrawer';
import { CommandPalette } from './components/modals/CommandPalette';
import { useStudioStore } from './store/useStudioStore';

export function App() {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'payload' | 'preview' | 'customizer'>('preview');

  const { saveCurrentDesign } = useStudioStore();

  useEffect(() => {
    const handleGlobalShortcuts = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveCurrentDesign();
      }
    };
    window.addEventListener('keydown', handleGlobalShortcuts);
    return () => window.removeEventListener('keydown', handleGlobalShortcuts);
  }, [saveCurrentDesign]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {/* Top Header */}
      <Header
        onOpenExport={() => setIsExportOpen(true)}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Mobile Tab Navigation Bar (Visible only on screens below md/768px) */}
      <div className="md:hidden flex items-center justify-around border-b border-white/10 bg-slate-900/90 p-2 shrink-0 z-30">
        <button
          onClick={() => setMobileTab('payload')}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
            mobileTab === 'payload'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Payload</span>
        </button>

        <button
          onClick={() => setMobileTab('preview')}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
            mobileTab === 'preview'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Preview</span>
        </button>

        <button
          onClick={() => setMobileTab('customizer')}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
            mobileTab === 'customizer'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Customize</span>
        </button>
      </div>

      {/* Main Studio Workspace Layout */}
      <div className="flex-1 flex overflow-hidden flex-col md:flex-row">
        <div className={`${mobileTab === 'payload' ? 'block' : 'hidden'} md:block h-full shrink-0`}>
          <LeftSidebar />
        </div>
        <div className={`${mobileTab === 'preview' ? 'flex' : 'hidden'} md:flex flex-1 h-full min-w-0`}>
          <CenterViewport />
        </div>
        <div className={`${mobileTab === 'customizer' ? 'block' : 'hidden'} md:block h-full shrink-0`}>
          <RightPanel />
        </div>
      </div>

      {/* Modals & Overlays */}
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
      <TemplatesModal isOpen={isTemplatesOpen} onClose={() => setIsTemplatesOpen(false)} />
      <HistoryDrawer isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
      />
    </div>
  );
}

export default App;
