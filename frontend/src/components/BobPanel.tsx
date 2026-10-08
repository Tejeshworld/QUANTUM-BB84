import React from 'react';
import { UserCheck, Binary, Compass, Atom } from 'lucide-react';
import { QubitRecord } from '../types/bb84';

interface BobPanelProps {
  records: QubitRecord[];
}

export const BobPanel: React.FC<BobPanelProps> = ({ records }) => {
  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide">
              BOB <span className="text-teal-400 font-normal">[Receiver]</span>
            </h4>
            <p className="text-[11px] text-slate-400">Selects random measurement bases and detects incoming qubits</p>
          </div>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 text-teal-400 border border-teal-500/20">
          N = {records.length}
        </span>
      </div>

      {/* Content Streams */}
      <div className="mt-4 space-y-3.5 flex-1 font-mono text-xs">
        
        {/* 1. Bob Bases */}
        <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1.5 text-[11px] font-sans font-semibold">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Compass className="w-3.5 h-3.5 text-teal-400" />
              Bob Measurement Bases
            </span>
            <span>+ (Rectilinear) / × (Diagonal)</span>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto py-1">
            {records.length > 0 ? (
              records.map((r, i) => (
                <span
                  key={i}
                  className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${
                    r.bobBasis === '+'
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {r.bobBasis === 'x' ? '×' : '+'}
                </span>
              ))
            ) : (
              <span className="text-slate-500 italic font-sans text-xs">No simulation data</span>
            )}
          </div>
        </div>

        {/* 2. Bob Measured Bits */}
        <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1.5 text-[11px] font-sans font-semibold">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Binary className="w-3.5 h-3.5 text-emerald-400" />
              Bob Measurement Results
            </span>
            <span>0 or 1</span>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto py-1">
            {records.length > 0 ? (
              records.map((r, i) => (
                <span
                  key={i}
                  className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${
                    r.bobBit === 1 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {r.bobBit}
                </span>
              ))
            ) : (
              <span className="text-slate-500 italic font-sans text-xs">No simulation data</span>
            )}
          </div>
        </div>

        {/* 3. Collapsed State */}
        <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1.5 text-[11px] font-sans font-semibold">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Atom className="w-3.5 h-3.5 text-cyan-400" />
              Bob Collapsed State |ψ'⟩
            </span>
            <span>Projected State</span>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto py-1">
            {records.length > 0 ? (
              records.map((r, i) => (
                <span
                  key={i}
                  className="px-1.5 h-6 rounded bg-slate-800 text-teal-300 border border-slate-700 flex items-center justify-center font-bold text-[11px]"
                >
                  {r.bobCollapsedState}
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
        💡 <strong>Bob's Measurement:</strong> If Bob chooses the same basis as Alice, he receives Alice's exact bit with 100% fidelity (without noise/Eve). In a different basis, projection yields 50/50 outcomes.
      </p>
    </div>
  );
};
