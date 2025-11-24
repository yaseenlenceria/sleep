import React from 'react';
import { ArrowLeft, ShieldCheck, Lock, Cpu, Database, Cookie } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  const Section = ({ icon: Icon, title, children }: { icon: any, title: string, children: React.ReactNode }) => (
    <div className="mb-8 last:mb-0">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
          <Icon className="w-5 h-5 text-indigo-400" />
        </div>
        <h2 className="text-lg font-semibold text-white tracking-wide">{title}</h2>
      </div>
      <div className="pl-2 border-l-2 border-slate-800 ml-4">
        <div className="pl-6 text-slate-300 leading-relaxed text-sm md:text-base">
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in w-full max-w-3xl mx-auto px-4 sm:px-6 pb-12 pt-4">
      <button 
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-all duration-300 group py-2 px-4 rounded-full hover:bg-white/5 w-fit"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span className="font-medium">Back to Calculator</span>
      </button>

      <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        {/* Background gradients */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <header className="flex items-start justify-between mb-10 relative z-10">
          <div>
             <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="w-8 h-8 text-dream-accent" />
                <span className="text-indigo-400 font-bold text-sm uppercase tracking-widest">Legal</span>
             </div>
             <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Privacy Policy</h1>
             <p className="text-slate-400 text-sm">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </header>

        <div className="relative z-10">
          <p className="text-slate-300 mb-10 text-lg font-light leading-relaxed border-b border-white/5 pb-8">
            At <span className="text-white font-semibold">DreamCycle</span>, we believe privacy is a fundamental right. We’ve built this tool to be transparent, ephemeral, and respectful of your data.
          </p>

          <Section icon={Database} title="Data Collection & Storage">
            <p className="mb-3"><strong className="text-white">We do not store your personal data.</strong> Period.</p>
            <ul className="space-y-2 list-disc pl-4 marker:text-indigo-500">
              <li>All sleep cycle calculations are performed 100% locally on your device.</li>
              <li>We do not maintain a database of your sleep patterns, wake times, or usage habits.</li>
              <li>Refreshing the page wipes all temporary session data instantly.</li>
            </ul>
          </Section>

          <Section icon={Cpu} title="AI & Gemini API Usage">
            <p className="mb-3">To provide personalized sleep tips, we utilize Google's Gemini API.</p>
            <ul className="space-y-2 list-disc pl-4 marker:text-purple-500">
              <li>When you request advice, only the specific time parameters (e.g., "Wake up at 7:00 AM") are sent to the model.</li>
              <li>This data is <strong>ephemeral</strong> and is not used to train models or identify you.</li>
              <li>We do not send any personal identifiers (IP addresses, names, emails) to the AI service.</li>
            </ul>
          </Section>

          <Section icon={Cookie} title="Tracking & Cookies">
            <p>
              DreamCycle is a tracking-free zone. We do not use third-party analytics cookies, advertising pixels, or behavior trackers. The only data stored is strictly necessary for the app to function while you are using it (in-memory state).
            </p>
          </Section>

          <Section icon={Lock} title="Security">
            <p>
              All communication between your browser and our services (including the AI endpoint) is encrypted using industry-standard HTTPS/TLS protocols.
            </p>
          </Section>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col items-center gap-4 relative z-10">
           <p className="text-slate-500 text-sm text-center">
             By using DreamCycle, you agree to the terms outlined above.
           </p>
           <button 
            onClick={onBack}
            className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-10 py-3.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;