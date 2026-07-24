import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QRType, QRPayload, QRStyleConfig, SavedQRItem, QRDesignPreset, ModuleShape, EyeStyle } from '../types/qr';

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

export const DEFAULT_PAYLOADS: Record<QRType, QRPayload> = {
  url: { url: 'https://qr-canvas.com' },
  text: { text: 'Welcome to QR Canvas — Create Beautiful QR Codes Effortlessly!' },
  email: { email: 'hello@qrcanvas.studio', subject: 'Inquiry from QR Canvas', body: 'Hi there!' },
  phone: { phone: '+1 (555) 234-5678' },
  sms: { phone: '+1 (555) 234-5678', message: 'Hello! I scanned your QR Canvas code.' },
  whatsapp: { phone: '+15552345678', message: 'Hi! I found your contact on QR Canvas.' },
  wifi: { ssid: 'QR_Canvas_5G', password: 'SuperSecretPasscode', encryption: 'WPA', hidden: false },
  vcard: {
    firstName: 'Alex',
    lastName: 'Morgan',
    org: 'QR Canvas Studio',
    title: 'Lead Product Designer',
    phone: '+1 (555) 019-2834',
    email: 'alex@qrcanvas.studio',
    url: 'https://qrcanvas.studio'
  },
  event: {
    eventTitle: 'QR Canvas Product Launch',
    startDate: '2026-09-01T10:00',
    endDate: '2026-09-01T12:00',
    location: 'San Francisco, CA & Online',
    description: 'Join us live for the official launch of QR Canvas 2.0!'
  },
  location: { lat: '37.7749', lng: '-122.4194' },
  social: { url: 'https://twitter.com/qrcanvas' },
  pdf: { pdfUrl: 'https://qrcanvas.studio/docs/portfolio.pdf' },
  appstore: { iosUrl: 'https://apps.apple.com/app/qrcanvas', androidUrl: 'https://play.google.com/store/apps/qrcanvas' },
  payment: { upiId: 'qrcanvas@upi', url: 'https://paypal.me/qrcanvas' }
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
      payload: DEFAULT_PAYLOADS.url,
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
          payload: DEFAULT_PAYLOADS[type] || {}
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
          payload: DEFAULT_PAYLOADS.url,
          style: DEFAULT_STYLE,
          designTitle: 'Untitled QR Design'
        })
    }),
    {
      name: 'qr_canvas_studio_storage'
    }
  )
);
