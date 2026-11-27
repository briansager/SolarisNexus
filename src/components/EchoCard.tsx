import type { Echo, StatType, SubStat, Character } from '../types';
import { echoDatabase } from '../echoData';
import { sonataData } from '../sonataData';
import { calculateEchoScore } from '../scoring';
import HoverSelect from './HoverSelect';

// Glob specifically for the sonata folder and the echoes folder
const echoIconModules = import.meta.glob('../assets/echoes/**/*.{webp,png,jpg,jpeg}', { eager: true, import: 'default' });
const sonataIconModules = import.meta.glob('../assets/sonata/*.{webp,png,jpg,jpeg}', { eager: true, import: 'default' });

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
  character: Character;
  onChange: (index: number, newEcho: Echo) => void;
}

export default function EchoCard({ echo, index, character, onChange }: EchoCardProps) {
  const currentScore = calculateEchoScore(echo, character.weights);
  const availableEchoes = echoDatabase.filter(e => e.cost === echo.cost);
  const selectedEchoData = echoDatabase.find(e => e.id === echo.echoId);
  const validSonataSets = sonataData.filter(set => selectedEchoData?.sonataSets.includes(set.id));

  // Helper function to find the correct image path
  const findImage = (modules: Record<string, unknown>, id: string) => {
    for (const path in modules) {
      if (path.endsWith(`/${id}.webp`) || path.endsWith(`/${id}.png`) || path.endsWith(`/${id}.jpg`)) {
        return modules[path] as string;
      }
    }
    return null;
  };

  const echoIconSrc = findImage(echoIconModules, echo.echoId);
  const sonataIconSrc = findImage(sonataIconModules, echo.setId);

  const handleCostChange = (newCostStr: string) => {
    const newCost = Number(newCostStr) as 1 | 3 | 4;
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
  
  const echoOptions = availableEchoes.map(e => ({ value: e.id, label: e.name }));
  const costOptions = [
    { value: '1', label: 'Cost 1' },
    { value: '3', label: 'Cost 3' },
    { value: '4', label: 'Cost 4' }
  ];
  const setOptions = validSonataSets.map(s => ({ value: s.id, label: s.name }));
  const mainStatOptions = mainStatsList.map(s => ({ value: s, label: s }));

  return (
    <div className="bg-[#1a1f2e] rounded-xl border border-slate-700/50 shadow-2xl overflow-hidden flex flex-col h-full">
      
      {/* HEADER */}
      <div className="bg-[#232938] p-4 border-b border-slate-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          {echoIconSrc ? (
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 overflow-hidden flex-shrink-0">
              <img src={echoIconSrc} alt={selectedEchoData?.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center flex-shrink-0 text-slate-500 text-xs">
              ?
            </div>
          )}
          <div>
            <h2 className="text-lg font-bold text-amber-100 flex items-center gap-2">
              <span className="bg-amber-900/50 text-amber-200 px-2 py-0.5 rounded text-xs border border-amber-700/50">
                COST {echo.cost}
              </span>
              {selectedEchoData?.name}
            </h2>
          </div>
        </div>
        
        <div className="text-right border-l border-slate-600/50 pl-4">
          <p className="text-xs text-slate-400 mb-0.5">Echo Score</p>
          <p className="text-xl font-bold text-green-400 font-mono">{currentScore.toFixed(2)}</p>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-6">
        
        {/* SELECTORS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Select Echo</label>
            <HoverSelect value={echo.echoId} options={echoOptions} onChange={handleEchoChange} />
          </div>
          <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Cost Filter</label>
            <HoverSelect value={echo.cost.toString()} options={costOptions} onChange={handleCostChange} />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Main Stat</label>
            <HoverSelect 
              value={echo.mainStat} 
              options={mainStatOptions} 
              onChange={(val) => handleMainStatChange(val as StatType)} 
              className="border-amber-700/30 text-amber-100 font-bold" 
            />
          </div>
          
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

        {/* SONATA SELECTION */}
        <div className="bg-[#151923] p-4 rounded-lg border border-slate-700/50 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Sonata Effect</label>
            {sonataIconSrc && (
               <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-700 opacity-80">
                 <img src={sonataIconSrc} alt="Sonata Icon" className="w-full h-full object-cover" />
               </div>
            )}
          </div>
          <HoverSelect value={echo.setId} options={setOptions} onChange={(val) => onChange(index, { ...echo, setId: val })} className="text-indigo-200" />
          
          {/* Sonata Icon Quick-Picker */}
          {validSonataSets.length > 1 && (
            <div className="mt-2">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-2">Available Sets</label>
              <div className="flex flex-wrap gap-3">
                {validSonataSets.map((set) => {
                  const setIcon = findImage(sonataIconModules, set.id);
                  const isSelected = echo.setId === set.id;
                  return (
                    <button
                      key={set.id}
                      onClick={() => onChange(index, { ...echo, setId: set.id })}
                      title={set.name}
                      className={`w-10 h-10 rounded-full border-2 overflow-hidden transition-all flex-shrink-0 flex items-center justify-center bg-slate-800
                        ${isSelected ? 'border-indigo-400 scale-110 shadow-[0_0_10px_rgba(99,102,241,0.4)] opacity-100' : 'border-slate-700 opacity-50 hover:opacity-100 hover:scale-105'}`}
                    >
                      {setIcon ? (
                        <img src={setIcon} alt={set.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold">{set.name.charAt(0)}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* SUB STATS */}
        <div className="mt-2">
          <div className="flex justify-between items-end mb-2">
             <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Sub Stats (5 Max)</label>
             <span className="text-[10px] text-slate-600 italic">Assumes Echo is +25</span>
          </div>
          <div className="bg-[#151923] rounded-lg border border-slate-700/50 divide-y divide-slate-700/30">
            {echo.subStats.map((stat, i) => (
              <div key={i} className="flex items-center gap-2 p-2 hover:bg-[#1f2433] transition-colors">
                <span className="text-slate-500 text-xs w-4 text-center">+</span>
                <select value={stat.type} onChange={(e) => handleSubStatChange(i, 'type', e.target.value)} className="flex-1 bg-transparent text-sm text-slate-300 outline-none cursor-pointer appearance-none">
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