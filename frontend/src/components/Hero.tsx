import React from 'react';
import { ShieldCheck, Zap, Radio, Lock, ArrowRight, BookOpen } from 'lucide-react';
import { BlochSphere } from './BlochSphere';

interface HeroProps {
  onStartSimulation: () => void;
  onLearnMore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartSimulation, onLearnMore }) => {
  return (
    <section id="hero" className="relative py-12 lg:py-16 overflow-hidden">
      {/* Background glow gradient & Decorative Glass Bloch Sphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/10 via-purple-500/10 to-indigo-500/10 blur-[120px] pointer-events-none -z-10" />
      
      {/* Faint Glass Bloch Sphere on right background */}
      <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 opacity-25 pointer-events-none -z-10">
        <BlochSphere size="lg" glowColor="#38bdf8" />
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center relative z-10">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-xs font-semibold text-cyan-300 shadow-inner mb-6 backdrop-blur-md">
          <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Interactive Quantum Cryptography Simulator</span>
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
          Secure Communication Through{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
            Quantum Principles
          </span>
        </h2>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Explore how the <strong className="text-cyan-300 font-semibold">BB84 Quantum Key Distribution</strong> protocol enables Alice and Bob to establish a shared secret key and detect eavesdropping via quantum measurement disturbance.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onStartSimulation}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-slate-950" />
            Start Simulation
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
          <button
            onClick={onLearnMore}
            className="px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            Learn BB84 Protocol
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto text-left">
          
          <div className="glass-card glass-card-hover p-5 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-3">
              <Lock className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="font-bold text-slate-100 text-sm tracking-wide uppercase">
              Quantum Key Distribution
            </h3>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Single-photon polarization states in non-orthogonal conjugate bases establish secret keys with information-theoretic security.
            </p>
          </div>

          <div className="glass-card glass-card-hover p-5 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-3">
              <Radio className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="font-bold text-slate-100 text-sm tracking-wide uppercase">
              Eavesdropping Detection
            </h3>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              The No-Cloning Theorem & Heisenberg Uncertainty prevent Eve from measuring states without introducing detectable ~25% QBER.
            </p>
          </div>

          <div className="glass-card glass-card-hover p-5 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="font-bold text-slate-100 text-sm tracking-wide uppercase">
              QBER Security Analysis
            </h3>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Public parameter estimation verifies channel fidelity against an 11% threshold before extracting the final key.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
