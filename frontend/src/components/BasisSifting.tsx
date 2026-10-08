import React from 'react';
import { KeyRound, Check, X, Layers } from 'lucide-react';
import { SimulationResult } from '../types/bb84';

interface BasisSiftingProps {
  result: SimulationResult | null;
}

export const BasisSifting: React.FC<BasisSiftingProps> = ({ result }) => {
  if (!result) return null;

  const { records, matchingIndices, discardedIndices, aliceSiftedKey, bobSiftedKey } = result;

  return (
    <div id="sifting" className="glass-card p-6 rounded-2xl border border-slate-800 shadow-xl mb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              Public Basis Sifting & Reconciliation
            </h3>
            <p className="text-xs text-slate-400">
              Alice and Bob publicly compare bases (never key bits) and keep only matching instances
            </p>
          </div>
        </div>

        {/* Quick Sifting Stats */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-emerald-400">
            Matched: <strong>{matchingIndices.length}</strong> ({((matchingIndices.length / records.length) * 100).toFixed(0)}%)
          </div>
          <div className="bg-slate-800 px-3 py-1.5 rounded-lg text-slate-400 border border-slate-700">
            Discarded: <strong>{discardedIndices.length}</strong>
          </div>
        </div>
      </div>

      {/* Side-by-side Basis Match Table Stream */}
      <div className="mt-5">
        <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
          <span>Per-Qubit Basis Comparison (Public Classical Channel)</span>
          <span className="text-[11px] text-slate-400 font-normal">Scroll horizontally if necessary</span>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="inline-flex flex-col gap-1.5 min-w-full font-mono text-xs">
            
            {/* Position Row */}
            <div className="flex items-center gap-1.5 text-slate-400 font-sans text-[11px]">
              <span className="w-20 font-bold shrink-0">Position</span>
              {records.map((r) => (
                <span key={r.index} className="w-7 text-center shrink-0 text-slate-500 font-mono">
                  {r.index}
                </span>
              ))}
            </div>

            {/* Alice Bases */}
            <div className="flex items-center gap-1.5">
              <span className="w-20 text-[11px] font-sans font-bold text-cyan-400 shrink-0">Alice Basis</span>
              {records.map((r, i) => (
                <span
                  key={i}
                  className="w-7 h-7 rounded flex items-center justify-center shrink-0 font-bold bg-slate-900 border border-slate-800 text-purple-300"
                >
                  {r.aliceBasis === 'x' ? '×' : '+'}
                </span>
              ))}
            </div>

            {/* Bob Bases */}
            <div className="flex items-center gap-1.5">
              <span className="w-20 text-[11px] font-sans font-bold text-teal-400 shrink-0">Bob Basis</span>
              {records.map((r, i) => (
                <span
                  key={i}
                  className="w-7 h-7 rounded flex items-center justify-center shrink-0 font-bold bg-slate-900 border border-slate-800 text-teal-300"
                >
                  {r.bobBasis === 'x' ? '×' : '+'}
                </span>
              ))}
            </div>

            {/* Match Status */}
            <div className="flex items-center gap-1.5">
              <span className="w-20 text-[11px] font-sans font-bold text-slate-300 shrink-0">Match?</span>
              {records.map((r, i) => (
                <span
                  key={i}
                  className={`w-7 h-7 rounded flex items-center justify-center shrink-0 font-bold text-xs ${
                    r.basisMatched
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                      : 'bg-slate-900 text-slate-600 border border-slate-800'
                  }`}
                >
                  {r.basisMatched ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                </span>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Sifted Keys Result Box */}
      <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Alice Sifted Key */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-cyan-400 font-sans flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Alice Sifted Key
            </span>
            <span className="font-mono text-slate-400">{aliceSiftedKey.length} bits</span>
          </div>
          <div className="font-mono text-sm tracking-widest text-slate-200 bg-slate-950 p-2.5 rounded-lg border border-slate-800 break-all">
            {aliceSiftedKey.length > 0 ? aliceSiftedKey.join('') : '(empty)'}
          </div>
        </div>

        {/* Bob Sifted Key */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-teal-400 font-sans flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Bob Sifted Key
            </span>
            <span className="font-mono text-slate-400">{bobSiftedKey.length} bits</span>
          </div>
          <div className="font-mono text-sm tracking-widest text-slate-200 bg-slate-950 p-2.5 rounded-lg border border-slate-800 break-all">
            {bobSiftedKey.length > 0 ? bobSiftedKey.join('') : '(empty)'}
          </div>
        </div>

      </div>

    </div>
  );
};
