import { echoDatabase } from './echoData';
import { getEchoIcon } from './iconAssets';

export interface ScannerTemplate {
  echoId: string;
  cost: 1 | 3 | 4;
  pixels: Uint8ClampedArray;
}

export function loadScannerImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const timeout = window.setTimeout(() => finish(new Error('Image load timed out')), 15000);
    const finish = (error?: Error) => {
      window.clearTimeout(timeout);
      image.onload = null;
      image.onerror = null;
      if (error) reject(error);
      else resolve(image);
    };
    image.onerror = () => finish(new Error('Failed to load image'));
    image.onload = () => {
      // Wait for decoding before drawing; decoding errors reject this image only.
      image.decode().then(() => finish(), () => finish(new Error('Failed to decode image')));
    };
    // Install handlers before setting src, including for cached images.
    image.src = src;
  });
}

let templatePromise: Promise<readonly ScannerTemplate[]> | undefined;

export function loadEchoTemplates(): Promise<readonly ScannerTemplate[]> {
  if (!templatePromise) {
    templatePromise = (async () => {
      const failedIds: string[] = [];
      const results = await Promise.all(echoDatabase.map(async (echo): Promise<ScannerTemplate | null> => {
        const src = getEchoIcon(echo.id);
        if (!src) return null;
        try {
          const image = await loadScannerImage(src);
          const canvas = document.createElement('canvas');
          canvas.width = 16;
          canvas.height = 16;
          const context = canvas.getContext('2d');
          if (!context) throw new Error('Could not create template canvas context');
          context.drawImage(image, 0, 0, 16, 16);
          return {
            echoId: echo.id,
            cost: echo.cost,
            pixels: context.getImageData(0, 0, 16, 16).data,
          };
        } catch {
          failedIds.push(echo.id);
          return null;
        }
      }));
      if (import.meta.env.DEV && failedIds.length) {
        console.warn('[scanner] Failed to prepare Echo templates', failedIds.sort());
      }
      return results.filter((result): result is ScannerTemplate => result !== null);
    })();
  }
  return templatePromise;
}

export function matchEchoTemplate(
  source: Uint8ClampedArray,
  templates: readonly ScannerTemplate[],
  expectedCost: 1 | 3 | 4,
): string | null {
  let bestId: string | null = null;
  let bestDistance = Infinity;
  for (const template of templates) {
    // The scanner assigns cost by column; don't assign a different-cost Echo ID.
    if (template.cost !== expectedCost) continue;
    let distance = 0;
    for (let i = 0; i < source.length; i += 4) {
      distance += Math.abs(source[i] - template.pixels[i]);
      distance += Math.abs(source[i + 1] - template.pixels[i + 1]);
      distance += Math.abs(source[i + 2] - template.pixels[i + 2]);
    }
    if (distance < bestDistance) {
      bestDistance = distance;
      bestId = template.echoId;
    }
  }
  return bestDistance > 3500 ? null : bestId;
}
