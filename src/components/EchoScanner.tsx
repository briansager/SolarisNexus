// src/components/EchoScanner.tsx
import { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import type { Echo, StatType, SubStat } from '../types';

interface EchoScannerProps {
  onScanComplete: (scannedEcho: Partial<Echo>) => void;
}

export default function EchoScanner({ onScanComplete }: EchoScannerProps) {
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

      const rawText = result.data.text;
      const parsedData = parseEchoText(rawText);
      
      if (parsedData && parsedData.mainStat) {
        onScanComplete(parsedData);
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

  const parseEchoText = (text: string): Partial<Echo> | null => {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    
    let mainStat: StatType | undefined;
    let flatAtk: number | undefined;
    const subStats: SubStat[] = [];

    const matchStat = (line: string): StatType | null => {
      // Normalize line: lowercase, remove extra spaces, keep dots and %
      const cleanLine = line.toLowerCase().replace(/\s+/g, '');
      
      // Crit stats
      if (cleanLine.includes('critrate') || cleanLine.includes('crrate')) return 'Crit Rate';
      if (cleanLine.includes('critdmg') || cleanLine.includes('cdmg')) return 'Crit DMG';
      
      // Energy / Healing
      if (cleanLine.includes('energyregen')) return 'Energy Regen';
      if (cleanLine.includes('healingbonus')) return 'Healing Bonus';
      
      // Elemental DMG
      if (cleanLine.includes('aerodmg')) return 'Aero DMG Bonus';
      if (cleanLine.includes('glaciodmg')) return 'Glacio DMG Bonus';
      if (cleanLine.includes('fusiondmg')) return 'Fusion DMG Bonus';
      if (cleanLine.includes('electrodmg')) return 'Electro DMG Bonus';
      if (cleanLine.includes('spectrodmg')) return 'Spectro DMG Bonus';
      if (cleanLine.includes('havocdmg')) return 'Havoc DMG Bonus';

      // Attack types
      if (cleanLine.includes('basicattack')) return 'Basic Attack DMG Bonus';
      if (cleanLine.includes('heavyattack')) return 'Heavy Attack DMG Bonus';
      if (cleanLine.includes('resonanceskill')) return 'Resonance Skill DMG Bonus';
      if (cleanLine.includes('resonanceliberation')) return 'Resonance Liberation DMG Bonus';

      // Flat and % stats
      if (cleanLine.includes('atk') && cleanLine.includes('%')) return 'ATK%';
      if (cleanLine.includes('atk')) return 'ATK';
      if (cleanLine.includes('hp') && cleanLine.includes('%')) return 'HP%';
      if (cleanLine.includes('hp')) return 'HP';
      if (cleanLine.includes('def') && cleanLine.includes('%')) return 'DEF%';
      if (cleanLine.includes('def')) return 'DEF';

      return null;
    };

    const extractNumber = (line: string): number => {
      // Match the first number, handles decimals
      const match = line.match(/(\d+(?:\.\d+)?)/);
      return match ? parseFloat(match[1]) : 0;
    };

    // --- Parser Logic ---
    // The Wuthering Waves Echo UI flows top-to-bottom, then left-to-right.
    // Tesseract reads left-to-right, top-to-bottom.
    // Structure:
    // [Main Stat Label] (e.g., Crit. DMG) [Value] (e.g., 44%)
    // [Base Stat Label] (e.g., ATK) [Value]
    // [Sub-stat 1 Label] [Value]
    // ...
    
    let foundMainStat = false;
    let foundBaseStats = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const statType = matchStat(line);
      if (!statType) continue;

      const value = extractNumber(line);

      // 1. Look for Main Stat (First valid stat encountered)
      if (!foundMainStat) {
        // Ensure we aren't grabbing the character's level or UID
        if (value > 0 && value < 1000) {
          mainStat = statType;
          foundMainStat = true;
          continue;
        }
      }

      // 2. Look for Base Stats (ATK or HP) right after Main Stat
      if (foundMainStat && !foundBaseStats) {
        if (statType === 'ATK' || statType === 'HP') {
          if (statType === 'ATK') flatAtk = value;
          foundBaseStats = true;
          continue;
        }
      }

      // 3. Collect Sub-stats
      if (foundMainStat) {
        // Skip duplicates or values that are clearly base stats (> 1000)
        if (statType === 'ATK' && value > 150) continue;
        
        const isDuplicate = subStats.some(s => s.type === statType);
        if (!isDuplicate && subStats.length < 5) {
          subStats.push({ type: statType, value });
        }
      }
    }

    // Fill empty sub-stats to satisfy the Echo type (5 max)
    while (subStats.length < 5) {
      subStats.push({ type: 'ATK%', value: 0 });
    }

    return {
      mainStat: mainStat || 'ATK',
      flatAtk,
      subStats
    };
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageUpload}
        className="hidden"
      />
      
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isScanning}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold border transition-all
          ${isScanning 
            ? 'bg-slate-700 border-slate-600 text-slate-400 cursor-wait' 
            : 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300 hover:bg-indigo-600 hover:text-white'}`}
      >
        {isScanning ? (
          <>
            <svg className="animate-spin h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Scanning ({progress}%)
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            Scan Image
          </>
        )}
      </button>

      {error && <span className="text-xs text-red-400 ml-2">{error}</span>}
    </div>
  );
}