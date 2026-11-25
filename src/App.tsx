import { useState } from 'react';
import { charactersData } from './data';
import { roverVariants } from './roverData';
import { calculateBuildScore, getActiveSonataSets, getScoreTier } from './scoring';
import type { Character, Echo, RoverElement } from './types';
import { sonataData } from './sonataData';
import { echoDatabase } from './echoData';
import EchoCard from './components/EchoCard';
import CharacterPicker from './components/CharacterPicker';
import BuildScanner from './components/BuildScanner';
import logoImage from './assets/logo.png';

// Import the new grade icons directly from assets
import gradeSTriple from './assets/S_triple.png';
import gradeSDouble from './assets/S_double.png';
import gradeSSingle from './assets/S_single.png';
import gradeA from './assets/A.png';
import gradeB from './assets/B.png';
import gradeDash from './assets/dash.png';

// Create a map to easily grab the right image
const gradeIcons: Record<string, string> = {
  'S_triple.png': gradeSTriple,
  'S_double.png': gradeSDouble,
  'S_single.png': gradeSSingle,
  'A.png': gradeA,
  'B.png': gradeB,
  'dash.png': gradeDash,
};

const icons = import.meta.glob('./assets/*-icon.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
});
const defaultIcon =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%231e293b'/%3E%3Ctext x='50' y='50' font-family='sans-serif' font-size='40' fill='%2364748b' text-anchor='middle' dominant-baseline='middle'%3E%3F%3C/text%3E%3C/svg%3E";

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
  const [scannerOpen, setScannerOpen] = useState<boolean>(false);

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
  const gradeIconSrc = gradeIcons[tier.icon] || gradeDash;

  const handleEchoChange = (index: number, newEcho: Echo) => {
    const newEchoes = [...echoes];
    newEchoes[index] = newEcho;
    setEchoes(newEchoes);
  };

  const handleBuildImported = (importedEchoes: Echo[]) => {
    setEchoes(importedEchoes);
    setScannerOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-indigo-500/30 flex flex-col">
      {/* ============ TOP NAVBAR ============ */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
          {/* Left: logo only */}
          <a href="/" className="flex items-center" aria-label="Solaris Nexus home">
            <img
              src={logoImage}
              alt="Solaris Nexus"
              className="h-9 md:h-10 w-auto object-contain select-none drop-shadow-[0_0_10px_rgba(99,102,241,0.35)]"
              draggable={false}
            />
          </a>

          {/* Right: nav links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <a
              href="/"
              aria-current="page"
              className="rounded-md bg-slate-800/70 px-3 py-2 text-sm font-medium text-slate-100 ring-1 ring-slate-700"
            >
              Tracker
            </a>
            <button
              onClick={() => setScannerOpen(true)}
              className="rounded-md px-3 py-2 text-sm font-medium text-indigo-300 hover:text-indigo-200 hover:bg-slate-800/50 transition-colors"
            >
              Import Build
            </button>
            <a
              href="/about"
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:text-slate-100 hover:bg-slate-800/50 transition-colors"
            >
              About
            </a>
            <a
              href="/login"
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:text-slate-100 hover:bg-slate-800/50 transition-colors"
            >
              Login
            </a>

            {/* Language dropdown */}
            <div className="relative ml-1">
              <label htmlFor="language-select" className="sr-only">
                Language
              </label>
              <select
                id="language-select"
                defaultValue="en"
                className="cursor-pointer appearance-none rounded-md border border-slate-700 bg-slate-800/70 px-3 py-2 pr-8 text-sm font-medium text-slate-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="en">EN</option>
                <option value="ja">JA</option>
                <option value="zh">ZH</option>
                <option value="ko">KO</option>
              </select>
              <svg
                className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </nav>
        </div>
      </header>

      {/* ============ MAIN ============ */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-6 md:py-8">
        {/* Character header + Score/Grade */}
        <div className="mb-6 flex flex-col gap-4 border-b border-slate-700/50 pb-4 md:flex-row md:items-center md:justify-between">
          {/* Character selector */}
          <div className="flex w-full items-center gap-4 md:w-auto">
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

          {/* Score & Grade (right-aligned) */}
          <div className="flex w-full gap-3 justify-end md:w-auto items-center">
            
            {/* New Grade Display */}
            <div className="bg-slate-800 px-4 py-1.5 rounded-full border border-slate-700 flex items-center gap-3 shadow-sm h-12">
              <span className="text-sm text-slate-400">Grade</span>
              <img 
                src={gradeIconSrc} 
                alt={tier.label} 
                className="h-8 w-auto object-contain drop-shadow-md"
              />
            </div>

            <div className="bg-slate-800 px-5 py-2 rounded-full border border-slate-700 flex items-center gap-3 shadow-sm h-12">
              <span className="text-sm text-slate-400">Total Score</span>
              <span className="text-2xl font-bold text-green-400">
                {totalScore.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* 12-col grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: Echo slots + active sets */}
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

          {/* RIGHT: Echo editor */}
          <div className="lg:col-span-8">
            <EchoCard
              echo={echoes[selectedIndex]}
              index={selectedIndex}
              character={currentCharacter}
              onChange={handleEchoChange}
            />
          </div>
        </div>
      </main>

      {/* Character picker modal */}
      {pickerOpen && (
        <CharacterPicker
          selectedCharId={selectedCharId}
          roverElements={roverElements}
          onSelect={handleSelectCharacter}
          onClose={() => setPickerOpen(false)}
        />
      )}

      {/* Build Scanner modal */}
      {scannerOpen && (
        <BuildScanner
          onComplete={handleBuildImported}
          onClose={() => setScannerOpen(false)}
        />
      )}
    </div>
  );
}

export default App;