import { useState } from 'react';
import { charactersData } from './data';
import { calculateBuildScore, getActiveSonataSets } from './scoring';
import type { Echo } from './types';
import shorekeeperIcon from './assets/shorekeeper-icon.png'; 
import { sonataData } from './sonataData';
import { echoDatabase } from './echoData'; // <-- Added this import
import EchoCard from './components/EchoCard';

// Initial 5-Echo setup (4-3-3-1-1)
const initialEchoes: Echo[] = [
  { echoId: 'mourning-aix', cost: 4, setId: 'celestial-light', mainStat: 'Crit Rate', subStats: [{ type: 'Energy Regen', value: 0 }, { type: 'HP%', value: 0 }, { type: 'Crit DMG', value: 0 }] },
  { echoId: 'abyssal-mercator', cost: 3, setId: 'eternal-radiance', mainStat: 'Spectro DMG Bonus', subStats: [{ type: 'Energy Regen', value: 0 }, { type: 'HP%', value: 0 }, { type: 'Crit DMG', value: 0 }] },
  { echoId: 'diurnus-knight', cost: 3, setId: 'eternal-radiance', mainStat: 'Spectro DMG Bonus', subStats: [{ type: 'Energy Regen', value: 0 }, { type: 'HP%', value: 0 }, { type: 'Crit DMG', value: 0 }] },
  { echoId: 'cruisewing', cost: 1, setId: 'rejuvenating-glow', mainStat: 'ATK%', subStats: [{ type: 'Energy Regen', value: 0 }, { type: 'HP%', value: 0 }, { type: 'Crit DMG', value: 0 }] },
  { echoId: 'fission-junrock', cost: 1, setId: 'rejuvenating-glow', mainStat: 'ATK%', subStats: [{ type: 'Energy Regen', value: 0 }, { type: 'HP%', value: 0 }, { type: 'Crit DMG', value: 0 }] }
];

function App() {
  const [echoes, setEchoes] = useState<Echo[]>(initialEchoes);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const shorekeeper = charactersData[0];
  const totalScore = calculateBuildScore(echoes, shorekeeper.weights);
  const activeSets = getActiveSonataSets(echoes);

  const handleEchoChange = (index: number, newEcho: Echo) => {
    const newEchoes = [...echoes];
    newEchoes[index] = newEcho;
    setEchoes(newEchoes);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-4 md:p-6 font-sans selection:bg-indigo-500/30">
      
      {/* Top Header */}
      <header className="mb-6 flex flex-col md:flex-row justify-between items-center border-b border-slate-700/50 pb-4">
        <div className="flex items-center gap-4">
          <img src={shorekeeperIcon} alt="Shorekeeper" className="w-12 h-12 object-cover rounded-full border-2 border-slate-600 bg-slate-800" />
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">{shorekeeper.name}</h1>
            <p className="text-xs text-slate-400">{shorekeeper.element} • WuWa Build Tracker</p>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0 bg-slate-800 px-6 py-2 rounded-full border border-slate-700 flex items-center gap-4">
          <span className="text-sm text-slate-400">Total Score</span>
          <span className="text-2xl font-bold text-green-400">{totalScore.toFixed(2)}</span>
        </div>
      </header>

      {/* Main Layout Grid */}
      <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Sidebar - Echo Slots */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-2">Equipped Echoes</h2>
          
          {echoes.map((echo, index) => {
            const echoData = echoDatabase.find(e => e.id === echo.echoId);
            const isSelected = selectedIndex === index;
            return (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`flex items-center gap-4 p-3 rounded-lg border transition-all text-left
                  ${isSelected 
                    ? 'bg-indigo-900/40 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                    : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800'
                  }`}
              >
                <div className={`w-12 h-12 rounded flex items-center justify-center font-bold text-lg border
                  ${echo.cost === 4 ? 'bg-amber-900/30 border-amber-500/50 text-amber-200' : 
                    echo.cost === 3 ? 'bg-blue-900/30 border-blue-500/50 text-blue-200' : 
                    'bg-emerald-900/30 border-emerald-500/50 text-emerald-200'}`}
                >
                  {echo.cost}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className={`text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {echoData?.name || 'Unknown Echo'}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{echo.mainStat}</p>
                </div>
              </button>
            );
          })}

          {/* Active Sets Panel */}
          <div className="mt-4 p-4 rounded-lg bg-slate-800/30 border border-slate-700/30">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Active Sonata Sets</h3>
            <div className="flex flex-col gap-2">
              {activeSets.map(set => {
                const setData = sonataData.find(s => s.id === set.setId);
                return (
                  <div key={set.setId} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                    <span className="text-sm text-indigo-200">{setData?.name || set.setId}</span>
                    <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded ml-auto">{set.pieces}-pc</span>
                  </div>
                );
              })}
              {activeSets.length === 0 && (
                <span className="text-xs text-slate-500 italic">No active set bonuses</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Detail Panel - EchoCard */}
        <div className="lg:col-span-8">
          <EchoCard 
            echo={echoes[selectedIndex]} 
            index={selectedIndex} 
            onChange={handleEchoChange} 
          />
        </div>
      </main>
    </div>
  );
}

export default App;