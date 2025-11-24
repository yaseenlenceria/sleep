import React from 'react';
import { SleepCycle } from '../types';
import { formatTime } from '../utils/timeUtils';
import { Moon, Sun, Clock } from 'lucide-react';

interface ResultsProps {
  data: SleepCycle[];
  mode: 'wake' | 'sleep';
  onReset: () => void;
  onSelectTime: (time: string) => void;
  selectedTimeLabel: string | null;
}

const Results: React.FC<ResultsProps> = ({ data, mode, onReset, onSelectTime, selectedTimeLabel }) => {
  
  const title = mode === 'wake' 
    ? "To wake up refreshed at your target time, you should fall asleep at:"
    : "If you go to bed now, try to wake up at one of these times:";

  return (
    <div className="animate-fade-in w-full max-w-lg mx-auto">
      <div className="bg-slate-800/50 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-2xl border border-white/5">
        <div className="flex justify-center mb-6">
          {mode === 'wake' ? <Moon className="w-10 h-10 text-dream-accent" /> : <Sun className="w-10 h-10 text-amber-400" />}
        </div>
        
        <p className="text-slate-300 text-center mb-8 leading-relaxed">
          {title}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {data.map((item, idx) => {
             const timeStr = formatTime(item.time);
             const isSelected = selectedTimeLabel === timeStr;
             
             return (
              <button
                key={idx}
                onClick={() => onSelectTime(timeStr)}
                className={`relative group flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300
                  ${item.label === "Suggested" 
                    ? 'bg-indigo-600/20 border-indigo-500/50 hover:bg-indigo-600/30' 
                    : 'bg-slate-700/20 border-slate-700 hover:bg-slate-700/40'}
                  ${isSelected ? 'ring-2 ring-dream-highlight scale-105' : ''}
                `}
              >
                <span className="text-2xl font-bold text-white mb-1">{timeStr}</span>
                <span className={`text-xs font-medium uppercase tracking-wider
                  ${item.label === "Suggested" ? 'text-dream-accent' : 'text-slate-400'}
                `}>
                  {item.label === "Suggested" && <span className="mr-1">★</span>}
                  {item.cycles} Cycles
                </span>
              </button>
            );
          })}
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-slate-400">
              The average human takes <span className="text-white font-semibold">15 minutes</span> to fall asleep. 
              These calculations include this buffer time to ensure you complete full 90-minute sleep cycles.
            </p>
          </div>
        </div>

        <button 
          onClick={onReset}
          className="w-full py-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-colors"
        >
          Calculate Again
        </button>
      </div>
    </div>
  );
};

export default Results;