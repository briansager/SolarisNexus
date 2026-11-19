import { useState } from 'react';
import { charactersData } from './data';
import { calculateEchoScore } from './scoring';
import type { Echo } from './types';
// Import the image here
import shorekeeperImg from './assets/shorekeeper.png'; 

function App() {
  const [echo, setEcho] = useState<Echo>({
    cost: 1,
    mainStat: 'ATK',
    subStats: [
      { type: 'Energy Regen', value: 10.8 },
      { type: 'HP%', value: 8.6 },
      { type: 'Crit DMG', value: 12.6 },
    ]
  });

  const shorekeeper = charactersData[0];
  const currentScore = calculateEchoScore(echo, shorekeeper.weights);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-8 font-sans">
      <header className="mb-8 border-b border-slate-700 pb-4">
        <h1 className="text-3xl font-bold text-white tracking-wide">WuWa Build Tracker</h1>
      </header>

      <main className="max-w-2xl mx-auto space-y-6">
        {/* Character Info */}
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex justify-between items-center shadow-lg">
          <div className="flex items-center gap-4">
            {/* Added the image here */}
            <img 
              src={shorekeeperImg} 
              alt="Shorekeeper" 
              className="w-20 h-20 object-cover object-top rounded-full border-2 border-indigo-500 bg-slate-900"
            />
            <div>
              <h2 className="text-xl font-bold text-white">{shorekeeper.name}</h2>
              <p className="text-sm text-indigo-400">{shorekeeper.element}</p>
            </div>
          </div>
          <div className="text-right pr-2">
            <p className="text-sm text-slate-400">Echo Score</p>
            <p className="text-3xl font-bold text-green-400">{currentScore.toFixed(2)}</p>
          </div>
        </div>

        {/* Echo Card (Read-only for now) */}
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <span className="bg-amber-900 text-amber-200 px-3 py-1 rounded text-sm font-bold">
              Cost {echo.cost}
            </span>
            <span className="font-bold text-white text-lg">{echo.mainStat}</span>
          </div>
          
          <div className="space-y-2">
            {echo.subStats.map((stat, i) => (
              <div key={i} className="flex justify-between text-sm bg-slate-700/50 p-2 rounded">
                <span className="text-slate-300">{stat.type}</span>
                <span className="font-mono text-white">{stat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;