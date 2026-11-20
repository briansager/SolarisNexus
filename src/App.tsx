import { useState } from 'react';
import { charactersData } from './data';
import { calculateBuildScore, getActiveSonataSets, getScoreTier } from './scoring';
import type { Echo } from './types';
import { sonataData } from './sonataData';
import { echoDatabase } from './echoData';
import EchoCard from './components/EchoCard';
import HoverSelect from './components/HoverSelect';

const icons = import.meta.glob('./assets/*-icon.{png,jpg,jpeg,webp}', { eager: true, import: 'default' });
const defaultIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%231e293b'/%3E%3Ctext x='50' y='50' font-family='sans-serif' font-size='40' fill='%2364748b' text-anchor='middle' dominant-baseline='middle'%3E?%3C/text%3E%3C/svg%3E";

const generateSubStats = () => [
  { type: 'Energy Regen', value: 0 } as const, 
  { type: 'HP%', value: 0 } as const, 
  { type: 'Crit DMG', value: 0 } as const,
  { type: 'ATK%', value: 0 } as const,
  { type: 'Crit Rate', value: 0 } as const
];

const initialEchoes: Echo[] = [
  { echoId: 'mourning-aix', cost: 4, setId: 'celestial-light', mainStat: 'Crit Rate', flatAtk: 150, subStats: generateSubStats() },
  { echoId: 'abyssal-mercator', cost: 3, setId: 'eternal-radiance', mainStat: 'Spectro DMG Bonus', flatAtk: 100, subStats: generateSubStats() },
  { echoId: 'diurnus-knight', cost: 3, setId: 'eternal-radiance', mainStat: 'Spectro DMG Bonus', flatAtk: 100, subStats: generateSubStats() },
  { echoId: 'cruisewing', cost: 1, setId: 'rejuvenating-glow', mainStat: 'ATK', subStats: generateSubStats() },
  { echoId: 'fission-junrock', cost: 1, setId: 'rejuvenating-glow', mainStat: 'ATK', subStats: generateSubStats() }
];

function App() {
  const [echoes, setEchoes] = useState<Echo[]>(initialEchoes);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [selectedCharId, setSelectedCharId] = useState<string>('shorekeeper');

  const currentCharacter = charactersData.find(c => c.id === selectedCharId) || charactersData[0];

  const iconKey = `./assets/${currentCharacter.id}-icon.png`;
  const iconKeyJpg = `./assets/${currentCharacter.id}-icon.jpg`;
  const iconKeyJpeg = `./assets/${currentCharacter.id}-icon.jpeg`;
  const iconKeyWebp = `./assets/${currentCharacter.id}-icon.webp`;

  const currentIcon = (icons[iconKey] || icons[iconKeyJpg] || icons[iconKeyJpeg] || icons[iconKeyWebp] || defaultIcon) as string;

  const totalScore = calculateBuildScore(echoes, currentCharacter.weights);
  const activeSets = getActiveSonataSets(echoes);
  const tier = getScoreTier(totalScore);

  const handleEchoChange = (index: number, newEcho: Echo) => {
    const newEchoes = [...echoes];
    newEchoes[index] = newEcho;
    setEchoes(newEchoes);
  };

  const characterOptions = charactersData.map(char => ({
    value: char.id,
    label: `${char.name} (${char.element})`
  }));

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-4 md:p-6 font-sans selection:bg-indigo-500/30">
      
      {/* Centered Top Title & Badge */}
      <div className="text-center mb-8 pt-4 flex flex-col items-center justify-center gap-2">
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 tracking-tight drop-shadow-sm">
          Wuthering Waves Build Tracker
        </h1>
        <span className="bg-amber-900/40 text-amber-200 text-xs px-3 py-1 rounded-full border border-amber-700/50 shadow-sm">
          🚧 Work in Progress
        </span>
      </div>

      <header className="mb-6 max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-700/50 pb-4 gap-4">
        
        {/* Character Selector Dropdown */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <img 
            src={currentIcon} 
            alt={currentCharacter.name} 
            className="w-14 h-14 object-cover rounded-full border-2 border-slate-600 bg-slate-800 shadow-md" 
          />
          <div className="flex-1 w-64">
            <HoverSelect 
              value={selectedCharId}
              options={characterOptions}
              onChange={(val) => setSelectedCharId(val)}
              className="text-lg font-bold text-white shadow-inner"
            />
            <p className="text-xs text-slate-400 mt-1">
              {currentCharacter.recommendedSets} • {currentCharacter.mainStat4}
            </p>
          </div>
        </div>
        
        {/* Score & Grade Panel */}
        <div className="flex gap-4 w-full md:w-auto justify-end">
          <div className="bg-slate-800 px-6 py-2 rounded-full border border-slate-700 flex items-center gap-4 shadow-sm">
            <span className="text-sm text-slate-400">Grade</span>
            <span className={`text-2xl font-bold ${tier.color}`}>{tier.label}</span>
          </div>
          <div className="bg-slate-800 px-6 py-2 rounded-full border border-slate-700 flex items-center gap-4 shadow-sm">
            <span className="text-sm text-slate-400">Total Score</span>
            <span className="text-2xl font-bold text-green-400">{totalScore.toFixed(2)}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
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
                  ${isSelected ? 'bg-indigo-900/40 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800'}`}
              >
                <div className={`w-12 h-12 rounded flex items-center justify-center font-bold text-lg border
                  ${echo.cost === 4 ? 'bg-amber-900/30 border-amber-500/50 text-amber-200' : 
                    echo.cost === 3 ? 'bg-blue-900/30 border-blue-500/50 text-blue-200' : 
                    'bg-emerald-900/30 border-emerald-500/50 text-emerald-200'}`}
                >
                  {echo.cost}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className={`text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>{echoData?.name || 'Unknown Echo'}</p>
                  <p className="text-xs text-slate-500 truncate">{echo.mainStat}</p>
                </div>
              </button>
            );
          })}

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
              {activeSets.length === 0 && <span className="text-xs text-slate-500 italic">No active set bonuses</span>}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <EchoCard 
            echo={echoes[selectedIndex]} 
            index={selectedIndex} 
            character={currentCharacter}
            onChange={handleEchoChange} 
          />
        </div>
      </main>
    </div>
  );
}

export default App;