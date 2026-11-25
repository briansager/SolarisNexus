import { useState } from 'react';
import { charactersData } from './data';
import { roverVariants } from './roverData';
import { calculateBuildScore, getActiveSonataSets, getScoreTier } from './scoring';
import type { Character, Echo, RoverElement } from './types';
import { sonataData } from './sonataData';
import { echoDatabase } from './echoData';
import EchoCard from './components/EchoCard';
import CharacterPicker from './components/CharacterPicker';

const icons = import.meta.glob('./assets/*-icon.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
});
const defaultIcon =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%231e293b'/%3E%3Ctext x='50' y='50' font-family='sans-serif' font-size='40' fill='%2364748b' text-anchor='middle' dominant-baseline='middle'%3E%3F%3C/text%3E%3C/svg%3E";

// The new Solaris Nexus Logo (encoded as Data URI)
const logoDataUri = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'%3E%3Ccircle cx='50' cy='50' r='45' stroke='url(%23grad1)' stroke-width='2' stroke-dasharray='10 5'/%3E%3Cpath d='M50 15 L60 40 L85 50 L60 60 L50 85 L40 60 L15 50 L40 40 Z' fill='url(%23grad2)'/%3E%3Ccircle cx='50' cy='50' r='8' fill='%231e293b' stroke='%23818cf8' stroke-width='2'/%3E%3Ccircle cx='50' cy='15' r='3' fill='%23818cf8'/%3E%3Ccircle cx='85' cy='50' r='3' fill='%23818cf8'/%3E%3Ccircle cx='50' cy='85' r='3' fill='%23818cf8'/%3E%3Ccircle cx='15' cy='50' r='3' fill='%23818cf8'/%3E%3Cdefs%3E%3ClinearGradient id='grad1' x1='0' y1='0' x2='100' y2='100' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0%25' stop-color='%23818cf8' stop-opacity='0.5'/%3E%3Cstop offset='100%25' stop-color='%2322d3ee' stop-opacity='0.1'/%3E%3C/linearGradient%3E%3ClinearGradient id='grad2' x1='0' y1='0' x2='100' y2='100' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0%25' stop-color='%23818cf8'/%3E%3Cstop offset='100%25' stop-color='%2322d3ee'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E";

function baseCharacterId(id: string): string {
  if (id.startsWith('rover-m')) return 'rover-m';
  if (id.startsWith('rover-f')) return 'rover-f';
  return id;
}

function getCharacterIcon(id: string): string {
  const base = baseCharacterId(id);
  const exts = ['png', 'jpg', 'jpeg', 'webp'];
  for (const ext of exts) {
    const key = `./assets/${base}-icon.${ext}`;
    if (icons[key]) return icons[key] as string;
  }
  return defaultIcon;
}

function resolveCharacter(virtualId: string): Character {
  const roverMatch = virtualId.match(/^(rover-[mf])-(\w+)$/);
  if (roverMatch) {
    const [, baseId, elementRaw] = roverMatch;
    const element = (elementRaw.charAt(0).toUpperCase() +
      elementRaw.slice(1)) as RoverElement;
    const base = charactersData.find((c) => c.id === baseId);
    const variant = roverVariants[baseId]?.[element];
    if (base && variant) {
      return {
        ...base,
        element,
        bestWeapon: variant.bestWeapon,
        bestEcho: variant.bestEcho,
        recommendedSets: variant.recommendedSets,
        mainStat4: variant.mainStat4,
        mainStat3: variant.mainStat3,
        mainStat1: variant.mainStat1,
        weights: variant.weights,
      };
    }
  }
  return (
    charactersData.find((c) => c.id === virtualId) || charactersData[0]
  );
}

const generateSubStats = () => [
  { type: 'Energy Regen', value: 0 } as const,
  { type: 'HP%', value: 0 } as const,
  { type: 'Crit DMG', value: 0 } as const,
  { type: 'ATK%', value: 0 } as const,
  { type: 'Crit Rate', value: 0 } as const,
];

const initialEchoes: Echo[] = [
  { echoId: 'mourning-aix', cost: 4, setId: 'celestial-light', mainStat: 'Crit Rate', flatAtk: 150, subStats: generateSubStats() },
  { echoId: 'abyssal-mercator', cost: 3, setId: 'eternal-radiance', mainStat: 'Spectro DMG Bonus', flatAtk: 100, subStats: generateSubStats() },
  { echoId: 'diurnus-knight', cost: 3, setId: 'eternal-radiance', mainStat: 'Spectro DMG Bonus', flatAtk: 100, subStats: generateSubStats() },
  { echoId: 'cruisewing', cost: 1, setId: 'rejuvenating-glow', mainStat: 'ATK', subStats: generateSubStats() },
  { echoId: 'fission-junrock', cost: 1, setId: 'rejuvenating-glow', mainStat: 'ATK', subStats: generateSubStats() },
];

