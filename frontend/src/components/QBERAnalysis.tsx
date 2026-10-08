import React from 'react';
import { Activity, AlertTriangle, ShieldCheck, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { SimulationResult } from '../types/bb84';

interface QBERAnalysisProps {
  result: SimulationResult | null;
}

export const QBERAnalysis: React.FC<QBERAnalysisProps> = ({ result }) => {
  if (!result) return null;

  const { qber, config, errorCount, testSampleIndices, isSecure, testedAliceBits, testedBobBits } = result;

  return (
    <div className="glass-card p-6 rounded-2xl border border-slate-800 shadow-xl mb-8 relative overflow-hidden">
      
      {/* Background Interactive Subtle Waveform */}
      <div className="absolute -bottom-4 left-0 right-0 h-24 opacity-15 pointer-events-none overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 1000 100" preserveAspectRatio="none">
          <path
            d={
              isSecure
                ? "M0,50 Q125,25 250,50 T500,50 T750,50 T1000,50 L1000,100 L0,100 Z"
                : "M0,50 L100,20 L200,85 L300,10 L400,90 L500,25 L600,80 L700,15 L800,75 L900,30 L1000,50 L1000,100 L0,100 Z"
            }
            fill={isSecure ? "#10B981" : "#F43F5E"}
          />
        </svg>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              Quantum Bit Error Rate (QBER) Analysis
            </h3>
            <p className="text-xs text-slate-400">
              Parameter estimation via public verification of a random subset of sifted bits
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`px-3.5 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-bold ${
          isSecure
            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
            : 'bg-rose-500/10 text-rose-300 border-rose-500/30 animate-pulse'
        }`}>
          {isSecure ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : <ShieldAlert className="w-4 h-4 text-rose-400" />}
          {isSecure ? 'SECURITY TEST PASSED' : 'SECURITY TEST FAILED'}
        </div>
      </div>

      {/* Main QBER Metrics Grid */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        
        {/* Large QBER Gauge Card */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
          isSecure ? 'bg-emerald-950/10 border-emerald-500/20' : 'bg-rose-950/10 border-rose-500/20'
        }`}>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1 font-sans">
              Observed QBER
            </span>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl sm:text-5xl font-black font-mono tracking-tight ${
                isSecure ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {qber.toFixed(1)}%
              </span>
              <span className="text-xs text-slate-400 font-mono">
                / Threshold {config.qberThreshold}%
              </span>
            </div>
          </div>

          {/* Progress Bar Visualizer */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
              <span>0% (Ideal)</span>
              <span className="text-purple-400 font-bold">Limit: {config.qberThreshold}%</span>
              <span>50% (Max)</span>
            </div>
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800 relative">
              {/* Threshold mark line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-purple-400 z-10"
                style={{ left: `${(config.qberThreshold / 50) * 100}%` }}
                title="Security Threshold"
              />
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isSecure ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-amber-500 to-rose-500'
                }`}
                style={{ width: `${Math.min(100, (qber / 50) * 100)}%` }}
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-300">
            {isSecure ? (
              <span className="text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                Low observed QBER — no significant eavesdropping detected.
              </span>
            ) : (
              <span className="text-rose-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                High QBER detected — possible eavesdropping or noise.
              </span>
            )}
          </div>
        </div>

        {/* Public Test Sample Breakdown */}
        <div className="lg:col-span-2 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-sans flex items-center gap-1.5">
                Public Test Subset Comparison
                <span className="text-[11px] text-slate-400 font-normal font-mono">
                  ({testSampleIndices.length} sample bits compared)
                </span>
              </h4>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-amber-500/20">
                Errors: {errorCount}
              </span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {/* Alice Tested */}
              <div className="flex items-center gap-2">
                <span className="w-24 text-[11px] font-sans text-cyan-400 shrink-0 font-semibold">Alice Sample:</span>
                <div className="flex flex-wrap gap-1">
                  {testedAliceBits.map((b, idx) => (
                    <span
                      key={idx}
                      className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${
                        b !== testedBobBits[idx]
                          ? 'bg-rose-500 text-white font-black animate-pulse'
                          : 'bg-slate-800 text-slate-200'
                      }`}
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bob Tested */}
              <div className="flex items-center gap-2">
                <span className="w-24 text-[11px] font-sans text-teal-400 shrink-0 font-semibold">Bob Sample:</span>
                <div className="flex flex-wrap gap-1">
                  {testedBobBits.map((b, idx) => (
                    <span
                      key={idx}
                      className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${
                        b !== testedAliceBits[idx]
                          ? 'bg-rose-500 text-white font-black animate-pulse'
                          : 'bg-slate-800 text-slate-200'
                      }`}
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p className="mt-4 text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed font-sans">
            🔒 <strong>Permanent Discard Rule:</strong> All bits publicly tested above are permanently removed from the remaining sifted key to ensure Eve gains zero knowledge about the final secret key.
          </p>
        </div>

      </div>

    </div>
  );
};
