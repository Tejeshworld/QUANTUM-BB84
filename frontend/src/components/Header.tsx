import React from 'react';
import { Shield, Sparkles, Activity, KeyRound, Cpu } from 'lucide-react';

interface HeaderProps {
  isRunning: boolean;
  onNavigate: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ isRunning, onNavigate }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#060913]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('hero')}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-600 shadow-lg shadow-cyan-500/20">
            <Cpu className="w-5 h-5 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping opacity-75" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                BB84 QKD SIMULATOR
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                v2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Quantum Key Distribution Protocol Simulation
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium text-slate-300">
          <button 
            onClick={() => onNavigate('simulator')} 
            className="px-3.5 py-1.5 rounded-lg hover:text-cyan-400 hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
          >
            <Activity className="w-4 h-4 text-cyan-400" />
            Simulator
          </button>
          <button 
            onClick={() => onNavigate('sifting')} 
            className="px-3.5 py-1.5 rounded-lg hover:text-cyan-400 hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
          >
            <KeyRound className="w-4 h-4 text-purple-400" />
            Sifting & QBER
          </button>
          <button 
            onClick={() => onNavigate('how-it-works')} 
            className="px-3.5 py-1.5 rounded-lg hover:text-cyan-400 hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            How It Works
          </button>
          <button 
            onClick={() => onNavigate('security')} 
            className="px-3.5 py-1.5 rounded-lg hover:text-cyan-400 hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
          >
            <Shield className="w-4 h-4 text-emerald-400" />
            Security & Physics
          </button>
        </nav>

        {/* Status indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700/60 text-xs font-mono">
            <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
            <span className="text-slate-300">
              {isRunning ? 'Simulating...' : 'Simulation Ready'}
            </span>
          </div>
        </div>

      </div>
    </header>
  );
};
