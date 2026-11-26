import { useState, useRef } from 'react';
import { createWorker, PSM } from 'tesseract.js';
import type { Page } from 'tesseract.js';
import type { Echo, StatType, SubStat } from '../types';
import { echoDatabase } from '../echoData';

interface BuildScannerProps {
  onComplete: (echoes: Echo[]) => void;
  onClose: () => void;
}

type OcrLine = Page['lines'][number];

const CROP_RATIO = 0.35;
const TARGET_WIDTH = 2400;
const COLUMN_COSTS: (1 | 3 | 4)[] = [4, 3, 3, 1, 1];

const startsWithPlus = (t: string) => /^\s*[+＋]/.test(t);

const matchStat = (text: string): StatType | null => {
  const clean = text.toLowerCase().replace(/[^a-z0-9%]/g, '');
  const pct = text.includes('%') || /\d\.\d/.test(text);
  if (clean.includes('critrate')) return 'Crit Rate';
  if (clean.includes('critdmg') || clean.includes('cdmg')) return 'Crit DMG';
  if (clean.includes('energyregen') || clean.startsWith('er')) return 'Energy Regen';
  if (clean.includes('healingbonus')) return 'Healing Bonus';
  if (clean.includes('aerodmg')) return 'Aero DMG Bonus';
  if (clean.includes('glaciodmg')) return 'Glacio DMG Bonus';
  if (clean.includes('fusiondmg')) return 'Fusion DMG Bonus';
  if (clean.includes('electrodmg')) return 'Electro DMG Bonus';
  if (clean.includes('spectrodmg')) return 'Spectro DMG Bonus';
  if (clean.includes('havocdmg')) return 'Havoc DMG Bonus';
  if (clean.includes('basicattack')) return 'Basic Attack DMG Bonus';
  if (clean.includes('heavyattack')) return 'Heavy Attack DMG Bonus';
  if (clean.includes('resonanceskill')) return 'Resonance Skill DMG Bonus';
  if (clean.includes('resonanceliberation')) return 'Resonance Liberation DMG Bonus';
  if (clean.includes('atk')) return pct ? 'ATK%' : 'ATK';
  if (clean.includes('hp')) return pct ? 'HP%' : 'HP';
  if (clean.includes('def')) return pct ? 'DEF%' : 'DEF';
  return null;
};

// last number on the row (ignores OCR junk before it)
const lastNumber = (text: string): number | null => {
  const m = [...text.replace(/,/g, '').matchAll(/\d+(?:\.\d+)?/g)];
  return m.length ? parseFloat(m[m.length - 1][0]) : null;
};

// Find the left edge of each of the 5 columns from the "+" sub-stat lines
const getColumnLefts = (lines: OcrLine[], width: number): number[] => {
  const xs = lines.filter((l) => startsWithPlus(l.text)).map((l) => l.bbox.x0).sort((a, b) => a - b);
  const lefts: number[] = [];
  xs.forEach((x, i) => {
    if (i === 0 || x - xs[i - 1] > width * 0.05) lefts.push(x);
  });
  if (lefts.length === 5) return lefts;
  return [0, 1, 2, 3, 4].map((i) => (i * width) / 5); // fallback
};

// Group a column's lines into rows by vertical position and join left to right
const buildRows = (lines: OcrLine[]): string[] => {
  const sorted = [...lines].sort((a, b) => a.bbox.y0 + a.bbox.y1 - (b.bbox.y0 + b.bbox.y1));
  const rows: OcrLine[][] = [];
  let rowCy = -Infinity;
  sorted.forEach((l) => {
    const cy = (l.bbox.y0 + l.bbox.y1) / 2;
    const h = l.bbox.y1 - l.bbox.y0;
    if (rows.length && Math.abs(cy - rowCy) < h * 0.6) {
      rows[rows.length - 1].push(l);
    } else {
      rows.push([l]);
      rowCy = cy;
    }
  });
  return rows.map((r) =>
    r.sort((a, b) => a.bbox.x0 - b.bbox.x0).map((l) => l.text.trim()).join(' ')
  );
};

