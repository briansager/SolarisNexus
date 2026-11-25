import { useEffect, useMemo, useState } from 'react';
import { charactersData } from '../data';
import { roverVariants } from '../roverData';
import type { RoverElement, RoverGender } from '../types';

// 1. Character icons (still in src/assets/)
const charIcons = import.meta.glob('../assets/*-icon.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
});

// 2. Game icons (elements and genders in src/assets/gameicons/)
const gameIcons = import.meta.glob('../assets/gameicons/*.png', {
  eager: true,
  import: 'default',
});

const defaultIcon =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%231e293b'/%3E%3Ctext x='50' y='50' font-family='sans-serif' font-size='40' fill='%2364748b' text-anchor='middle' dominant-baseline='middle'%3E%3F%3C/text%3E%3C/svg%3E";

// Strips a virtual suffix like '-aero' from 'rover-m-aero' → 'rover-m' so generic icons still work.
function baseCharacterId(id: string): string {
  if (id.startsWith('rover-m')) return 'rover-m';
  if (id.startsWith('rover-f')) return 'rover-f';
  return id;
}

function getCharacterIcon(id: string): string {
  const base = baseCharacterId(id);
  const exts = ['png', 'jpg', 'jpeg', 'webp'];
  for (const ext of exts) {
    const key = `../assets/${base}-icon.${ext}`;
    if (charIcons[key]) return charIcons[key] as string;
  }
  return defaultIcon;
}

// Loads the official circular element icons from the gameicons folder
function getElementIcon(elementName: string): string {
  // elementName is e.g., 'Aero', 'Electro'. File is e.g., 'aero-icon.png'
  const fileName = `${elementName.toLowerCase()}-icon.png`;
  return (gameIcons[`../assets/gameicons/${fileName}`] as string) || defaultIcon;
}

const ELEMENTS: {
  name: string;
  dot: string;
  text: string;
  chip: string;
  chipActive: string;
}[] = [
  { name: 'Glacio',  dot: 'bg-sky-400',     text: 'text-sky-300',     chip: 'border-sky-500/40 text-sky-200 hover:bg-sky-500/10',           chipActive: 'bg-sky-500/25 border-sky-400 text-sky-100' },
  { name: 'Fusion',  dot: 'bg-orange-400',  text: 'text-orange-300',  chip: 'border-orange-500/40 text-orange-200 hover:bg-orange-500/10',   chipActive: 'bg-orange-500/25 border-orange-400 text-orange-100' },
  { name: 'Electro', dot: 'bg-violet-400',  text: 'text-violet-300',  chip: 'border-violet-500/40 text-violet-200 hover:bg-violet-500/10',   chipActive: 'bg-violet-500/25 border-violet-400 text-violet-100' },
  { name: 'Aero',    dot: 'bg-emerald-400', text: 'text-emerald-300', chip: 'border-emerald-500/40 text-emerald-200 hover:bg-emerald-500/10', chipActive: 'bg-emerald-500/25 border-emerald-400 text-emerald-100' },
  { name: 'Spectro', dot: 'bg-yellow-300',  text: 'text-yellow-200',  chip: 'border-yellow-500/40 text-yellow-200 hover:bg-yellow-500/10',   chipActive: 'bg-yellow-500/25 border-yellow-400 text-yellow-100' },
  { name: 'Havoc',   dot: 'bg-rose-400',    text: 'text-rose-300',    chip: 'border-rose-500/40 text-rose-200 hover:bg-rose-500/10',         chipActive: 'bg-rose-500/25 border-rose-400 text-rose-100' },
];

const ROVER_ELEMENT_ORDER: RoverElement[] = ['Aero', 'Electro', 'Havoc', 'Spectro'];

