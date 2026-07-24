import { useState, useEffect } from 'react';
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header
        onOpenExport={() => setIsExportOpen(true)}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Main Studio 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        <LeftSidebar />
        <CenterViewport />
        <RightPanel />
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
