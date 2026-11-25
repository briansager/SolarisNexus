// src/components/BuildScanner.tsx
import { useState } from 'react';
import type { Echo } from '../types';
import EchoScanner from './EchoScanner';

interface BuildScannerProps {
  onComplete: (echoes: Echo[]) => void;
  onClose: () => void;
}

export default function BuildScanner({ onComplete, onClose }: BuildScannerProps) {
  // We maintain a local state for the 5 echoes being scanned
  const [scannedEchoes, setScannedEchoes] = useState<Partial<Echo>[]>([
    { cost: 4 }, { cost: 3 }, { cost: 3 }, { cost: 1 }, { cost: 1 }
  ]);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScanUpdate = (index: number, data: Partial<Echo>) => {
    const updated = [...scannedEchoes];
    updated[index] = { ...updated[index], ...data };
    setScannedEchoes(updated);
    // Auto-advance to next empty slot
    if (index < 4) setActiveIndex(index + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/70">
          <h2 className="text-lg font-bold text-white">Import Build</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          <p className="text-sm text-slate-300">
            Upload the official Wuthering Waves build image. We'll scan it and let you review each Echo slot.
            <br />
            <span className="text-xs text-slate-500 italic">(Tip: Crop the image to the specific Echo you want to scan for the best results).</span>
          </p>

          <div className="grid grid-cols-5 gap-2">
            {scannedEchoes.map((echo, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`p-2 rounded-lg border flex flex-col items-center gap-1 transition-colors ${
                  activeIndex === i 
                    ? 'border-indigo-500 bg-indigo-900/30' 
                    : 'border-slate-700 bg-slate-800 hover:border-slate-500'
                }`}
              >
                <span className="text-xs font-bold text-slate-400">Slot {i + 1}</span>
                <span className={`text-xs font-mono ${echo.mainStat ? 'text-green-400' : 'text-slate-600'}`}>
                  {echo.mainStat ? '✓ Scanned' : 'Empty'}
                </span>
              </button>
            ))}
          </div>

          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 flex flex-col items-center justify-center min-h-[120px]">
             <p className="text-sm text-slate-300 mb-4">Scanning Slot {activeIndex + 1}</p>
             <EchoScanner 
                onScanComplete={(data) => handleScanUpdate(activeIndex, data)} 
             />
          </div>
        </div>

        <div className="px-5 py-4 border-t border-slate-700/70 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-300 hover:text-white">
            Cancel
          </button>
          <button 
            onClick={() => onComplete(scannedEchoes as Echo[])}
            disabled={!scannedEchoes[0].mainStat} // Basic check
            className="px-4 py-2 text-sm font-bold bg-indigo-600 text-white rounded-md hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Build
          </button>
        </div>
      </div>
    </div>
  );
}