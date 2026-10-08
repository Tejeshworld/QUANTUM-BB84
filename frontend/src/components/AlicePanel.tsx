import React from 'react';
import { Send, Binary, Compass, Atom } from 'lucide-react';
import { QubitRecord } from '../types/bb84';

interface AlicePanelProps {
  records: QubitRecord[];
}

export const AlicePanel: React.FC<AlicePanelProps> = ({ records }) => {
  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide">
              ALICE <span className="text-cyan-400 font-normal">[Sender]</span>
            </h4>
            <p className="text-[11px] text-slate-400">Prepares and sends polarized single-qubit photons</p>
          </div>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 text-cyan-400 border border-cyan-500/20">
          N = {records.length}
        </span>
      </div>

      {/* Content Streams */}
      <div className="mt-4 space-y-3.5 flex-1 font-mono text-xs">
        
        {/* 1. Classical Bits */}
        <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1.5 text-[11px] font-sans font-semibold">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Binary className="w-3.5 h-3.5 text-cyan-400" />
              Random Classical Bits
            </span>
            <span>0 or 1</span>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto py-1">
            {records.length > 0 ? (
              records.map((r, i) => (
                <span
                  key={i}
                  className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${
                    r.aliceBit === 1 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {r.aliceBit}
                </span>
              ))
            ) : (
              <span className="text-slate-500 italic font-sans text-xs">No simulation data</span>
            )}
          </div>
        </div>

        {/* 2. Quantum Preparation Bases */}
        <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1.5 text-[11px] font-sans font-semibold">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Compass className="w-3.5 h-3.5 text-purple-400" />
              Random Encoding Bases
            </span>
            <span>+ (Rectilinear) / × (Diagonal)</span>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto py-1">
            {records.length > 0 ? (
              records.map((r, i) => (
                <span
                  key={i}
                  className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${
                    r.aliceBasis === '+'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  }`}
                >
                  {r.aliceBasis === 'x' ? '×' : '+'}
                </span>
              ))
            ) : (
              <span className="text-slate-500 italic font-sans text-xs">No simulation data</span>
            )}
          </div>
        </div>

        {/* 3. Prepared Quantum States */}
        <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1.5 text-[11px] font-sans font-semibold">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Atom className="w-3.5 h-3.5 text-sky-400" />
              Encoded Quantum States |ψ⟩
            </span>
            <span>|0⟩, |1⟩, |+⟩, |−⟩</span>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto py-1">
            {records.length > 0 ? (
              records.map((r, i) => (
                <span
                  key={i}
                  className="px-1.5 h-6 rounded bg-slate-800 text-sky-300 border border-slate-700 flex items-center justify-center font-bold text-[11px]"
                >
                  {r.aliceState}
                </span>
              ))
            ) : (
              <span className="text-slate-500 italic font-sans text-xs">No simulation data</span>
            )}
          </div>
        </div>

      </div>

      {/* Footer explanation */}
      <p className="mt-4 text-[11px] text-slate-400 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/60 leading-relaxed font-sans">
        💡 <strong>Alice's Preparation:</strong> Bit <code className="text-cyan-300">0</code> in <code className="text-purple-300">+</code> is <code className="text-sky-300">|0⟩</code>, bit <code className="text-cyan-300">1</code> is <code className="text-sky-300">|1⟩</code>. In <code className="text-purple-300">×</code> basis, bit <code className="text-cyan-300">0</code> is <code className="text-sky-300">|+⟩</code>, bit <code className="text-cyan-300">1</code> is <code className="text-sky-300">|−⟩</code>.
      </p>
    </div>
  );
};
