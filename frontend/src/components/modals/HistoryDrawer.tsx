import React, { useState } from 'react';
import { X, Search, Star, Trash2, History, Clock } from 'lucide-react';
import { useStudioStore } from '../../store/useStudioStore';
import { formatQRPayload, renderSVGAString } from '../../lib/qr-renderer';
import type { SavedQRItem } from '../../types/qr';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ isOpen, onClose }) => {
  const { savedItems, loadSavedDesign, deleteSavedDesign, toggleFavorite } = useStudioStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  if (!isOpen) return null;

  const filteredItems = savedItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.qrType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFav = showOnlyFavorites ? item.isFavorite : true;
    return matchesSearch && matchesFav;
  });

  const handleSelect = (item: SavedQRItem) => {
    loadSavedDesign(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md h-full glass-panel border-l border-white/10 p-6 flex flex-col space-y-6 shadow-2xl relative">
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Saved Designs History</h3>
              <p className="text-xs text-slate-400">{savedItems.length} saved QR codes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Favorites Filter Bar */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search saved designs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-xs"
            />
          </div>

          <button
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              showOnlyFavorites
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>Favorites Only</span>
          </button>
        </div>

        {/* Saved List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filteredItems.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center space-y-2 text-slate-500">
              <Clock className="w-8 h-8 stroke-1" />
              <p className="text-xs font-semibold">No saved designs found</p>
              <p className="text-[10px]">Click 'Save' in the header to store designs</p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const formatted = formatQRPayload(item.qrType, item.payload);
              const svgMarkup = renderSVGAString(formatted, item.style, 120);

              return (
                <div
                  key={item.id}
                  className="glass-card p-3 rounded-2xl border border-white/10 flex items-center justify-between space-x-3 group hover:border-indigo-500/40 transition"
                >
                  {/* Thumbnail */}
                  <div
                    onClick={() => handleSelect(item)}
                    className="w-14 h-14 rounded-xl p-1 shrink-0 cursor-pointer flex items-center justify-center overflow-hidden border border-white/10"
                    style={{ backgroundColor: item.style.bgColor || '#090a0f' }}
                    dangerouslySetInnerHTML={{ __html: svgMarkup }}
                  />

                  {/* Metadata */}
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleSelect(item)}>
                    <h4 className="text-xs font-bold text-slate-200 truncate group-hover:text-indigo-400 transition">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">
                      {item.qrType}
                    </p>
                    <p className="text-[9px] text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className={`p-1.5 rounded-lg hover:bg-white/10 transition ${
                        item.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-slate-500'
                      }`}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteSavedDesign(item.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
