import React from 'react';
import type { QRPayload, QRType } from '../types/qr';

export interface BackendCapabilities {
  cloudStorageConfigured: boolean;
  maxUploadSizeMb: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface PayloadComponentProps {
  payload: QRPayload;
  onChange: (updated: Partial<QRPayload>) => void;
  errors: Record<string, string>;
  capabilities?: BackendCapabilities;
}

export interface PayloadModule {
  id: QRType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'Basic' | 'Communication' | 'Utility' | 'Business' | 'Marketing';
  defaultPayload: Partial<QRPayload>;
  validate: (payload: QRPayload) => ValidationResult;
  format: (payload: QRPayload) => string;
  checkAvailability?: (capabilities?: BackendCapabilities) => {
    available: boolean;
    reason?: string;
  };
  Component: React.FC<PayloadComponentProps>;
}
