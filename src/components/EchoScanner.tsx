import { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import type { Echo, StatType, SubStat } from '../types';

const ALL_STATS: StatType[] = [
  'ATK', 'ATK%', 'HP', 'HP%', 'DEF', 'DEF%',
  'Crit Rate', 'Crit DMG', 'Energy Regen', 'Healing Bonus',
  'Aero DMG Bonus', 'Glacio DMG Bonus', 'Fusion DMG Bonus', 'Electro DMG Bonus', 'Spectro DMG Bonus', 'Havoc DMG Bonus',
  'Basic Attack DMG Bonus', 'Heavy Attack DMG Bonus', 'Resonance Skill DMG Bonus', 'Resonance Liberation DMG Bonus'
];

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
        workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@v5.0.0/dist/worker.min.js',
        corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@v5.0.0',
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
    // Split into lines and clean up empty ones
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    
    let mainStat: StatType | undefined;
    let flatAtk: number | undefined;
    const subStats: SubStat[] = [];

    // Helper to find matching stat type, ignoring punctuation and spaces
    const matchStat = (line: string): StatType | null => {
      const cleanLine = line.toLowerCase().replace(/[^a-z0-9]/g, ''); 
      
      // Check for specific matches first so "Crit Rate" doesn't accidentally match "Crit DMG"
      if (cleanLine.includes('critrate') || cleanLine.includes('crrate')) return 'Crit Rate';
      if (cleanLine.includes('critdmg') || cleanLine.includes('critdmg')) return 'Crit DMG';
      if (cleanLine.includes('energyregen')) return 'Energy Regen';
      if (cleanLine.includes('healingbonus')) return 'Healing Bonus';
      
      // Check element DMGs
      if (cleanLine.includes('aerodmg')) return 'Aero DMG Bonus';
      if (cleanLine.includes('glaciodmg')) return 'Glacio DMG Bonus';
      if (cleanLine.includes('fusiondmg')) return 'Fusion DMG Bonus';
      if (cleanLine.includes('electrodmg')) return 'Electro DMG Bonus';
      if (cleanLine.includes('spectrodmg')) return 'Spectro DMG Bonus';
      if (cleanLine.includes('havocdmg')) return 'Havoc DMG Bonus';

      // Check attack types
      if (cleanLine.includes('basicattack')) return 'Basic Attack DMG Bonus';
      if (cleanLine.includes('heavyattack')) return 'Heavy Attack DMG Bonus';
      if (cleanLine.includes('resonanceskill')) return 'Resonance Skill DMG Bonus';
      if (cleanLine.includes('resonanceliberation')) return 'Resonance Liberation DMG Bonus';

      // Check base stats (make sure ATK doesn't match ATK% if possible)
      if (cleanLine.includes('atk') && cleanLine.includes('%')) return 'ATK%';
      if (cleanLine.includes('atk')) return 'ATK';
      if (cleanLine.includes('hp') && cleanLine.includes('%')) return 'HP%';
      if (cleanLine.includes('hp')) return 'HP';
      if (cleanLine.includes('def') && cleanLine.includes('%')) return 'DEF%';
      if (cleanLine.includes('def')) return 'DEF';

      return null;
    };

    // Helper to extract the first float/number found in a string
    const extractNumber = (line: string): number => {
      const match = line.match(/(\d+(?:\.\d+)?)/);
      return match ? parseFloat(match[1]) : 0;
    };

    // State machine to process lines based on what we've seen
    let foundBaseAtk = false;
    let inSubStatsSection = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const statType = matchStat(line);

      if (!statType) continue;

      const value = extractNumber(line);

      // 1. Check if this is the Main Stat (very first stat we find at the top)
      if (!mainStat && !inSubStatsSection) {
        mainStat = statType;
        continue;
      }

      // 2. Check if this is Base ATK (Usually appears right after the Main Stat, and is exactly "ATK")
      if (mainStat && !foundBaseAtk && statType === 'ATK') {
        flatAtk = value;
        foundBaseAtk = true;
        continue;
      }

      // 3. Everything else below the base ATK is a Sub-stat
      if (foundBaseAtk || (mainStat && !foundBaseAtk)) {
        inSubStatsSection = true;
      }

      // If we are in the substat section, start collecting
      if (inSubStatsSection && subStats.length < 5) {
        // Avoid grabbing the Base ATK again if OCR duplicated it
        if (statType === 'ATK' && value > 100) continue; 
        
        // Ensure we don't grab the exact same line twice
        const isDuplicate = subStats.some(s => s.type === statType && s.value === value);
        if (!isDuplicate) {
          subStats.push({ type: statType, value });
        }
      }
    }

    // Pad with blank ones if OCR missed any (e.g. only found 4)
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