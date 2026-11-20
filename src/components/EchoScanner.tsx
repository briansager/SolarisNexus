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
      // 1. Run OCR entirely in the browser
      const result = await Tesseract.recognize(file, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      const rawText = result.data.text;
      
      // 2. Parse the text
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
      // 3. Image is discarded from memory automatically by the browser
      setIsScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const parseEchoText = (text: string): Partial<Echo> | null => {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    
    let mainStat: StatType | undefined;
    let flatAtk: number | undefined;
    const subStats: SubStat[] = [];

    // Helper to find matching stat type from OCR text
    const matchStat = (line: string): StatType | null => {
      for (const stat of ALL_STATS) {
        // Remove spaces and % to make matching more forgiving for OCR errors
        const cleanStat = stat.replace(/\s|%/g, '').toLowerCase();
        const cleanLine = line.replace(/\s|%/g, '').toLowerCase();
        
        // Simple fuzzy match: if the line contains the stat name
        if (cleanLine.includes(cleanStat) || cleanLine.includes(cleanStat.replace('dmgbonus', ''))) {
          return stat;
        }
      }
      // Fallbacks for common OCR errors
      if (text.toLowerCase().includes('crit rate')) return 'Crit Rate';
      if (text.toLowerCase().includes('crit dmg')) return 'Crit DMG';
      return null;
    };

    // Helper to extract the number from a line
    const extractNumber = (line: string): number => {
      const match = line.match(/(\d+(?:\.\d+)?)/);
      return match ? parseFloat(match[1]) : 0;
    };

    // Parse lines
    lines.forEach((line, index) => {
      const statType = matchStat(line);
      if (!statType) return;

      const value = extractNumber(line);

      // In WuWa, the first stat is almost always the Main Stat
      if (index < 5 && !mainStat) {
        mainStat = statType;
      } else if (statType === 'ATK' && value > 50) {
        // Cost 3/4 echoes have a base flat ATK that is a higher number (usually 100-150)
        flatAtk = value;
      } else if (subStats.length < 5) {
        subStats.push({ type: statType, value });
      }
    });

    // If we couldn't find 5 substats, pad with blank ones
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