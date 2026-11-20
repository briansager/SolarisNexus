import { useState } from 'react';
import { charactersData } from './data';
import { calculateBuildScore, getActiveSonataSets } from './scoring';
import type { Echo } from './types';
import shorekeeperIcon from './assets/shorekeeper-icon.png'; 
import { sonataData } from './sonataData';
import EchoCard from './components/EchoCard';

// Initial 5-Echo setup (4-3-3-1-1)
const initialEchoes: Echo[] = [
  {
    echoId: 'mourning-aix', cost: 4, setId: 'celestial-light', mainStat: 'Crit Rate',
    subStats: [{ type: 'Energy Regen', value: 0 }, { type: 'HP%', value: 0 }, { type: 'Crit DMG', value: 0 }]
  },
  {
    echoId: 'abyssal-mercator', cost: 3, setId: 'eternal-radiance', mainStat: 'Spectro DMG Bonus',
    subStats: [{ type: 'Energy Regen', value: 0 }, { type: 'HP%', value: 0 }, { type: 'Crit DMG', value: 0 }]
  },
  {
    echoId: 'diurnus-knight', cost: 3, setId: 'eternal-radiance', mainStat: 'Spectro DMG Bonus',
    subStats: [{ type: 'Energy Regen', value: 0 }, { type: 'HP%', value: 0 }, { type: 'Crit DMG', value: 0 }]
  },
  {
    echoId: 'cruisewing', cost: 1, setId: 'rejuvenating-glow', mainStat: 'ATK%',
    subStats: [{ type: 'Energy Regen', value: 0 }, { type: 'HP%', value: 0 }, { type: 'Crit DMG', value: 0 }]
  },
  {
    echoId: 'fission-junrock', cost: 1, setId: 'rejuvenating-glow', mainStat: 'ATK%',
    subStats: [{ type: 'Energy Regen', value: 0 }, { type: 'HP%', value: 0 }, { type: 'Crit DMG', value: 0 }]
  }
];

function App() {
  const [echoes, setEchoes] = useState<Echo[]>(initialEchoes);

  const shorekeeper = charactersData[0];
  const totalScore = calculateBuildScore(echoes, shorekeeper.weights);
  const activeSets = getActiveSonataSets(echoes);

  const handleEchoChange = (index: number, newEcho: Echo) => {
    const newEchoes = [...echoes];
    newEchoes[index] = newEcho;
    setEchoes(newEchoes);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-4 md:p-8 font-sans">
      <header className="mb-6 md:mb-8 border-b border-slate-700 pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">WuWa Build Tracker</h1>
      </header>

      <main className="max-w-3xl mx-auto space-y-6">
        
        {/* Character Info Header */}
        <div className="bg-slate-800 p-4 md:p-6 rounded-lg border border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-lg sticky top-4 z-10">
          <div className="flex items-center gap-4">
            <img 
              src={shorekeeperIcon} 
              alt="Shorekeeper" 
              className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-full border-2 border-indigo-500 bg-slate-900"
            />
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white">{shorekeeper.name}</h2>
              <p className="text-sm text-indigo-400">{shorekeeper.element}</p>
              
              {/* Active Sonata Sets */}
              <div className="flex gap-2 mt-2 flex-wrap">
                {activeSets.map(set => {
                  const setData = sonataData.find(s => s.id === set.setId);
                  return (
                    <span key={set.setId} className="text-xs bg-indigo-900/50 text-indigo-200 px-2 py-1 rounded border border-indigo-700/50">
                      {setData?.name || set.setId} ({set.pieces}-pc)
                    </span>
                  );
                })}
                {activeSets.length === 0 && (
                  <span className="text-xs text-slate-500 italic">No active set bonuses (needs 2+ pieces)</span>
                )}
              </div>
            </div>
          </div>
          <div className="md:text-right w-full md:w-auto bg-slate-900/50 p-3 rounded-lg md:bg-transparent md:p-0">
            <p className="text-xs md:text-sm text-slate-400">Total Build Score</p>
            <p className="text-3xl md:text-4xl font-bold text-green-400">{totalScore.toFixed(2)}</p>
          </div>
        </div>

        {/* Render the 5 Echoes */}
        <div className="space-y-6 pb-12">
          {echoes.map((echo, index) => (
            <EchoCard 
              key={index} 
              echo={echo} 
              index={index} 
              onChange={handleEchoChange} 
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;