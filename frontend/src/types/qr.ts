export type QRType =
  | 'url'
  | 'text'
  | 'email'
  | 'phone'
  | 'sms'
  | 'whatsapp'
  | 'wifi'
  | 'vcard'
  | 'event'
  | 'location'
  | 'social'
  | 'pdf'
  | 'appstore'
  | 'payment';

export type ModuleShape =
  | 'square'
  | 'rounded'
  | 'dots'
  | 'diamond'
  | 'bubble'
  | 'circle'
  | 'hexagon'
  | 'star';

export type EyeStyle =
  | 'square'
  | 'rounded'
  | 'circle'
  | 'frame'
  | 'modern'
  | 'minimal';

export type GradientType = 'none' | 'linear' | 'radial';

export type FrameStyle =
  | 'none'
  | 'badge-bottom'
  | 'badge-top'
  | 'scanner-border'
  | 'phone-frame'
  | 'floating-tag'
  | 'card-frame';

export interface QRPayload {
  url?: string;
  text?: string;
  email?: string;
  subject?: string;
  body?: string;
  phone?: string;
  message?: string;
  ssid?: string;
  password?: string;
  encryption?: 'WPA' | 'WEP' | 'nopass';
  hidden?: boolean;
  firstName?: string;
  lastName?: string;
  org?: string;
  title?: string;
  lat?: string;
  lng?: string;
  locationUrl?: string;
  eventTitle?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  description?: string;
  socialLinks?: { platform: string; url: string }[];
  socialPlatform?: string;
  socialHandle?: string;
  pdfUrl?: string;
  pdfFileName?: string;
  appPlatform?: string;
  appUrl?: string;
  upiId?: string;
  payeeName?: string;
  amount?: string;
  cryptoAddress?: string;
}

export interface QRStyleConfig {
  moduleShape: ModuleShape;
  eyeStyle: EyeStyle;
  fgColor: string;
  bgColor: string;
  transparentBg: boolean;
  eyeOuterColor?: string;
  eyeInnerColor?: string;
  useGradient: boolean;
  gradientColor2?: string;
  gradientType: GradientType;
  
  // Logo
  logoUrl?: string;
  logoScale: number; // 0.1 to 0.35
  logoMargin: number;
  removeLogoBg: boolean;
  logoRadius: number;
  
  // Frame & CTA
  frameStyle: FrameStyle;
  frameText: string;
  frameColor: string;
  frameTextColor: string;
  
  // Resolution & Quality
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
}

export interface QRDesignPreset {
  id: string;
  name: string;
  category: string;
  qrType: QRType;
  style: QRStyleConfig;
  samplePayload: QRPayload;
}

export interface SavedQRItem {
  id: string;
  title: string;
  qrType: QRType;
  payload: QRPayload;
  style: QRStyleConfig;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
}
