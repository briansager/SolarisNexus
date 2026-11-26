import { useState, useRef } from 'react';
import { createWorker, PSM } from 'tesseract.js';
import type { Echo, StatType, SubStat } from '../types';
import { echoDatabase } from '../echoData';

interface BuildScannerProps {
  onComplete: (echoes: Echo[]) => void;
  onClose: () => void;
}

// ---- Layout of the official build image (reference size 1920x1080) ----
const REF_W = 1920;
const REF_H = 1080;
const CARD_X = [22, 397, 771, 1146, 1518]; // left edge of each echo card
const COSTS: (1 | 3 | 4)[] = [4, 3, 3, 1, 1];
const ROW_Y = [893, 927, 961, 995, 1029]; // vertical center of each sub-stat row
const ROW_HALF = 11;

interface Box { x: number; y: number; w: number; h: number }

const mainLabelBox = (cx: number): Box => ({ x: cx + 195, y: 722, w: 167, h: 27 });
const mainValueBox = (cx: number): Box => ({ x: cx + 293, y: 752, w: 66, h: 36 });
const subLabelBox = (cx: number, i: number): Box => ({ x: cx + 40, y: ROW_Y[i] - ROW_HALF, w: 232, h: ROW_HALF * 2 });
const subValueBox = (cx: number, i: number): Box => ({ x: cx + 272, y: ROW_Y[i] - ROW_HALF, w: 88, h: ROW_HALF * 2 });

// ---- Image helpers ----
const SCALE = 3;
const PAD = 10;

const cropToCanvas = (img: HTMLImageElement, box: Box): HTMLCanvasElement => {
  const sx = img.naturalWidth / REF_W;
  const sy = img.naturalHeight / REF_H;
  const iw = Math.round(box.w * sx * SCALE);
  const ih = Math.round(box.h * sy * SCALE);

  const canvas = document.createElement('canvas');
  canvas.width = iw + PAD * 2;
  canvas.height = ih + PAD * 2;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Could not create canvas context');

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, box.x * sx, box.y * sy, box.w * sx, box.h * sy, PAD, PAD, iw, ih);

  // Light text on dark -> black text on white
  const data = ctx.getImageData(PAD, PAD, iw, ih);
  const d = data.data;
  for (let i = 0; i < d.length; i += 4) {
    const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    const v = gray > 110 ? 0 : 255;
    d[i] = d[i + 1] = d[i + 2] = v;
    d[i + 3] = 255;
  }
  ctx.putImageData(data, PAD, PAD);
  return canvas;
};

// ---- Parsing helpers ----
const matchStat = (text: string, pct: boolean): StatType | null => {
  const c = text.toLowerCase().replace(/[^a-z0-9]/g, '');
  const has = (s: string) => c.includes(s);

  if (has('energy') || has('regen')) return 'Energy Regen';
  if (has('healing')) return 'Healing Bonus';
  if (has('aero')) return 'Aero DMG Bonus';
  if (has('glacio')) return 'Glacio DMG Bonus';
  if (has('fusion')) return 'Fusion DMG Bonus';
  if (has('electro')) return 'Electro DMG Bonus';
  if (has('spectro')) return 'Spectro DMG Bonus';
  if (has('havoc')) return 'Havoc DMG Bonus';
  if (has('basic')) return 'Basic Attack DMG Bonus';
  if (has('heavy')) return 'Heavy Attack DMG Bonus';
  if (has('liberation')) return 'Resonance Liberation DMG Bonus';
  if (has('resonance') || has('skill')) return 'Resonance Skill DMG Bonus';
  if (has('rate')) return 'Crit Rate';
  if (has('crit') || has('cdmg')) return 'Crit DMG';
  if (has('atk')) return pct ? 'ATK%' : 'ATK';
  if (has('hp')) return pct ? 'HP%' : 'HP';
  if (has('def')) return pct ? 'DEF%' : 'DEF';
  return null;
};

const parseValue = (text: string): { value: number; pct: boolean } | null => {
  const m = text.replace(/,/g, '').match(/\d+(?:\.\d+)?/);
  if (!m) return null;
  return { value: parseFloat(m[0]), pct: text.includes('%') };
};

// The Echo dropdown only offers flat ATK/HP/DEF as Cost 1 main stats
const toCost1Main = (s: StatType): StatType => {
  if (s === 'ATK%') return 'ATK';
  if (s === 'HP%') return 'HP';
  if (s === 'DEF%') return 'DEF';
  return s;
};

