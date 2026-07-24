import type { QRType } from '../types/qr';
import type { PayloadModule } from './types';
import { urlPayloadModule } from './modules/url';
import { textPayloadModule } from './modules/text';
import { emailPayloadModule } from './modules/email';
import { phonePayloadModule } from './modules/phone';
import { smsPayloadModule } from './modules/sms';
import { whatsappPayloadModule } from './modules/whatsapp';
import { wifiPayloadModule } from './modules/wifi';
import { vcardPayloadModule } from './modules/vcard';
import { eventPayloadModule } from './modules/event';
import { locationPayloadModule } from './modules/location';
import { socialPayloadModule } from './modules/social';
import { pdfPayloadModule } from './modules/pdf';
import { appStorePayloadModule } from './modules/appstore';
import { paymentPayloadModule } from './modules/payment';

class PayloadRegistry {
  private modules: Map<QRType, PayloadModule> = new Map();

  constructor() {
    this.register(urlPayloadModule);
    this.register(textPayloadModule);
    this.register(emailPayloadModule);
    this.register(phonePayloadModule);
    this.register(smsPayloadModule);
    this.register(whatsappPayloadModule);
    this.register(wifiPayloadModule);
    this.register(vcardPayloadModule);
    this.register(eventPayloadModule);
    this.register(locationPayloadModule);
    this.register(socialPayloadModule);
    this.register(pdfPayloadModule);
    this.register(appStorePayloadModule);
    this.register(paymentPayloadModule);
  }

  public register(module: PayloadModule): void {
    this.modules.set(module.id, module);
  }

  public get(id: QRType): PayloadModule {
    const module = this.modules.get(id);
    if (!module) {
      // Fallback to URL module if unrecognised type
      return urlPayloadModule;
    }
    return module;
  }

  public getAll(): PayloadModule[] {
    return Array.from(this.modules.values());
  }
}

export const payloadRegistry = new PayloadRegistry();
export const getPayloadModule = (id: QRType) => payloadRegistry.get(id);
export const getAllPayloadModules = () => payloadRegistry.getAll();
export const registerPayloadModule = (mod: PayloadModule) => payloadRegistry.register(mod);
