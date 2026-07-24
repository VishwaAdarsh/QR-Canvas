import QRCode from 'qrcode';
import type { QRStyleConfig, QRPayload, QRType } from '../types/qr';

export function formatQRPayload(qrType: QRType, payload: QRPayload): string {
  switch (qrType) {
    case 'url': {
      let url = payload.url || 'https://qr-canvas.com';
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      return url;
    }
    case 'text':
      return payload.text || 'QR Canvas — Create Beautiful QR Codes Effortlessly';
    case 'email':
      return `mailto:${payload.email || ''}?subject=${encodeURIComponent(payload.subject || '')}&body=${encodeURIComponent(payload.body || '')}`;
    case 'phone':
      return `tel:${payload.phone || ''}`;
    case 'sms':
      return `smsto:${payload.phone || ''}:${payload.message || ''}`;
    case 'whatsapp': {
      const phone = (payload.phone || '').replace(/\+/g, '').replace(/\s/g, '');
      return `https://wa.me/${phone}?text=${encodeURIComponent(payload.message || '')}`;
    }
    case 'wifi': {
      const ssid = payload.ssid || '';
      const pass = payload.password || '';
      const enc = payload.encryption || 'WPA';
      const hidden = payload.hidden ? 'true' : 'false';
      return `WIFI:S:${ssid};T:${enc};P:${pass};H:${hidden};;`;
    }
    case 'vcard': {
      return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${payload.lastName || ''};${payload.firstName || ''};;;`,
        `FN:${payload.firstName || ''} ${payload.lastName || ''}`,
        `ORG:${payload.org || ''}`,
        `TITLE:${payload.title || ''}`,
        `TEL;TYPE=CELL:${payload.phone || ''}`,
        `EMAIL:${payload.email || ''}`,
        `URL:${payload.url || ''}`,
        'END:VCARD'
      ].join('\n');
    }
    case 'event': {
      const start = (payload.startDate || '').replace(/[-:]/g, '');
      const end = (payload.endDate || '').replace(/[-:]/g, '');
      return [
        'BEGIN:VEVENT',
        `SUMMARY:${payload.eventTitle || 'Event'}`,
        `DTSTART:${start}`,
        `DTEND:${end}`,
        `LOCATION:${payload.location || ''}`,
        `DESCRIPTION:${payload.description || ''}`,
        'END:VEVENT'
      ].join('\n');
    }
    case 'location':
      return `geo:${payload.lat || '0'},${payload.lng || '0'}`;
    case 'social':
      return payload.url || 'https://linktr.ee/qrcanvas';
    case 'payment':
      return payload.upiId ? `upi://pay?pa=${payload.upiId}&pn=QR%20Canvas` : (payload.url || '');
    default:
      return payload.url || payload.text || 'https://qr-canvas.com';
  }
}

export function isFinderPatternModule(r: number, c: number, size: number): boolean {
  // Top-left eye (7x7 at 0,0)
  if (r < 7 && c < 7) return true;
  // Top-right eye (7x7 at 0, size-7)
  if (r < 7 && c >= size - 7) return true;
  // Bottom-left eye (7x7 at size-7, 0)
  if (r >= size - 7 && c < 7) return true;
  return false;
}

export function renderSVGAString(
  payloadStr: string,
  style: QRStyleConfig,
  viewSize: number = 400
): string {
  try {
    const qrData = QRCode.create(payloadStr, { errorCorrectionLevel: style.errorCorrectionLevel });
    const modules = qrData.modules;
    const count = modules.size;
    const margin = 2;
    const totalGrid = count + margin * 2;
    const cellSize = viewSize / totalGrid;

    let svgPaths = '';
    const fg = style.fgColor || '#000000';
    const eyeOuter = style.eyeOuterColor || fg;
    const eyeInner = style.eyeInnerColor || fg;

    // Gradient Defs
    let defs = '';
    let fillStyle = fg;
    if (style.useGradient && style.gradientColor2) {
      fillStyle = 'url(#qr-grad)';
      if (style.gradientType === 'radial') {
        defs = `
          <defs>
            <radialGradient id="qr-grad" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stop-color="${fg}" />
              <stop offset="100%" stop-color="${style.gradientColor2}" />
            </radialGradient>
          </defs>`;
      } else {
        defs = `
          <defs>
            <linearGradient id="qr-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="${fg}" />
              <stop offset="100%" stop-color="${style.gradientColor2}" />
            </linearGradient>
          </defs>`;
      }
    }

    // Draw Data Modules
    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if (!modules.get(r, c)) continue;
        if (isFinderPatternModule(r, c, count)) continue; // Eyes drawn separately for high fidelity

        const x = (c + margin) * cellSize;
        const y = (r + margin) * cellSize;

        if (style.moduleShape === 'dots' || style.moduleShape === 'circle') {
          const radius = cellSize / 2;
          svgPaths += `<circle cx="${x + radius}" cy="${y + radius}" r="${radius * 0.85}" fill="${fillStyle}" />`;
        } else if (style.moduleShape === 'rounded' || style.moduleShape === 'bubble') {
          const rSize = cellSize * 0.35;
          svgPaths += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="${rSize}" fill="${fillStyle}" />`;
        } else if (style.moduleShape === 'diamond') {
          const cx = x + cellSize / 2;
          const cy = y + cellSize / 2;
          svgPaths += `<polygon points="${cx},${y} ${x + cellSize},${cy} ${cx},${y + cellSize} ${x},${cy}" fill="${fillStyle}" />`;
        } else if (style.moduleShape === 'hexagon') {
          const cx = x + cellSize / 2;
          const cy = y + cellSize / 2;
          const r = cellSize / 2;
          const p1 = `${cx},${cy - r}`;
          const p2 = `${cx + r * 0.86},${cy - r * 0.5}`;
          const p3 = `${cx + r * 0.86},${cy + r * 0.5}`;
          const p4 = `${cx},${cy + r}`;
          const p5 = `${cx - r * 0.86},${cy + r * 0.5}`;
          const p6 = `${cx - r * 0.86},${cy - r * 0.5}`;
          svgPaths += `<polygon points="${p1} ${p2} ${p3} ${p4} ${p5} ${p6}" fill="${fillStyle}" />`;
        } else {
          // Classic Square
          svgPaths += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${fillStyle}" />`;
        }
      }
    }

    // Helper to render Eyes
    const renderEye = (startR: number, startC: number) => {
      const outerX = (startC + margin) * cellSize;
      const outerY = (startR + margin) * cellSize;
      const outerSize = 7 * cellSize;
      const innerX = outerX + 2 * cellSize;
      const innerY = outerY + 2 * cellSize;
      const innerSize = 3 * cellSize;

      let eyeSvg = '';
      if (style.eyeStyle === 'circle' || style.eyeStyle === 'rounded') {
        // Outer Ring
        const rOuter = style.eyeStyle === 'circle' ? outerSize / 2 : outerSize * 0.25;
        eyeSvg += `<rect x="${outerX}" y="${outerY}" width="${outerSize}" height="${outerSize}" rx="${rOuter}" fill="${eyeOuter}" />`;
        // Hollow center cutout
        const bgFill = style.transparentBg ? '#ffffff' : style.bgColor;
        const innerHollow = 5 * cellSize;
        const innerHollowPos = outerX + cellSize;
        eyeSvg += `<rect x="${innerHollowPos}" y="${outerY + cellSize}" width="${innerHollow}" height="${innerHollow}" rx="${rOuter * 0.7}" fill="${bgFill}" />`;
        // Inner Dot
        const rInner = style.eyeStyle === 'circle' ? innerSize / 2 : innerSize * 0.25;
        eyeSvg += `<rect x="${innerX}" y="${innerY}" width="${innerSize}" height="${innerSize}" rx="${rInner}" fill="${eyeInner}" />`;
      } else {
        // Classic / Square Eye
        eyeSvg += `<path d="M${outerX},${outerY} v${outerSize} h${outerSize} v-${outerSize} Z M${outerX + cellSize},${outerY + cellSize} h${5 * cellSize} v${5 * cellSize} h-${5 * cellSize} Z" fill="${eyeOuter}" />`;
        eyeSvg += `<rect x="${innerX}" y="${innerY}" width="${innerSize}" height="${innerSize}" fill="${eyeInner}" />`;
      }
      return eyeSvg;
    };

    // Render 3 Eyes
    const eyeTL = renderEye(0, 0);
    const eyeTR = renderEye(0, count - 7);
    const eyeBL = renderEye(count - 7, 0);

    const bgRect = style.transparentBg
      ? ''
      : `<rect width="${viewSize}" height="${viewSize}" fill="${style.bgColor}" />`;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewSize} ${viewSize}" width="100%" height="100%">
      ${defs}
      ${bgRect}
      ${svgPaths}
      ${eyeTL}
      ${eyeTR}
      ${eyeBL}
    </svg>`;
  } catch (err) {
    console.error('Failed to generate SVG QR:', err);
    return `<svg viewBox="0 0 100 100"><text x="10" y="50" fill="red">Error rendering QR</text></svg>`;
  }
}
