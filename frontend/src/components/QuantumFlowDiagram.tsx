import React from 'react';
import { Send, Eye, ShieldAlert, ShieldCheck, Waves, UserCheck, Sparkles, Zap } from 'lucide-react';
import { SimulationConfig } from '../types/bb84';

interface QuantumFlowDiagramProps {
  config: SimulationConfig;
  isRunning: boolean;
  activeQubitIndex: number;
}

export const QuantumFlowDiagram: React.FC<QuantumFlowDiagramProps> = ({
  config,
  isRunning,
  activeQubitIndex,
}) => {
  const progressRatio = config.numQubits > 0 ? activeQubitIndex / config.numQubits : 0;
  const isPastEve = progressRatio > 0.5;

  return (
    <div className="glass-card p-6 rounded-2xl border border-slate-800 shadow-xl mb-8 relative overflow-hidden">
      
      {/* Background Subtle Gradient Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-teal-500/5 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            Quantum Transmission Topology
            {isRunning && (
              <span className="text-[10px] text-cyan-400 font-mono font-normal animate-pulse">
                [Transmitting Qubit #{activeQubitIndex}]
              </span>
            )}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Channel Status:</span>
          {config.eveEnabled ? (
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1 font-bold animate-pulse">
              <ShieldAlert className="w-3 h-3" />
              INTERCEPTED (Eve Active)
            </span>
          ) : config.noiseEnabled ? (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1 font-bold">
              <Waves className="w-3 h-3" />
              NOISY ({(config.noiseProbability * 100).toFixed(0)}% Noise)
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-bold">
              <ShieldCheck className="w-3 h-3" />
              SECURE (Direct Optical Fiber)
            </span>
          )}
        </div>
      </div>

      {/* Main Flow Nodes Diagram */}
      <div className="relative py-8 px-4 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 z-10">
        
        {/* Connection Background Track */}
        <div className="hidden md:block absolute top-1/2 left-20 right-20 h-1.5 -translate-y-1/2 bg-slate-800/90 rounded-full z-0 overflow-hidden border border-slate-700/50">
          {/* Subtle fiber line grid */}
          <div className="w-full h-full bg-[linear-gradient(90deg,transparent_0%,rgba(56,189,248,0.2)_50%,transparent_100%)] animate-[pulse_3s_ease-in-out_infinite]" />
          
          {/* Traveling Quantum Photon Pulse */}
          {isRunning && (
            <div
              className={`absolute top-0 bottom-0 w-24 rounded-full transition-all duration-75 ${
                config.eveEnabled
                  ? isPastEve
                    ? 'bg-gradient-to-r from-rose-500 via-pink-400 to-transparent shadow-[0_0_15px_#f43f5e]'
                    : 'bg-gradient-to-r from-transparent via-cyan-400 to-amber-300 shadow-[0_0_15px_#38bdf8]'
                  : 'bg-gradient-to-r from-transparent via-cyan-400 to-teal-300 shadow-[0_0_15px_#38bdf8]'
              }`}
              style={{
                left: `${progressRatio * 100}%`,
                transform: 'translateX(-50%)',
              }}
            />
          )}
        </div>

        {/* 1. Alice Node */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-700 p-0.5 shadow-lg shadow-cyan-500/20 transition-all hover:scale-105">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex flex-col items-center justify-center">
              <Send className="w-7 h-7 text-cyan-400" />
              <span className="text-[10px] font-black tracking-widest text-cyan-300 uppercase mt-1">
                Alice
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-200 mt-2">Transmitter</span>
          <span className="text-[11px] text-slate-400 font-mono">Prepares |ψ⟩</span>
        </div>

        {/* Channel Segment 1 */}
        <div className="flex flex-col items-center justify-center z-10">
          <div className="px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5 shadow-inner backdrop-blur-md">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Single-Photon Pulses</span>
          </div>
        </div>

        {/* 2. Eve Node (Active or Passthrough) */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {config.eveEnabled ? (
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-700 p-0.5 shadow-lg shadow-rose-500/30 animate-pulse transition-all hover:scale-105">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex flex-col items-center justify-center">
                <Eye className="w-7 h-7 text-rose-400" />
                <span className="text-[10px] font-black tracking-widest text-rose-400 uppercase mt-1">
                  Eve
                </span>
              </div>
            </div>
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-slate-800/80 border border-dashed border-slate-700 flex flex-col items-center justify-center opacity-60">
              <ShieldCheck className="w-6 h-6 text-slate-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase mt-1">
                Eve OFF
              </span>
            </div>
          )}
          <span className={`text-xs font-bold mt-2 ${config.eveEnabled ? 'text-rose-400' : 'text-slate-500'}`}>
            {config.eveEnabled ? 'Eavesdropper' : 'Unintercepted'}
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            {config.eveEnabled ? 'Intercept & Resend' : 'Passive Channel'}
          </span>
        </div>

        {/* Channel Segment 2 */}
        <div className="flex flex-col items-center justify-center z-10">
          <div className="px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-[11px] font-mono text-slate-300 flex items-center gap-1.5 shadow-inner backdrop-blur-md">
            {config.eveEnabled ? (
              <span className="text-rose-300 flex items-center gap-1">
                <Zap className="w-3 h-3 text-rose-400" /> Resent State
              </span>
            ) : (
              <span>Optical Fiber</span>
            )}
          </div>
        </div>

        {/* 3. Bob Node */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-600 p-0.5 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex flex-col items-center justify-center">
              <UserCheck className="w-7 h-7 text-emerald-400" />
              <span className="text-[10px] font-black tracking-widest text-emerald-300 uppercase mt-1">
                Bob
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-200 mt-2">Receiver</span>
          <span className="text-[11px] text-slate-400 font-mono">Measures & Collapses</span>
        </div>

      </div>

      {/* Live Particle Progression Bar */}
      {isRunning && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 relative z-10">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
            <span>Transmitting Qubit: {activeQubitIndex} / {config.numQubits}</span>
            <span className="text-cyan-400 font-bold">{Math.round((activeQubitIndex / config.numQubits) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-400 transition-all duration-75 rounded-full shadow-[0_0_10px_#38bdf8]"
              style={{ width: `${(activeQubitIndex / config.numQubits) * 100}%` }}
            />
          </div>
        </div>
      )}

    </div>
  );
};