interface CharacterPickerProps {
  selectedCharId: string;
  roverElements: Record<string, RoverElement>;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export default function CharacterPicker({
  selectedCharId,
  roverElements,
  onSelect,
  onClose,
}: CharacterPickerProps) {
  const [search, setSearch] = useState('');
  const [elementFilter, setElementFilter] = useState<string>('All');
  const [roverStep, setRoverStep] = useState<{ gender: RoverGender } | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const effectiveElement = (charId: string, baseElement: string): string => {
    if (baseCharacterId(charId) === charId && roverVariants[charId]) {
      return roverElements[charId] || 'Aero';
    }
    return baseElement;
  };

  const grouped = useMemo(() => {
    const q = search.trim().toLowerCase();

    let filtered = charactersData.filter((c) => {
      const isRover = c.id === 'rover-m' || c.id === 'rover-f';
      if (isRover) return false;
      if (q && !c.name.toLowerCase().includes(q)) return false;
      if (elementFilter !== 'All' && c.element !== elementFilter) return false;
      return true;
    });

    const rovers = charactersData.filter((c) => {
      const isRover = c.id === 'rover-m' || c.id === 'rover-f';
      if (!isRover) return false;
      if (q && !c.name.toLowerCase().includes(q)) return false;
      if (elementFilter !== 'All') {
        const currentEl = roverElements[c.id] || 'Aero';
        if (currentEl !== elementFilter) return false;
      }
      return true;
    });

    const all = [...filtered, ...rovers];

    return ELEMENTS.map((el) => ({
      ...el,
      characters: all
        .filter((c) => effectiveElement(c.id, c.element) === el.name)
        .sort((a, b) => a.name.localeCompare(b.name)),
    })).filter((g) => g.characters.length > 0);
  }, [search, elementFilter, roverElements]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Character picker"
    >
      <div
        className="w-full max-w-4xl max-h-[85vh] flex flex-col bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ===================== STEP 1: CHARACTER GRID ===================== */}
        {!roverStep && (
          <>
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-700/70">
              <h2 className="text-lg font-bold text-white tracking-tight whitespace-nowrap">
                Select Character
              </h2>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name…"
                autoFocus
                className="flex-1 max-w-xs px-3 py-1.5 text-sm bg-slate-800 border border-slate-700 rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="px-5 py-3 border-b border-slate-700/70 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mr-1">
                Element
              </span>
              <button
                onClick={() => setElementFilter('All')}
                className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                  elementFilter === 'All'
                    ? 'bg-indigo-500/25 border-indigo-400 text-indigo-100'
                    : 'border-slate-600 text-slate-300 hover:bg-slate-800'
                }`}
              >
                All
              </button>
              {ELEMENTS.map((el) => (
                <button
                  key={el.name}
                  onClick={() => setElementFilter(el.name)}
                  className={`px-2.5 py-1 text-xs rounded-full border transition-colors flex items-center gap-1.5 ${
                    elementFilter === el.name ? el.chipActive : el.chip
                  }`}
                >
                  <img src={getElementIcon(el.name)} alt="" className="w-3.5 h-3.5 rounded-full object-cover" />
                  {el.name}
                </button>
              ))}
            </div>

            <div className="overflow-y-auto px-5 py-4 space-y-6">
              {grouped.length === 0 && (
                <p className="text-center text-slate-500 italic py-12">
                  No characters match the current filters
                </p>
              )}

              {grouped.map((group) => (
                <section key={group.name}>
                  <div className="flex items-center gap-2 mb-3">
                    <img src={getElementIcon(group.name)} alt="" className="w-4 h-4 rounded-full object-cover" />
                    <h3 className={`text-xs font-bold uppercase tracking-widest ${group.text}`}>
                      {group.name}
                    </h3>
                    <span className="text-[10px] text-slate-500">
                      ({group.characters.length})
                    </span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                    {group.characters.map((char) => {
                      const isRover = char.id === 'rover-m' || char.id === 'rover-f';
                      const baseId = baseCharacterId(char.id);
                      const currentEl = isRover
                        ? roverElements[char.id] || 'Aero'
                        : char.element;
                      const isSelected = isRover
                        ? selectedCharId.startsWith(`${char.id}-`)
                        : selectedCharId === char.id;

                      return (
                        <button
                          key={char.id}
                          onClick={() => {
                            if (isRover) {
                              setRoverStep({
                                gender: char.id === 'rover-m' ? 'm' : 'f',
                              });
                            } else {
                              onSelect(char.id);
                              onClose();
                            }
                          }}
                          className="group flex flex-col items-center gap-1 focus:outline-none"
                          title={isRover ? `${char.name} — ${currentEl}` : char.name}
                        >
                          <div
                            className={`relative w-16 h-16 rounded-full overflow-hidden bg-slate-800 border-2 transition-all ${
                              isSelected
                                ? 'border-indigo-400 ring-2 ring-indigo-400/40'
                                : 'border-slate-600 group-hover:border-slate-400 group-hover:scale-105'
                            }`}
                          >
                            <img
                              src={getCharacterIcon(baseId)}
                              alt={char.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            {isSelected && (
                              <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center border border-slate-900">
                                ✓
                              </span>
                            )}
                            {isRover && (
                              <img
                                src={getElementIcon(currentEl)}
                                alt={currentEl}
                                className="absolute bottom-0 left-0 w-5 h-5 rounded-full bg-slate-900 border border-slate-700 p-0.5"
                                title={`Current element: ${currentEl}`}
                              />
                            )}
                          </div>
                          <span
                            className={`text-[10px] leading-tight text-center transition-colors line-clamp-2 ${
                              isSelected
                                ? 'text-indigo-300 font-semibold'
                                : 'text-slate-400 group-hover:text-slate-200'
                            }`}
                          >
                            {char.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </>
        )}

        {/* ===================== STEP 2: ROVER ELEMENT ===================== */}
        {roverStep && (
          <>
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-700/70">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setRoverStep(null)}
                  className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                  ← Back
                </button>
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  Rover: 
                  <img src={getElementIcon(roverElements[`rover-${roverStep.gender}`] || 'Aero')} alt="" className="w-5 h-5 rounded-full inline" />
                  {roverElements[`rover-${roverStep.gender}`] || 'Aero'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="px-5 py-8 flex flex-col items-center gap-8">
              <div className="flex items-center justify-center gap-3 flex-wrap">
                {ROVER_ELEMENT_ORDER.map((elName) => {
                  const currentEl = roverElements[`rover-${roverStep.gender}`] || 'Aero';
                  const isActive = currentEl === elName;
                  const variant = roverVariants[`rover-${roverStep.gender}`]?.[elName];
                  if (!variant) return null;
                  return (
                    <button
                      key={elName}
                      onClick={() => {
                        onSelect(`rover-${roverStep.gender}-${elName.toLowerCase()}`);
                        onClose();
                      }}
                      className={`relative w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all p-1 ${
                        isActive
                          ? 'border-indigo-400 bg-slate-800 ring-2 ring-indigo-400/40 scale-105'
                          : 'border-slate-700 bg-slate-800/60 hover:border-slate-500 hover:scale-105'
                      }`}
                      title={elName}
                    >
                      <img src={getElementIcon(elName)} alt={elName} className="w-full h-full object-cover rounded-full" />
                    </button>
                  );
                })}

                <div className="w-px h-8 bg-slate-700/70 mx-1" />

                {(['f', 'm'] as RoverGender[]).map((g) => {
                  const isActive = roverStep.gender === g;
                  // We don't have official gender icons in the screenshot, so we fallback to the text glyphs for now
                  // Once you have them, we can add them to gameicons/ and map them here.
                  return (
                    <button
                      key={g}
                      onClick={() => {
                        const currentEl = roverElements[`rover-${roverStep.gender}`] || 'Aero';
                        onSelect(`rover-${g}-${currentEl.toLowerCase()}`);
                        onClose();
                      }}
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2 transition-all ${
                        isActive
                          ? 'border-indigo-400 bg-slate-800 ring-2 ring-indigo-400/40 scale-105'
                          : 'border-slate-700 bg-slate-800/60 hover:border-slate-500 hover:scale-105'
                      }`}
                      title={g === 'm' ? 'Male' : 'Female'}
                    >
                      <span className="text-slate-200">{g === 'm' ? '♂' : '♀'}</span>
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-slate-500 text-center max-w-md">
                Choose an element for{' '}
                <span className="text-slate-300 font-semibold">
                  Rover ({roverStep.gender === 'm' ? 'Male' : 'Female'})
                </span>
                . You can also switch gender from this screen — the element
                stays the same.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}