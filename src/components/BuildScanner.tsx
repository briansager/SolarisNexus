import { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import type { Echo, StatType, SubStat } from '../types';
import { echoDatabase } from '../echoData';

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
      console.log("Starting image processing...");
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error("Failed to load image"));
      });

      // 1. Setup Canvas for Cropping & Color Inversion
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Could not create canvas context");

      // Crop the bottom 30% of the image (where the echoes are)
      const cropHeight = Math.floor(img.height * 0.30);
      const cropY = img.height - cropHeight;
      
      // Scale down the image by 50% to save memory and speed up OCR
      const scale = 0.5;
      canvas.width = img.width * scale;
      canvas.height = cropHeight * scale;

      // Draw and scale the cropped portion onto the canvas
      ctx.drawImage(img, 0, cropY, img.width, cropHeight, 0, 0, canvas.width, canvas.height);

      // 2. Invert colors to make background white and text black
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];       // Red
        data[i + 1] = 255 - data[i + 1]; // Green
        data[i + 2] = 255 - data[i + 2]; // Blue
      }
      ctx.putImageData(imageData, 0, 0);

      // 3. Get Base64 Data URL (more reliable than Blob for Tesseract)
      const processedImage = canvas.toDataURL('image/png');
      console.log("Image processed, starting Tesseract...");

      // 4. Run OCR with explicit CDN paths (fixes Vercel bundling issues)
      const result = await Tesseract.recognize(processedImage, 'eng', {
        workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@5.0.0/dist/worker.min.js',
        corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@5.0.0',
        langPath: 'https://tessdata.projectnaptha.com/4.0.0',
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      console.log("OCR Complete. Parsing data...");
      // 5. Parse the spatial data (using the scaled width)
      const parsedEchoes = parseSpatialData(result.data, canvas.width);
      
      if (parsedEchoes.length > 0) {
        onComplete(parsedEchoes);
      } else {
        setError("Could not detect Echo stats. Try a clearer screenshot.");
      }

    } catch (err: any) {
      console.error("Tesseract Error Details:", err);
      setError(`Failed to scan: ${err.message || 'Check browser console for details.'}`);
    } finally {
      setIsScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const parseSpatialData = (data: Tesseract.Page, imageWidth: number): Echo[] => {
    if (!data.words) return [];

    const sliceWidth = imageWidth / 5;
    const columns: string[][] = [[], [], [], [], []];

    // Group words into 5 columns based on their X coordinate
    data.words.forEach((word) => {
      const midX = word.bbox.x0 + (word.bbox.x1 - word.bbox.x0) / 2;
      const colIndex = Math.min(Math.floor(midX / sliceWidth), 4);
      columns[colIndex].push(word.text);
    });

    return columns.map((words, index) => {
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

    const fullText = words.join(' ');
    const lines = fullText.split(/(?=[A-Z])|(?<=[a-z])(?=[A-Z])|[\n\r]+/); 

    let foundMainStat = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const statType = matchStat(line);
      if (!statType) continue;
      
      const value = extractNumber(line);

      if (!foundMainStat) {
        if (value > 1000) continue; 
        mainStat = statType;
        foundMainStat = true;
        continue;
      }

      if (expectedCost !== 1 && statType === 'ATK' && !flatAtk) {
        flatAtk = value;
        continue;
      }

      if (subStats.length < 5 && !subStats.some(s => s.type === statType)) {
        subStats.push({ type: statType, value });
      }
    }

    if (!mainStat) mainStat = expectedCost === 1 ? 'ATK' : 'Crit Rate';
    while (subStats.length < 5) subStats.push({ type: 'ATK%', value: 0 });

    const possibleEchoes = echoDatabase.filter(e => e.cost === expectedCost);
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
            Upload the official Wuthering Waves build generator image. The scanner will automatically crop and detect all 5 Echoes.
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
          
          {error && <p className="text-sm text-red-400 mt-2 break-words w-full">{error}</p>}
        </div>

      </div>
    </div>
  );
}