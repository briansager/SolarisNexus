import { useEffect, useMemo, useState } from 'react';
import { charactersData } from '../data';

const icons = import.meta.glob('../assets/*-icon.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
});

const defaultIcon =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%231e293b'/%3E%3Ctext x='50' y='50' font-family='sans-serif' font-size='40' fill='%2364748b' text-anchor='middle' dominant-baseline='middle'%3E%3F%3C/text%3E%3C/svg%3E";

function getCharacterIcon(id: string): string {
  const exts = ['png', 'jpg', 'jpeg', 'webp'];
  for (const ext of exts) {
    const key = `../assets/${id}-icon.${ext}`;
    if (icons[key]) return icons[key] as string;
  }
  return defaultIcon;
}

// Canonical element order + Tailwind color tokens
const ELEMENT_ORDER = [
  { name: 'Glacio', dot: 'bg-sky-400', text: 'text-sky-300', ring: 'ring-sky-500/40' },
  { name: 'Fusion', dot: 'bg-orange-400', text: 'text-orange-300', ring: 'ring-orange-500/40' },
  { name: 'Electro', dot: 'bg-violet-400', text: 'text-violet-300', ring: 'ring-violet-500/40' },
  { name: 'Aero', dot: 'bg-emerald-400', text: 'text-emerald-300', ring: 'ring-emerald-500/40' },
  { name: 'Spectro', dot: 'bg-yellow-300', text: 'text-yellow-200', ring: 'ring-yellow-500/40' },
  { name: 'Havoc', dot: 'bg-rose-400', text: 'text-rose-300', ring: 'ring-rose-500/40' },
];

interface CharacterPickerProps {
  selectedCharId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export default function CharacterPicker({
  selectedCharId,
  onSelect,
  onClose,
}: CharacterPickerProps) {
  const [search, setSearch] = useState('');

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const grouped = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = q
      ? charactersData.filter((c) => c.name.toLowerCase().includes(q))
      : charactersData;

    return ELEMENT_ORDER.map((el) => ({
      ...el,
      characters: filtered.filter((c) => c.element === el.name),
    })).filter((g) => g.characters.length > 0);
  }, [search]);

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
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-slate-700/70">
          <h2 className="text-lg font-bold text-white tracking-tight">
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

        {/* Scrollable body */}
        <div className="overflow-y-auto px-5 py-4 space-y-6">
          {grouped.length === 0 && (
            <p className="text-center text-slate-500 italic py-12">
              No characters match "{search}"
            </p>
          )}

          {grouped.map((group) => (
            <section key={group.name}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-2.5 h-2.5 rounded-full ${group.dot}`} />
                <h3
                  className={`text-xs font-bold uppercase tracking-widest ${group.text}`}
                >
                  {group.name}
                </h3>
                <span className="text-[10px] text-slate-500">
                  ({group.characters.length})
                </span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                {group.characters.map((char) => {
                  const isSelected = char.id === selectedCharId;
                  return (
                    <button
                      key={char.id}
                      onClick={() => {
                        onSelect(char.id);
                        onClose();
                      }}
                      className={`group flex flex-col items-center gap-1 focus:outline-none`}
                      title={`${char.name} (${char.element})`}
                    >
                      <div
                        className={`relative w-16 h-16 rounded-full overflow-hidden bg-slate-800 border-2 transition-all
                          ${
                            isSelected
                              ? 'border-indigo-400 ring-2 ring-indigo-400/40'
                              : 'border-slate-600 group-hover:border-slate-400 group-hover:scale-105'
                          }`}
                      >
                        <img
                          src={getCharacterIcon(char.id)}
                          alt={char.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {isSelected && (
                          <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center border border-slate-900">
                            ✓
                          </span>
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
      </div>
    </div>
  );
}