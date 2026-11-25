// src/components/BuildScanner.tsx
import { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import type { Echo, StatType, SubStat } from '../types';
import { echoDatabase } from '../echoData'; // We need this to guess the Echo ID based on Main Stat/Cost

interface BuildScannerProps {
  onComplete: (echoes: Echo[]) => void;
  onClose: () => void;
}

export default function BuildScanner({ onComplete, onClose }: BuildScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setProgress(0);
    setError(null);

    try {
      // 1. Get image dimensions to help calculate the 5 vertical slices
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise((resolve) => { img.onload = resolve; });
      const imageWidth = img.width;

      // 2. Run OCR and request word-level bounding boxes
      const result = await Tesseract.recognize(file, 'eng', {
        workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@5.0.0/dist/worker.min.js',
        corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@5.0.0',
        langPath: 'https://tessdata.projectnaptha.com/4.0.0',
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      // 3. Parse the spatial data
      const parsedEchoes = parseSpatialData(result.data, imageWidth);
      
      if (parsedEchoes.length > 0) {
        onComplete(parsedEchoes);
      } else {
        setError("Could not detect Echo stats. Try a clearer screenshot.");
      }

    } catch (err) {
      console.error(err);
      setError("Failed to scan image.");
    } finally {
      setIsScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const parseSpatialData = (data: Tesseract.Page, imageWidth: number): Echo[] => {
    const sliceWidth = imageWidth / 5;
    const columns: string[][] = [[], [], [], [], []];

    // Group words into 5 columns based on their X coordinate
    data.words.forEach((word) => {
      const midX = word.bbox.x0 + (word.bbox.x1 - word.bbox.x0) / 2;
      const colIndex = Math.min(Math.floor(midX / sliceWidth), 4);
      columns[colIndex].push(word.text);
    });

    // Convert the columns into standard Echo objects
    return columns.map((words, index) => {
      // The official layout is Cost 4, Cost 3, Cost 3, Cost 1, Cost 1
      // So we hardcode the expected cost based on the slot index
      let expectedCost: 1 | 3 | 4 = 1;
      if (index === 0) expectedCost = 4;
      if (index === 1 || index === 2) expectedCost = 3;

      return parseEchoWords(words, expectedCost);
    });
  };

  const parseEchoWords = (words: string[], expectedCost: 1 | 3 | 4): Echo => {
    let mainStat: StatType | undefined;
    let flatAtk: number | undefined;
    const subStats: SubStat[] = [];

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
      const match = text.match(/(\d+(?:\.\d+)?)/);
      return match ? parseFloat(match[1]) : 0;
    };

    // Tesseract words usually come in order of X/Y, but sometimes break up "Crit. DMG"
    // We join them all into a single string and use Regex to find patterns
    const fullText = words.join(' ');
    const lines = fullText.split(/(?=[A-Z])|(?<=[a-z])(?=[A-Z])/); // rough split by capitals

    let foundMainStat = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const statType = matchStat(line);
      if (!statType) continue;
      
      const value = extractNumber(line);

      if (!foundMainStat) {
        mainStat = statType;
        foundMainStat = true;
        continue;
      }

      // Look for base ATK (only for cost 3/4, usually value > 100)
      if (expectedCost !== 1 && statType === 'ATK' && !flatAtk) {
        flatAtk = value;
        continue;
      }

      // Sub-stats
      if (subStats.length < 5 && !subStats.some(s => s.type === statType)) {
        subStats.push({ type: statType, value });
      }
    }

    // Fallbacks if OCR failed
    if (!mainStat) mainStat = expectedCost === 1 ? 'ATK' : 'Crit Rate';
    while (subStats.length < 5) subStats.push({ type: 'ATK%', value: 0 });

    // Try to find a matching Echo ID from our database based on cost & main stat
    const possibleEchoes = echoDatabase.filter(e => e.cost === expectedCost);
    // Just grab the first one as a placeholder, the user can correct it in the UI
    const bestGuessEcho = possibleEchoes[0] || { id: 'unknown', sonataSets: [] };

    return {
      echoId: bestGuessEcho.id,
      cost: expectedCost,
      setId: bestGuessEcho.sonataSets[0] || '',
      mainStat,
      flatAtk: expectedCost !== 1 ? (flatAtk || 100) : undefined,
      subStats,
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/70">
          <h2 className="text-lg font-bold text-white">Auto-Import Build</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        <div className="p-8 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-indigo-900/50 flex items-center justify-center mb-2">
            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white">Upload Build Image</h3>
          <p className="text-sm text-slate-400 max-w-sm">
            Upload the official Wuthering Waves build generator image. The scanner will automatically detect all 5 Echoes and their stats.
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
            {isScanning ? `Scanning... (${progress}%)` : 'Select Image'}
          </button>
          
          {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
        </div>

      </div>
    </div>
  );
}