export default function BuildScanner({ onComplete, onClose }: BuildScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [debug, setDebug] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setProgress(0);
    setStatus('Loading OCR engine');
    setError(null);
    setDebug('');

    type Worker = Awaited<ReturnType<typeof createWorker>>;
    let labelWorker: Worker | null = null;
    let valueWorker: Worker | null = null;
    const url = URL.createObjectURL(file);

    try {
      const img = new Image();
      img.src = url;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
      });

      const ratio = img.naturalWidth / img.naturalHeight;
      if (Math.abs(ratio - REF_W / REF_H) > 0.03) {
        throw new Error('Use the original 16:9 build image without cropping or editing it.');
      }

      labelWorker = await createWorker('eng');
      valueWorker = await createWorker('eng');
      await labelWorker.setParameters({ tessedit_pageseg_mode: PSM.SINGLE_LINE });
      await valueWorker.setParameters({
        tessedit_pageseg_mode: PSM.SINGLE_LINE,
        tessedit_char_whitelist: '0123456789.%',
      });

      const readLabel = async (box: Box) =>
        (await labelWorker!.recognize(cropToCanvas(img, box))).data.text.trim();
      const readValue = async (box: Box) =>
        (await valueWorker!.recognize(cropToCanvas(img, box))).data.text.trim();

      const totalSteps = CARD_X.length * 12;
      let done = 0;
      const tick = () => setProgress(Math.round((++done / totalSteps) * 100));

      const echoes: Echo[] = [];
      const log: string[] = [];
      let found = 0;

      for (let i = 0; i < CARD_X.length; i++) {
        const cx = CARD_X[i];
        const cost = COSTS[i];
        setStatus(`Reading Echo ${i + 1} of 5`);

        // Main stat
        const mainLabel = await readLabel(mainLabelBox(cx)); tick();
        const mainValueText = await readValue(mainValueBox(cx)); tick();
        const mainPct = mainValueText.includes('%');
        let mainStat = matchStat(mainLabel, mainPct);
        if (mainStat && cost === 1) mainStat = toCost1Main(mainStat);
        if (mainStat) found++;
        log.push(`Echo ${i + 1} main: "${mainLabel}" | "${mainValueText}" -> ${mainStat}`);

        // Sub stats
        const subStats: SubStat[] = [];
        for (let r = 0; r < 5; r++) {
          const label = await readLabel(subLabelBox(cx, r)); tick();
          const valueText = await readValue(subValueBox(cx, r)); tick();
          const val = parseValue(valueText);
          const type = matchStat(label, val?.pct ?? false);
          log.push(`  sub ${r + 1}: "${label}" | "${valueText}" -> ${type} ${val?.value ?? '?'}`);
          if (type && val) {
            subStats.push({ type, value: val.value });
            found++;
          } else {
            subStats.push({ type: 'ATK%', value: 0 });
          }
        }

        const tpl = echoDatabase.find((t) => t.cost === cost);
        echoes.push({
          echoId: tpl?.id ?? 'unknown',
          cost,
          setId: tpl?.sonataSets[0] ?? '',
          mainStat: mainStat ?? (cost === 1 ? 'ATK' : 'Crit Rate'),
          flatAtk: cost === 4 ? 150 : cost === 3 ? 100 : undefined,
          subStats,
        });
      }

      console.log(log.join('\n'));
      console.log('Parsed echoes:', echoes);
      setDebug(log.join('\n'));

      if (found === 0) {
        setError('Could not read any stats. Make sure this is the original build image.');
        return;
      }
      onComplete(echoes);
    } catch (err: unknown) {
      console.error('Scan error:', err);
      setError(err instanceof Error ? err.message : 'Failed to scan. See console.');
    } finally {
      URL.revokeObjectURL(url);
      if (labelWorker) await labelWorker.terminate();
      if (valueWorker) await valueWorker.terminate();
      setIsScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/70">
          <h2 className="text-lg font-bold text-white">Auto-Import Build</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        <div className="p-8 flex flex-col items-center justify-center text-center gap-4">
          <h3 className="text-lg font-bold text-white">Upload Build Image</h3>
          <p className="text-sm text-slate-400 max-w-sm">
            Upload the full, uncropped image from the official Wuthering Waves build generator. The
            scanner finds the 5 Echo cards automatically.
          </p>

          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanning}
            className={`mt-4 px-6 py-3 rounded-md text-sm font-bold border transition-all w-full max-w-xs
              ${isScanning
                ? 'bg-slate-800 border-slate-700 text-slate-400 cursor-wait'
                : 'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-500'}`}
          >
            {isScanning ? 'Scanning...' : 'Select Image'}
          </button>

          {isScanning && (
            <div className="w-full max-w-xs">
              <div className="h-2 w-full rounded bg-slate-800 overflow-hidden">
                <div className="h-full bg-indigo-500 transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-2 text-xs text-slate-400">{status} ({progress}%)</p>
            </div>
          )}

          {error && <p className="text-sm text-red-400 mt-2 break-words w-full">{error}</p>}
          {debug && error && (
            <pre className="w-full max-h-40 overflow-auto text-left text-[10px] text-slate-500 bg-slate-950 p-2 rounded">
              {debug}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}