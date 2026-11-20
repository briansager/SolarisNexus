import { useState } from 'react';
import { charactersData } from './data';
import { calculateEchoScore } from './scoring';
import type { Echo, StatType, SubStat } from './types';
import shorekeeperIcon from './assets/shorekeeper-icon.png'; 
import { sonataData } from './sonataData';
import { echoDatabase } from './echoData';

// A list of all stats for the dropdowns
const ALL_STATS: StatType[] = [
  'ATK', 'ATK%', 'HP', 'HP%', 'DEF', 'DEF%',
  'Crit Rate', 'Crit DMG', 'Energy Regen', 'Healing Bonus',
  'Aero DMG Bonus', 'Glacio DMG Bonus', 'Fusion DMG Bonus', 'Electro DMG Bonus', 'Spectro DMG Bonus', 'Havoc DMG Bonus',
  'Basic Attack DMG Bonus', 'Heavy Attack DMG Bonus', 'Resonance Skill DMG Bonus', 'Resonance Liberation DMG Bonus'
];

function App() {
  const [echo, setEcho] = useState<Echo>({
    echoId: 'cruisewing', // Default Echo
    cost: 1,
    setId: 'rejuvenating-glow',
    mainStat: 'ATK',
    subStats: [
      { type: 'Energy Regen', value: 0 },
      { type: 'HP%', value: 0 },
      { type: 'Crit DMG', value: 0 },
    ]
  });

  const shorekeeper = charactersData[0];
  const currentScore = calculateEchoScore(echo, shorekeeper.weights);

  // Get all echoes with the current cost
  const availableEchoes = echoDatabase.filter(e => e.cost === echo.cost);
  
  // Find the currently selected Echo in the database
  const selectedEchoData = echoDatabase.find(e => e.id === echo.echoId);
  
  // Filter the sonataData list to only show sets that are valid for this Echo
  const validSonataSets = sonataData.filter(set => 
    selectedEchoData?.sonataSets.includes(set.id)
  );

  // Handler for changing Cost (1, 3, 4)
  const handleCostChange = (newCost: 1 | 3 | 4) => {
    // Find the first echo available for this new cost
    const firstEchoOfCost = echoDatabase.find(e => e.cost === newCost);
    
    if (firstEchoOfCost) {
      setEcho({
        ...echo,
        cost: newCost,
        echoId: firstEchoOfCost.id,
        setId: firstEchoOfCost.sonataSets[0] || ''
      });
    }
  };

  const handleEchoChange = (newEchoId: string) => {
    const newEchoData = echoDatabase.find(e => e.id === newEchoId);
    // Automatically switch to the first valid set for the new echo
    const defaultSetId = newEchoData?.sonataSets[0] || '';
    
    setEcho({ 
      ...echo, 
      echoId: newEchoId,
      setId: defaultSetId 
    });
  };

  const handleMainStatChange = (newStat: StatType) => {
    setEcho({ ...echo, mainStat: newStat });
  };

  const handleSubStatChange = (index: number, field: keyof SubStat, newValue: string | number) => {
    const newSubStats = [...echo.subStats];
    newSubStats[index] = { ...newSubStats[index], [field]: newValue };
    setEcho({ ...echo, subStats: newSubStats });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-4 md:p-8 font-sans">
      <header className="mb-6 md:mb-8 border-b border-slate-700 pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">WuWa Build Tracker</h1>
      </header>

      <main className="max-w-2xl mx-auto space-y-4 md:space-y-6">
        
        {/* Character Info */}
        <div className="bg-slate-800 p-4 md:p-6 rounded-lg border border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-lg">
          <div className="flex items-center gap-4">
            <img 
              src={shorekeeperIcon} 
              alt="Shorekeeper" 
              className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-full border-2 border-indigo-500 bg-slate-900"
            />
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white">{shorekeeper.name}</h2>
              <p className="text-sm text-indigo-400">{shorekeeper.element}</p>
            </div>
          </div>
          <div className="md:text-right w-full md:w-auto bg-slate-900/50 p-3 rounded-lg md:bg-transparent md:p-0">
            <p className="text-xs md:text-sm text-slate-400">Total Echo Score</p>
            <p className="text-2xl md:text-3xl font-bold text-green-400">{currentScore.toFixed(2)}</p>
          </div>
        </div>

        {/* Interactive Echo Card */}
        <div className="bg-slate-800 p-4 md:p-6 rounded-lg border border-slate-700 shadow-lg space-y-4 md:space-y-6">
          
          {/* Echo Selection */}
          <div>
            <label className="text-xs md:text-sm text-slate-400 font-bold uppercase tracking-wider block mb-2">Echo</label>
            <select 
              value={echo.echoId}
              onChange={(e) => handleEchoChange(e.target.value)}
              className="w-full bg-slate-700 text-white font-bold text-base md:text-lg rounded p-2 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {availableEchoes.map(e => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>

          {/* Cost & Main Stat Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 pt-4 border-t border-slate-700">
            
            {/* NEW COST SELECTOR */}
            <select
              value={echo.cost}
              onChange={(e) => handleCostChange(Number(e.target.value) as 1 | 3 | 4)}
              className="bg-amber-900 text-amber-200 px-3 py-1 rounded text-sm font-bold outline-none cursor-pointer focus:ring-2 focus:ring-amber-500"
            >
              <option value={1}>Cost 1</option>
              <option value={3}>Cost 3</option>
              <option value={4}>Cost 4</option>
            </select>
            
            <select 
              value={echo.mainStat}
              onChange={(e) => handleMainStatChange(e.target.value as StatType)}
              className="w-full sm:w-auto bg-slate-700 text-white font-bold text-base md:text-lg rounded p-2 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {ALL_STATS.map(stat => (
                <option key={stat} value={stat}>{stat}</option>
              ))}
            </select>
          </div>

          {/* Set Selection (Filtered!) */}
          <div className="pt-4 border-t border-slate-700">
            <label className="text-xs md:text-sm text-slate-400 font-bold uppercase tracking-wider block mb-2">Sonata Effect</label>
            <select 
              value={echo.setId}
              onChange={(e) => setEcho({ ...echo, setId: e.target.value })}
              className="w-full bg-slate-700 text-sm p-2 rounded outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer text-slate-200"
            >
              {validSonataSets.map(set => (
                <option key={set.id} value={set.id}>{set.name}</option>
              ))}
            </select>
          </div>
          
          {/* Sub Stats List */}
          <div className="space-y-3 pt-4 border-t border-slate-700">
            <p className="text-xs md:text-sm text-slate-400 font-bold uppercase tracking-wider mb-2">Sub Stats</p>
            
            {echo.subStats.map((stat, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                {/* Stat Type Dropdown */}
                <select 
                  value={stat.type}
                  onChange={(e) => handleSubStatChange(i, 'type', e.target.value)}
                  className="w-full sm:flex-1 bg-slate-700 text-sm p-2 rounded outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer text-slate-200"
                >
                  {ALL_STATS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                {/* Number Input */}
                <input 
                  type="number" 
                  step="0.1"
                  value={stat.value}
                  onChange={(e) => handleSubStatChange(i, 'value', parseFloat(e.target.value) || 0)}
                  className="w-full sm:w-24 bg-slate-700 text-sm p-2 rounded outline-none focus:ring-2 focus:ring-indigo-500 text-white font-mono sm:text-right"
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;