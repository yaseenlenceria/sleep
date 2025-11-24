import React, { useState } from 'react';
import TimePicker from './components/TimePicker';
import Results from './components/Results';
import SleepAssistant from './components/SleepAssistant';
import PrivacyPolicy from './components/PrivacyPolicy';
import { TimeState, AmPm, SleepCycle } from './types';
import { calculateBedtimes, calculateWakeTimes, formatTime, timeStateToDate } from './utils/timeUtils';
import { MoonStar, AlarmClock } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'input' | 'results' | 'privacy'>('input');
  const [previousView, setPreviousView] = useState<'input' | 'results'>('input');
  const [mode, setMode] = useState<'wake' | 'sleep'>('wake'); // wake = I want to wake up at..., sleep = I am sleeping now
  
  const [targetTime, setTargetTime] = useState<TimeState>({
    hour: 7,
    minute: 30,
    ampm: AmPm.AM
  });

  const [results, setResults] = useState<SleepCycle[]>([]);
  
  // For Gemini context
  const [selectedResultTime, setSelectedResultTime] = useState<string | null>(null);

  const handleCalculate = () => {
    if (mode === 'wake') {
      const bedtimes = calculateBedtimes(targetTime);
      setResults(bedtimes);
      // Auto select the best time (usually 5-6 cycles)
      const best = bedtimes.find(b => b.cycles === 5) || bedtimes[0];
      setSelectedResultTime(formatTime(best.time));
    } else {
      const wakeTimes = calculateWakeTimes();
      setResults(wakeTimes);
      const best = wakeTimes.find(b => b.cycles === 5) || wakeTimes[wakeTimes.length - 1];
      setSelectedResultTime(formatTime(best.time));
    }
    setView('results');
  };

  const switchMode = (newMode: 'wake' | 'sleep') => {
    setMode(newMode);
    setView('input');
    setResults([]);
    setSelectedResultTime(null);
  };

  const openPrivacy = () => {
    window.scrollTo(0, 0);
    if (view !== 'privacy') {
      setPreviousView(view === 'results' ? 'results' : 'input');
      setView('privacy');
    }
  };

  const closePrivacy = () => {
    setView(previousView);
  };

  return (
    // Outer container: flex col to handle vertical centering vs scrolling
    <div className="min-h-screen w-full bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black flex flex-col items-center relative overflow-x-hidden">
      
      {/* Main Content Area: grows to fill space, centers content if possible */}
      <main className="flex-grow w-full flex flex-col items-center justify-center p-4 md:p-6">
        
        <div className="w-full max-w-2xl flex flex-col items-center my-auto">
          
          {/* Header (Hidden in Privacy Mode for focus) */}
          {view !== 'privacy' && (
            <header className="mb-8 md:mb-12 text-center animate-fade-in">
              <h1 
                className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-white to-purple-200 mb-3 tracking-tight cursor-pointer transition-opacity hover:opacity-90" 
                onClick={() => setView('input')}
              >
                DreamCycle
              </h1>
              <p className="text-slate-400 text-base md:text-lg font-light tracking-wide">
                Sync your sleep with natural circadian rhythms
              </p>
            </header>
          )}

          {view === 'input' && (
            <div className="w-full max-w-md animate-slide-up">
              {/* Tabs */}
              <div className="bg-slate-900/80 p-1.5 rounded-2xl flex mb-8 border border-slate-800/60 shadow-xl backdrop-blur-sm">
                <button
                  onClick={() => switchMode('wake')}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2
                    ${mode === 'wake' 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                >
                  <AlarmClock className="w-4 h-4" />
                  Wake Up At
                </button>
                <button
                  onClick={() => switchMode('sleep')}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2
                    ${mode === 'sleep' 
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                >
                  <MoonStar className="w-4 h-4" />
                  Bedtime Now
                </button>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl ring-1 ring-white/5">
                
                {mode === 'wake' ? (
                  <>
                    <div className="text-center mb-6">
                      <span className="text-indigo-300 font-semibold text-xs uppercase tracking-[0.2em]">Select Target Time</span>
                    </div>
                    <TimePicker value={targetTime} onChange={setTargetTime} />
                  </>
                ) : (
                  <div className="py-12 text-center animate-fade-in">
                     <div className="w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-white/10 shadow-inner">
                        <MoonStar className="w-10 h-10 text-indigo-300" />
                     </div>
                     <h2 className="text-2xl font-bold text-white mb-3">Ready to sleep?</h2>
                     <p className="text-slate-400 leading-relaxed px-4">
                       We'll calculate the optimal wake-up times to help you avoid sleep inertia.
                     </p>
                  </div>
                )}

                <button
                  onClick={handleCalculate}
                  className="w-full mt-8 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:via-indigo-500 hover:to-purple-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-indigo-500/25 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ring-1 ring-white/20"
                >
                  {mode === 'wake' ? 'Calculate Bedtime' : 'Calculate Wake-up Time'}
                </button>
              </div>
            </div>
          )}

          {view === 'results' && (
            <div className="flex flex-col items-center w-full animate-slide-up">
              <Results 
                data={results} 
                mode={mode} 
                onReset={() => setView('input')} 
                onSelectTime={setSelectedResultTime}
                selectedTimeLabel={selectedResultTime}
              />
              
              {selectedResultTime && (
                <SleepAssistant 
                  mode={mode}
                  wakeTime={mode === 'wake' ? formatTime(timeStateToDate(targetTime)) : selectedResultTime}
                  bedTime={mode === 'wake' ? selectedResultTime : 'Now'}
                />
              )}
            </div>
          )}

          {view === 'privacy' && (
            <PrivacyPolicy onBack={closePrivacy} />
          )}

        </div>
      </main>

      {/* Footer */}
      {view !== 'privacy' && (
        <footer className="w-full py-6 text-center animate-fade-in border-t border-white/5 bg-black/20 backdrop-blur-sm mt-auto">
          <div className="flex flex-col items-center gap-3">
            <nav className="flex gap-6 text-sm font-medium">
              <button 
                onClick={openPrivacy}
                className="text-slate-500 hover:text-indigo-300 transition-colors"
              >
                Privacy Policy
              </button>
              <span className="text-slate-700">•</span>
              <a href="#" className="text-slate-500 hover:text-indigo-300 transition-colors cursor-default">
                Terms
              </a>
            </nav>
            <div className="text-xs text-slate-600">
              &copy; {new Date().getFullYear()} DreamCycle. Sweet dreams.
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;