const parseColumn = (rows: string[], cost: 1 | 3 | 4): Echo | null => {
  const firstPlus = rows.findIndex(startsWithPlus);
  if (firstPlus === -1) return null;

  // Header: main stat, then flat base stat
  let mainStat: StatType | undefined;
  let flatAtk: number | undefined;
  for (const row of rows.slice(0, firstPlus)) {
    const stat = matchStat(row);
    if (!stat) continue;
    if (!mainStat) {
      mainStat = stat;
    } else if (stat === 'ATK' && flatAtk === undefined) {
      flatAtk = lastNumber(row) ?? undefined;
      break;
    } else {
      break;
    }
  }

  // Sub stats: a row with a number starts one, a row without a number is a wrapped label
  const entries: string[] = [];
  for (const row of rows.slice(firstPlus)) {
    if (lastNumber(row) !== null) entries.push(row);
    else if (entries.length && /dmg|bonus/i.test(row)) entries[entries.length - 1] += ' ' + row;
  }

  const subStats: SubStat[] = [];
  for (const entry of entries) {
    const type = matchStat(entry);
    const value = lastNumber(entry);
    if (!type || value === null) continue;
    if (subStats.length < 5 && !subStats.some((s) => s.type === type)) {
      subStats.push({ type, value });
    }
  }
  while (subStats.length < 5) subStats.push({ type: 'ATK%', value: 0 });

  const tpl = echoDatabase.find((e) => e.cost === cost);
  return {
    echoId: tpl?.id ?? 'unknown',
    cost,
    setId: tpl?.sonataSets[0] ?? '',
    mainStat: mainStat ?? (cost === 1 ? 'ATK%' : 'Crit Rate'),
    flatAtk: cost !== 1 ? flatAtk ?? (cost === 4 ? 150 : 100) : undefined,
    subStats,
  };
};

const parsePage = (data: Page, width: number): { echoes: Echo[]; found: number } => {
  const lines = (data.lines ?? []).filter((l) => l.text.trim().length > 0);
  const lefts = getColumnLefts(lines, width);
  const spacing = (lefts[4] - lefts[0]) / 4 || width / 5;

  const columns: OcrLine[][] = [[], [], [], [], []];
  lines.forEach((l) => {
    let col = 0;
    for (let i = 0; i < 5; i++) if (l.bbox.x0 >= lefts[i] - spacing * 0.3) col = i;
    columns[col].push(l);
  });

  let found = 0;
  const echoes = columns.map((colLines, i) => {
    const rows = buildRows(colLines);
    console.log(`Column ${i} rows:`, rows);
    const echo = parseColumn(rows, COLUMN_COSTS[i]);
    if (echo) found += echo.subStats.filter((s) => s.value > 0).length;
    return (
      echo ?? {
        echoId: echoDatabase.find((e) => e.cost === COLUMN_COSTS[i])?.id ?? 'unknown',
        cost: COLUMN_COSTS[i],
        setId: '',
        mainStat: (COLUMN_COSTS[i] === 1 ? 'ATK%' : 'Crit Rate') as StatType,
        flatAtk: COLUMN_COSTS[i] !== 1 ? 100 : undefined,
        subStats: Array.from({ length: 5 }, () => ({ type: 'ATK%' as StatType, value: 0 })),
      }
    );
  });
  return { echoes, found };
};

export default function BuildScanner({ onComplete, onClose }: BuildScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [rawText, setRawText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setProgress(0);
    setStatus('Preparing image');
    setError(null);
    setRawText('');

    let worker: Awaited<ReturnType<typeof createWorker>> | null = null;
    const url = URL.createObjectURL(file);

    try {
      const img = new Image();
      img.src = url;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
      });

      const cropHeight = Math.floor(img.height * CROP_RATIO);
      const cropY = img.height - cropHeight;
      const scale = Math.min(2, TARGET_WIDTH / img.width);

      const canvas = document.createElement('canvas');
      canvas.width = Math.floor(img.width * scale);
      canvas.height = Math.floor(cropHeight * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not create canvas context');

      ctx.drawImage(img, 0, cropY, img.width, cropHeight, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imageData.data;
      for (let i = 0; i < d.length; i += 4) {
        const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
        d[i] = d[i + 1] = d[i + 2] = 255 - gray;
      }
      ctx.putImageData(imageData, 0, 0);

      worker = await createWorker('eng', 1, {
        logger: (m) => {
          setStatus(m.status);
          setProgress(Math.round(m.progress * 100));
        },
      });
      await worker.setParameters({ tessedit_pageseg_mode: PSM.SPARSE_TEXT });

      const { data } = await worker.recognize(canvas);
      setRawText(data.text);

      const { echoes, found } = parsePage(data, canvas.width);
      console.log('Parsed echoes:', echoes);

      if (found === 0) {
        setError('Could not read any sub-stats. Check the raw text below or try a clearer screenshot.');
        return;
      }
      onComplete(echoes);
    } catch (err: unknown) {
      console.error('Scan error:', err);
      setError(`Failed to scan: ${err instanceof Error ? err.message : 'see console'}`);
    } finally {
      URL.revokeObjectURL(url);
      if (worker) await worker.terminate();
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
            Upload the official Wuthering Waves build generator image. The scanner crops the bottom
            section and reads all 5 Echoes.
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
              <p className="mt-2 text-xs text-slate-400 capitalize">{status} {progress}%</p>
            </div>
          )}

          {error && <p className="text-sm text-red-400 mt-2 break-words w-full">{error}</p>}
          {rawText && error && (
            <pre className="w-full max-h-40 overflow-auto text-left text-[10px] text-slate-500 bg-slate-950 p-2 rounded">
              {rawText}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}