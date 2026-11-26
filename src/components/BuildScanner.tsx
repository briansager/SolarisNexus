import { useState, useRef } from 'react';
import { createWorker, PSM } from 'tesseract.js';
import type { Page } from 'tesseract.js';
import type { Echo, StatType, SubStat } from '../types';
import { echoDatabase } from '../echoData';

interface BuildScannerProps {
  onComplete: (echoes: Echo[]) => void;
  onClose: () => void;
}

const CROP_RATIO = 0.35; // bottom 35% of the image holds the 5 echoes
const TARGET_WIDTH = 2400;

const matchStat = (text: string): StatType | null => {
  const clean = text.toLowerCase().replace(/[^a-z0-9%]/g, '');
  if (clean.includes('critrate')) return 'Crit Rate';
  if (clean.includes('critdmg') || clean.includes('cdmg')) return 'Crit DMG';
  if (clean.includes('energyregen')) return 'Energy Regen';
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
  if (clean.includes('atk') && clean.includes('%')) return 'ATK%';
  if (clean.includes('atk')) return 'ATK';
  if (clean.includes('hp') && clean.includes('%')) return 'HP%';
  if (clean.includes('hp')) return 'HP';
  if (clean.includes('def') && clean.includes('%')) return 'DEF%';
  if (clean.includes('def')) return 'DEF';
  return null;
};

const extractNumber = (text: string): number => {
  const match = text.replace(/,/g, '').match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
};

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

export default function BuildScanner({ onComplete, onClose }: BuildScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [rawText, setRawText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseColumn = (lines: { text: string }[], expectedCost: 1 | 3 | 4): Echo => {
    let mainStat: StatType | undefined;
    let flatAtk: number | undefined;
    const subStats: SubStat[] = [];

    for (const line of lines) {
      const statType = matchStat(line.text);
      if (!statType) continue;
      const value = extractNumber(line.text);

      if (!mainStat) {
        mainStat = statType;
        continue;
      }
      // Flat base stats (HP ~2000+, base ATK 100/150)
      if (value > 1000) continue;
      if (expectedCost !== 1 && statType === 'ATK' && flatAtk === undefined && value >= 100) {
        flatAtk = value;
        continue;
      }
      if (subStats.length < 5 && !subStats.some((s) => s.type === statType)) {
        subStats.push({ type: statType, value });
      }
    }

    while (subStats.length < 5) subStats.push({ type: 'ATK%', value: 0 });

    // Try to match an echo name from this column's text, else fall back to first of that cost
    const colText = normalize(lines.map((l) => l.text).join(' '));
    const candidates = echoDatabase.filter((e) => e.cost === expectedCost);
    const nameMatch = candidates.find((e) => colText.includes(normalize(e.name)));
    const echoTpl = nameMatch ?? candidates[0];

    return {
      echoId: echoTpl?.id ?? 'unknown',
      cost: expectedCost,
      setId: echoTpl?.sonataSets[0] ?? '',
      mainStat: mainStat ?? (expectedCost === 1 ? 'ATK' : 'Crit Rate'),
      flatAtk: expectedCost !== 1 ? flatAtk ?? 100 : undefined,
      subStats,
    };
  };

  const parsePage = (data: Page, imageWidth: number): { echoes: Echo[]; found: number } => {
    const sliceWidth = imageWidth / 5;
    const columns: { text: string; y: number }[][] = [[], [], [], [], []];

    (data.lines ?? []).forEach((line) => {
      const midX = line.bbox.x0 + (line.bbox.x1 - line.bbox.x0) / 2;
      const col = Math.min(Math.max(Math.floor(midX / sliceWidth), 0), 4);
      columns[col].push({ text: line.text, y: line.bbox.y0 });
    });

    let found = 0;
    const echoes = columns.map((col, index) => {
      col.sort((a, b) => a.y - b.y);
      const cost: 1 | 3 | 4 = index === 0 ? 4 : index <= 2 ? 3 : 1;
      const echo = parseColumn(col, cost);
      found += echo.subStats.filter((s) => s.value > 0).length;
      return echo;
    });

    return { echoes, found };
  };

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

      // Grayscale + invert (dark UI -> dark text on light background)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imageData.data;
      for (let i = 0; i < d.length; i += 4) {
        const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
        const v = 255 - gray;
        d[i] = d[i + 1] = d[i + 2] = v;
      }
      ctx.putImageData(imageData, 0, 0);

      // Default CDN paths match the installed tesseract.js version
      worker = await createWorker('eng', 1, {
        logger: (m) => {
          setStatus(m.status);
          setProgress(Math.round(m.progress * 100));
        },
      });
      await worker.setParameters({ tessedit_pageseg_mode: PSM.SPARSE_TEXT });

      const { data } = await worker.recognize(canvas);
      console.log('OCR raw text:\n', data.text);
      setRawText(data.text);

      const { echoes, found } = parsePage(data, canvas.width);
      console.log('Parsed echoes:', echoes, 'substats found:', found);

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