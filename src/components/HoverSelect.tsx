import { useState, useRef } from 'react';

interface Option {
  value: string;
  label: string;
}

interface HoverSelectProps {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function HoverSelect({ value, options, onChange, className = '' }: HoverSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hoverTimeout = useRef<number | null>(null);

  const selectedLabel = options.find(o => o.value === value)?.label || 'Select...';

  const handleMouseEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    
    // Open the menu after hovering for 300ms
    hoverTimeout.current = window.setTimeout(() => {
      setIsOpen(true);
    }, 300); 
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    
    // Close the menu after leaving the container
    hoverTimeout.current = window.setTimeout(() => {
      setIsOpen(false);
    }, 150); // Slight delay so it doesn't flicker
  };

  return (
    // The wrapper handles both the enter and leave events for the box AND the menu
    <div 
      className={`relative group ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* The display area (looks like a select box) */}
      <div className="w-full bg-[#2a3040] text-sm text-slate-200 rounded-md p-2 border border-slate-600/50 outline-none flex justify-between items-center cursor-pointer hover:border-indigo-400 transition-colors">
        <span className="truncate">{selectedLabel}</span>
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>

      {/* The Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute z-50 top-full left-0 mt-1 w-full max-h-60 overflow-y-auto bg-[#1f2433] border border-slate-600 rounded-md shadow-2xl"
          // We don't need onMouseEnter here anymore because it's part of the wrapper div!
        >
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`px-3 py-2 text-sm cursor-pointer hover:bg-indigo-600 hover:text-white transition-colors
                ${option.value === value ? 'bg-indigo-900/50 text-indigo-200 font-bold' : 'text-slate-300'}`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}