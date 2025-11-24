import React, { useRef, useEffect } from 'react';
import { TimeState, AmPm } from '../types';

interface TimePickerProps {
  value: TimeState;
  onChange: (value: TimeState) => void;
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5); // 0, 5, 10... for cleaner UI
// To match user request of specific minute scroll, we can do 0..59, but that's a long scroll.
// Let's do 0..59 for accuracy as requested.
const ALL_MINUTES = Array.from({ length: 60 }, (_, i) => i);

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
  
  const Column = ({ 
    options, 
    selectedValue, 
    onSelect,
    label 
  }: { 
    options: (number | string)[], 
    selectedValue: number | string, 
    onSelect: (val: any) => void,
    label: string
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (containerRef.current) {
        const selectedIndex = options.indexOf(selectedValue);
        const itemHeight = 48; // h-12
        // Center the selected item
        containerRef.current.scrollTop = (selectedIndex * itemHeight); 
      }
    }, []); // Only on mount to set initial position, real snapping handled by scroll-snap-type

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
       // Logic to find closest item could go here if we want instant state updates on scroll
       // For now, we rely on click selection for precision or simple CSS scroll snap visuals
    };

    return (
      <div className="flex flex-col items-center">
        <span className="text-xs text-slate-400 mb-2 uppercase tracking-wider font-semibold">{label}</span>
        <div 
          ref={containerRef}
          onScroll={handleScroll}
          className="h-48 w-20 overflow-y-auto no-scrollbar snap-y snap-mandatory border-y border-slate-700/50 relative bg-slate-800/30 rounded-xl"
        >
          {/* Spacer for top */}
          <div className="h-20 w-full flex-shrink-0"></div>
          
          {options.map((opt) => {
            const isSelected = opt === selectedValue;
            return (
              <div 
                key={opt} 
                className={`h-12 w-full flex items-center justify-center snap-center flex-shrink-0 cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'text-white font-bold text-2xl scale-110' 
                    : 'text-slate-500 hover:text-slate-300 text-lg'
                }`}
                onClick={() => {
                  onSelect(opt);
                  // smooth scroll to it
                  if (containerRef.current) {
                    const idx = options.indexOf(opt);
                    containerRef.current.scrollTo({
                      top: idx * 48,
                      behavior: 'smooth'
                    });
                  }
                }}
              >
                {typeof opt === 'number' && opt < 10 ? `0${opt}` : opt}
              </div>
            );
          })}

          {/* Spacer for bottom */}
          <div className="h-20 w-full flex-shrink-0"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-center gap-4 py-8 select-none">
      <Column 
        label="Hour"
        options={HOURS} 
        selectedValue={value.hour} 
        onSelect={(h) => onChange({ ...value, hour: h })} 
      />
      
      {/* Visual Separator */}
      <div className="h-48 flex items-center justify-center pt-6">
        <span className="text-2xl font-bold text-slate-600">:</span>
      </div>

      <Column 
        label="Minute"
        options={ALL_MINUTES} 
        selectedValue={value.minute} 
        onSelect={(m) => onChange({ ...value, minute: m })} 
      />

      <Column 
        label="AM/PM"
        options={[AmPm.AM, AmPm.PM]} 
        selectedValue={value.ampm} 
        onSelect={(ap) => onChange({ ...value, ampm: ap })} 
      />
    </div>
  );
};

export default TimePicker;