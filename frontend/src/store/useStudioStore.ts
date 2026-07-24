import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QRType, QRPayload, QRStyleConfig, SavedQRItem, QRDesignPreset, ModuleShape, EyeStyle } from '../types/qr';
import { getPayloadModule } from '../payloads/registry';

export const DEFAULT_STYLE: QRStyleConfig = {
  moduleShape: 'rounded',
  eyeStyle: 'rounded',
  fgColor: '#000000',
  bgColor: '#ffffff',
  transparentBg: false,
  eyeOuterColor: '#4f46e5',
  eyeInnerColor: '#4f46e5',
  useGradient: true,
  gradientColor2: '#7c3aed',
  gradientType: 'linear',
  logoUrl: '',
  logoScale: 0.2,
  logoMargin: 2,
  removeLogoBg: false,
  logoRadius: 8,
  frameStyle: 'none',
  frameText: 'SCAN ME',
  frameColor: '#4f46e5',
  frameTextColor: '#ffffff',
  errorCorrectionLevel: 'H',
};

interface StudioState {
  // Current Canvas State
  qrType: QRType;
  payload: QRPayload;
  style: QRStyleConfig;
  designTitle: string;
  
  // Viewport Settings
  zoomLevel: number;
  showGrid: boolean;
  deviceMockup: 'none' | 'iphone' | 'card';
  previewDarkBg: boolean;
  
  // History & Collections
  savedItems: SavedQRItem[];
  
  // Actions
  setQRType: (type: QRType) => void;
  setPayload: (payload: Partial<QRPayload>) => void;
  setStyle: (style: Partial<QRStyleConfig>) => void;
  resetStyle: () => void;
  randomizeStyle: () => void;
  setDesignTitle: (title: string) => void;
  setZoomLevel: (zoom: number) => void;
  toggleGrid: () => void;
  setDeviceMockup: (mockup: 'none' | 'iphone' | 'card') => void;
  togglePreviewDarkBg: () => void;
  loadPreset: (preset: QRDesignPreset) => void;
  
  // Storage Actions
  saveCurrentDesign: () => void;
  deleteSavedDesign: (id: string) => void;
  toggleFavorite: (id: string) => void;
  loadSavedDesign: (item: SavedQRItem) => void;
  resetStudio: () => void;
}

export const useStudioStore = create<StudioState>()(
  persist(
    (set, get) => ({
      qrType: 'url',
      payload: getPayloadModule('url').defaultPayload,
      style: DEFAULT_STYLE,
      designTitle: 'Untitled QR Design',
      
      zoomLevel: 100,
      showGrid: true,
      deviceMockup: 'none',
      previewDarkBg: true,
      
      savedItems: [],
      
      setQRType: (type: QRType) =>
        set(() => ({
          qrType: type,
          payload: { ...getPayloadModule(type).defaultPayload }
        })),
        
      setPayload: (newPayload: Partial<QRPayload>) =>
        set((state) => ({
          payload: { ...state.payload, ...newPayload }
        })),
        
      setStyle: (newStyle: Partial<QRStyleConfig>) =>
        set((state) => ({
          style: { ...state.style, ...newStyle }
        })),
        
      resetStyle: () => set({ style: DEFAULT_STYLE }),

      randomizeStyle: () => {
        const shapes: ModuleShape[] = ['rounded', 'dots', 'circle', 'diamond', 'bubble', 'hexagon'];
        const eyes: EyeStyle[] = ['rounded', 'circle', 'square'];
        const colors = [
          { fg: '#6366f1', grad: '#c084fc' },
          { fg: '#10b981', grad: '#06b6d4' },
          { fg: '#ec4899', grad: '#f43f5e' },
          { fg: '#f59e0b', grad: '#fbbf24' },
          { fg: '#3b82f6', grad: '#60a5fa' },
          { fg: '#8b5cf6', grad: '#d8b4fe' }
        ];

        const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
        const randomEye = eyes[Math.floor(Math.random() * eyes.length)];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        set((state) => ({
          style: {
            ...state.style,
            moduleShape: randomShape,
            eyeStyle: randomEye,
            fgColor: randomColor.fg,
            eyeOuterColor: randomColor.fg,
            eyeInnerColor: randomColor.grad,
            useGradient: true,
            gradientColor2: randomColor.grad
          }
        }));
      },
        
      setDesignTitle: (title: string) => set({ designTitle: title }),
      
      setZoomLevel: (zoom: number) => set({ zoomLevel: zoom }),
      toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
      setDeviceMockup: (mockup) => set({ deviceMockup: mockup }),
      togglePreviewDarkBg: () => set((state) => ({ previewDarkBg: !state.previewDarkBg })),
      
      loadPreset: (preset: QRDesignPreset) =>
        set({
          qrType: preset.qrType,
          payload: preset.samplePayload,
          style: preset.style,
          designTitle: preset.name
        }),
        
      saveCurrentDesign: () => {
        const { qrType, payload, style, designTitle, savedItems } = get();
        const newItem: SavedQRItem = {
          id: 'qr_' + Date.now(),
          title: designTitle || `${qrType.toUpperCase()} Design`,
          qrType,
          payload,
          style,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isFavorite: false
        };
        set({ savedItems: [newItem, ...savedItems] });
      },
      
      deleteSavedDesign: (id: string) =>
        set((state) => ({
          savedItems: state.savedItems.filter((i) => i.id !== id)
        })),
        
      toggleFavorite: (id: string) =>
        set((state) => ({
          savedItems: state.savedItems.map((i) =>
            i.id === id ? { ...i, isFavorite: !i.isFavorite } : i
          )
        })),
        
      loadSavedDesign: (item: SavedQRItem) =>
        set({
          qrType: item.qrType,
          payload: item.payload,
          style: item.style,
          designTitle: item.title
        }),
        
      resetStudio: () =>
        set({
          qrType: 'url',
          payload: getPayloadModule('url').defaultPayload,
          style: DEFAULT_STYLE,
          designTitle: 'Untitled QR Design'
        })
    }),
    {
      name: 'qr_canvas_studio_storage'
    }
  )
);
