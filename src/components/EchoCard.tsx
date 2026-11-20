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

const COST_1_MAIN_STATS: StatType[] = ['ATK', 'HP', 'DEF'];

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
        setId: firstEchoOfCost.sonataSets[0] || '',
        mainStat: newCost === 1 ? 'ATK' : 'Crit Rate', 
        flatAtk: newCost === 1 ? undefined : 100 
      });
    }
  };

  const handleEchoChange = (newEchoId: string) => {
    const newEchoData = echoDatabase.find(e => e.id === newEchoId);
    onChange(index, { ...echo, echoId: newEchoId, setId: newEchoData?.sonataSets[0] || '' });
  };

  const handleMainStatChange = (newStat: StatType) => onChange(index, { ...echo, mainStat: newStat });
  const handleFlatAtkChange = (val: string) => onChange(index, { ...echo, flatAtk: parseFloat(val) || 0 });

  const handleSubStatChange = (subIndex: number, field: keyof SubStat, newValue: string | number) => {
    const newSubStats = [...echo.subStats];
    newSubStats[subIndex] = { ...newSubStats[subIndex], [field]: newValue };
    onChange(index, { ...echo, subStats: newSubStats });
  };

  const mainStatsList = echo.cost === 1 ? COST_1_MAIN_STATS : ALL_STATS.filter(s => !COST_1_MAIN_STATS.includes(s));

  return (
    <div className="bg-[#1a1f2e] rounded-xl border border-slate-700/50 shadow-2xl overflow-hidden flex flex-col h-full">
      
      <div className="bg-[#232938] p-4 border-b border-slate-700/50 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-amber-100 flex items-center gap-2">
            <span className="bg-amber-900/50 text-amber-200 px-2 py-0.5 rounded text-xs border border-amber-700/50">
              COST {echo.cost}
            </span>
            {selectedEchoData?.name}
          </h2>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400 mb-0.5">Echo Score</p>
          <p className="text-xl font-bold text-green-400 font-mono">{currentScore.toFixed(2)}</p>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Select Echo</label>
            <select 
              value={echo.echoId}
              onChange={(e) => handleEchoChange(e.target.value)}
              className="w-full bg-[#2a3040] text-sm text-slate-200 rounded-md p-2 border border-slate-600/50 outline-none focus:border-indigo-400"
            >
              {availableEchoes.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Cost Filter</label>
            <select
              value={echo.cost}
              onChange={(e) => handleCostChange(Number(e.target.value) as 1 | 3 | 4)}
              className="w-full bg-[#2a3040] text-sm text-slate-200 rounded-md p-2 border border-slate-600/50 outline-none focus:border-indigo-400"
            >
              <option value={1}>Cost 1</option>
              <option value={3}>Cost 3</option>
              <option value={4}>Cost 4</option>
            </select>
          </div>
        </div>

        {/* Main Stats Row */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Main Stat</label>
            <select 
              value={echo.mainStat}
              onChange={(e) => handleMainStatChange(e.target.value as StatType)}
              className="w-full bg-[#2a3040] text-amber-100 font-bold text-sm rounded-md p-2.5 border border-amber-700/30 outline-none focus:border-amber-500"
            >
              {mainStatsList.map(stat => <option key={stat} value={stat}>{stat}</option>)}
            </select>
          </div>
          
          {/* Fixed ATK for Cost 3 & 4 */}
          {echo.cost !== 1 && (
            <div className="w-1/3">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Base ATK</label>
              <input 
                type="number"
                value={echo.flatAtk || 0}
                onChange={(e) => handleFlatAtkChange(e.target.value)}
                className="w-full bg-[#2a3040] text-sm text-white rounded-md p-2.5 border border-slate-600/50 outline-none focus:border-indigo-400 font-mono text-right"
              />
            </div>
          )}
        </div>

        <div>
          <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Sonata Effect</label>
          <select 
            value={echo.setId}
            onChange={(e) => onChange(index, { ...echo, setId: e.target.value })}
            className="w-full bg-[#2a3040] text-sm text-indigo-200 rounded-md p-2.5 border border-slate-600/50 outline-none focus:border-indigo-400"
          >
            {validSonataSets.map(set => <option key={set.id} value={set.id}>{set.name}</option>)}
          </select>
        </div>

        <div className="mt-2">
          <div className="flex justify-between items-end mb-2">
             <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Sub Stats (5 Max)</label>
             <span className="text-[10px] text-slate-600 italic">Assumes Echo is +25</span>
          </div>
          <div className="bg-[#151923] rounded-lg border border-slate-700/50 divide-y divide-slate-700/30">
            {echo.subStats.map((stat, i) => (
              <div key={i} className="flex items-center gap-2 p-2 hover:bg-[#1f2433] transition-colors">
                <span className="text-slate-500 text-xs w-4 text-center">+</span>
                <select 
                  value={stat.type}
                  onChange={(e) => handleSubStatChange(i, 'type', e.target.value)}
                  className="flex-1 bg-transparent text-sm text-slate-300 outline-none cursor-pointer appearance-none"
                >
                  {ALL_STATS.map(s => <option key={s} value={s} className="bg-[#1a1f2e]">{s}</option>)}
                </select>

                <div className="flex items-center bg-[#2a3040] rounded border border-slate-600/50 focus-within:border-indigo-400 w-24">
                  <input 
                    type="number" 
                    step="0.1"
                    value={stat.value}
                    onChange={(e) => handleSubStatChange(i, 'value', parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent text-sm p-1.5 text-right font-mono text-white outline-none"
                  />
                  <span className="text-slate-500 text-xs px-2">%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}