import type { Echo, StatType, SubStat } from '../types';
import { echoDatabase } from '../echoData';
import { sonataData } from '../sonataData';
import { calculateEchoScore } from '../scoring';
import { charactersData } from '../data';

const ALL_STATS: StatType[] = [
  'ATK', 'ATK%', 'HP', 'HP%', 'DEF', 'DEF%',
  'Crit Rate', 'Crit DMG', 'Energy Regen', 'Healing Bonus',
  'Aero DMG Bonus', 'Glacio DMG Bonus', 'Fusion DMG Bonus', 'Electro DMG Bonus', 'Spectro DMG Bonus', 'Havoc DMG Bonus',
  'Basic Attack DMG Bonus', 'Heavy Attack DMG Bonus', 'Resonance Skill DMG Bonus', 'Resonance Liberation DMG Bonus'
];

interface EchoCardProps {
  echo: Echo;
  index: number;
  onChange: (index: number, newEcho: Echo) => void;
}

export default function EchoCard({ echo, index, onChange }: EchoCardProps) {
  const shorekeeper = charactersData[0];
  const currentScore = calculateEchoScore(echo, shorekeeper.weights);

  const availableEchoes = echoDatabase.filter(e => e.cost === echo.cost);
  const selectedEchoData = echoDatabase.find(e => e.id === echo.echoId);
  const validSonataSets = sonataData.filter(set => selectedEchoData?.sonataSets.includes(set.id));

  const handleCostChange = (newCost: 1 | 3 | 4) => {
    const firstEchoOfCost = echoDatabase.find(e => e.cost === newCost);
    if (firstEchoOfCost) {
      onChange(index, {
        ...echo,
        cost: newCost,
        echoId: firstEchoOfCost.id,
        setId: firstEchoOfCost.sonataSets[0] || ''
      });
    }
  };

  const handleEchoChange = (newEchoId: string) => {
    const newEchoData = echoDatabase.find(e => e.id === newEchoId);
    onChange(index, { 
      ...echo, 
      echoId: newEchoId,
      setId: newEchoData?.sonataSets[0] || '' 
    });
  };

  const handleMainStatChange = (newStat: StatType) => {
    onChange(index, { ...echo, mainStat: newStat });
  };

  const handleSubStatChange = (subIndex: number, field: keyof SubStat, newValue: string | number) => {
    const newSubStats = [...echo.subStats];
    newSubStats[subIndex] = { ...newSubStats[subIndex], [field]: newValue };
    onChange(index, { ...echo, subStats: newSubStats });
  };

  return (
    <div className="bg-slate-800 p-4 md:p-6 rounded-lg border border-slate-700 shadow-lg space-y-4 md:space-y-6 relative">
      
      {/* Score Badge */}
      <div className="absolute top-4 right-4 bg-slate-900 px-3 py-1 rounded border border-slate-700">
        <span className="text-xs text-slate-400 mr-2">Score:</span>
        <span className="font-bold text-green-400">{currentScore.toFixed(2)}</span>
      </div>

      {/* Echo Selection */}
      <div className="pt-2">
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

      {/* Set Selection */}
      <div className="pt-4 border-t border-slate-700">
        <label className="text-xs md:text-sm text-slate-400 font-bold uppercase tracking-wider block mb-2">Sonata Effect</label>
        <select 
          value={echo.setId}
          onChange={(e) => onChange(index, { ...echo, setId: e.target.value })}
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
            <select 
              value={stat.type}
              onChange={(e) => handleSubStatChange(i, 'type', e.target.value)}
              className="w-full sm:flex-1 bg-slate-700 text-sm p-2 rounded outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer text-slate-200"
            >
              {ALL_STATS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

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
  );
}