function App() {
  const [echoes, setEchoes] = useState<Echo[]>(initialEchoes);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [selectedCharId, setSelectedCharId] = useState<string>('rover-m-aero');
  const [roverElements, setRoverElements] = useState<Record<string, RoverElement>>({
    'rover-m': 'Aero',
    'rover-f': 'Aero',
  });
  const [pickerOpen, setPickerOpen] = useState<boolean>(false);

  const currentCharacter = resolveCharacter(selectedCharId);
  const currentIcon = getCharacterIcon(selectedCharId);

  const handleSelectCharacter = (id: string) => {
    const m = id.match(/^(rover-[mf])-(\w+)$/);
    if (m) {
      const [, baseId, elementRaw] = m;
      const element = (elementRaw.charAt(0).toUpperCase() +
        elementRaw.slice(1)) as RoverElement;
      setRoverElements((prev) => ({ ...prev, [baseId]: element }));
    }
    setSelectedCharId(id);
  };

  const totalScore = calculateBuildScore(echoes, currentCharacter.weights);
  const activeSets = getActiveSonataSets(echoes);
  const tier = getScoreTier(totalScore);

  const handleEchoChange = (index: number, newEcho: Echo) => {
    const newEchoes = [...echoes];
    newEchoes[index] = newEcho;
    setEchoes(newEchoes);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-4 md:p-6 font-sans selection:bg-indigo-500/30">
      {/* Centered Top Title & Badge */}
      <div className="text-center mb-8 pt-4 flex flex-col items-center justify-center gap-2">
        <img 
          src={logoDataUri} 
          alt="Solaris Nexus Logo" 
          className="w-16 h-16 mb-1 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
        />
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 tracking-tight drop-shadow-sm">
          Solaris Nexus
        </h1>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
            Wuthering Waves Build Tracker
          </span>
        </div>
        <span className="bg-amber-900/40 text-amber-200 text-xs px-3 py-1 rounded-full border border-amber-700/50 shadow-sm mt-2">
          🚧 Work in Progress
        </span>
      </div>

      <header className="mb-6 max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-700/50 pb-4 gap-4">
        {/* Character Selector */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button
            onClick={() => setPickerOpen(true)}
            className="group relative flex-shrink-0 focus:outline-none"
            aria-label="Change character"
            title="Change character"
          >
            <img
              src={currentIcon}
              alt={currentCharacter.name}
              className="w-14 h-14 object-cover rounded-full border-2 border-slate-600 bg-slate-800 shadow-md transition-all group-hover:border-indigo-400 group-hover:ring-2 group-hover:ring-indigo-400/40 group-focus-visible:ring-2 group-focus-visible:ring-indigo-400/60"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-800 border border-slate-600 text-slate-300 text-[10px] flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500 transition-colors">
              ▾
            </span>
          </button>

          <div className="flex-1 min-w-0">
            <button
              onClick={() => setPickerOpen(true)}
              className="text-lg font-bold text-white hover:text-indigo-300 transition-colors text-left"
            >
              {currentCharacter.name}
              <span className="ml-2 text-xs font-normal text-slate-400">
                {currentCharacter.element} · {currentCharacter.weaponType}
              </span>
            </button>
            <p className="text-xs text-slate-400 mt-1 truncate">
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
            <span className="text-2xl font-bold text-green-400">
              {totalScore.toFixed(2)}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar - Echo Slots */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-2">
            Equipped Echoes
          </h2>

          {echoes.map((echo, index) => {
            const echoData = echoDatabase.find((e) => e.id === echo.echoId);
            const isSelected = selectedIndex === index;
            return (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`flex items-center gap-4 p-3 rounded-lg border transition-all text-left
                  ${
                    isSelected
                      ? 'bg-indigo-900/40 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                      : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800'
                  }`}
              >
                <div
                  className={`w-12 h-12 rounded flex items-center justify-center font-bold text-lg border
                  ${
                    echo.cost === 4
                      ? 'bg-amber-900/30 border-amber-500/50 text-amber-200'
                      : echo.cost === 3
                      ? 'bg-blue-900/30 border-blue-500/50 text-blue-200'
                      : 'bg-emerald-900/30 border-emerald-500/50 text-emerald-200'
                  }`}
                >
                  {echo.cost}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p
                    className={`text-sm font-bold truncate ${
                      isSelected ? 'text-white' : 'text-slate-300'
                    }`}
                  >
                    {echoData?.name || 'Unknown Echo'}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{echo.mainStat}</p>
                </div>
              </button>
            );
          })}

          <div className="mt-4 p-4 rounded-lg bg-slate-800/30 border border-slate-700/30">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
              Active Sonata Sets
            </h3>
            <div className="flex flex-col gap-2">
              {activeSets.map((set) => {
                const setData = sonataData.find((s) => s.id === set.setId);
                return (
                  <div key={set.setId} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                    <span className="text-sm text-indigo-200">
                      {setData?.name || set.setId}
                    </span>
                    <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded ml-auto">
                      {set.pieces}-pc
                    </span>
                  </div>
                );
              })}
              {activeSets.length === 0 && (
                <span className="text-xs text-slate-500 italic">
                  No active set bonuses
                </span>
              )}
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

      {pickerOpen && (
        <CharacterPicker
          selectedCharId={selectedCharId}
          roverElements={roverElements}
          onSelect={handleSelectCharacter}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}

export default App;