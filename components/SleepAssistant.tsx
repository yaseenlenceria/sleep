import React, { useEffect, useState } from 'react';
import { getSleepAdvice } from '../services/geminiService';
import { Sparkles } from 'lucide-react';

interface SleepAssistantProps {
  wakeTime: string;
  bedTime: string;
  mode: 'wake' | 'sleep';
}

const SleepAssistant: React.FC<SleepAssistantProps> = ({ wakeTime, bedTime, mode }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;

    const fetchAdvice = async () => {
      setLoading(true);
      const result = await getSleepAdvice(wakeTime, bedTime, mode);
      if (mounted) {
        setAdvice(result);
        setLoading(false);
      }
    };

    if (wakeTime && bedTime) {
      fetchAdvice();
    }

    return () => {
      mounted = false;
    };
  }, [wakeTime, bedTime, mode]);

  if (!wakeTime || !bedTime) return null;

  return (
    <div className="mt-6 w-full max-w-lg mx-auto animate-slide-up">
      <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-2xl p-5 relative overflow-hidden">
        
        {/* Decorative background glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>

        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-dream-highlight animate-pulse" />
          <h3 className="font-semibold text-dream-highlight text-sm uppercase tracking-wide">
            Sleep Intelligence
          </h3>
        </div>

        {loading ? (
          <div className="flex space-x-1 items-center h-12">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        ) : (
          <p className="text-slate-200 text-sm leading-relaxed italic">
            "{advice}"
          </p>
        )}
      </div>
    </div>
  );
};

export default SleepAssistant;