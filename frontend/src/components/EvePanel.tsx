import React from 'react';
import { Eye, ShieldAlert, ShieldCheck, Binary, Compass, AlertTriangle } from 'lucide-react';
import { QubitRecord } from '../types/bb84';

interface EvePanelProps {
  eveEnabled: boolean;
  records: QubitRecord[];
}

export const EvePanel: React.FC<EvePanelProps> = ({ eveEnabled, records }) => {
  return (
    <div className={`glass-card p-5 rounded-2xl border shadow-xl flex flex-col h-full transition-all ${
      eveEnabled ? 'border-rose-500/40 bg-rose-950/10' : 'border-slate-800'
    }`}>
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            eveEnabled ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-800 text-slate-500'
          }`}>
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              EVE <span className="text-rose-400 font-normal">[Eavesdropper]</span>
            </h4>
            <p className="text-[11px] text-slate-400">
              {eveEnabled ? 'Active Intercept & Resend Attack' : 'Passive / Inactive'}
            </p>
          </div>
        </div>
        
        <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded flex items-center gap-1.5 ${
          eveEnabled
            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
        }`}>
          {eveEnabled ? (
            <>
              <ShieldAlert className="w-3.5 h-3.5" />
              EVE ON
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5" />
              EVE OFF
            </>
          )}
        </span>
      </div>

      {/* Content */}
      {eveEnabled ? (
        <div className="mt-4 space-y-3.5 flex-1 font-mono text-xs">
          
          {/* Attack Mode */}
          <div className="flex items-center justify-between bg-rose-950/30 p-2.5 rounded-xl border border-rose-900/50 text-[11px] font-sans">
            <span className="font-semibold text-rose-300 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              Attack Strategy:
            </span>
            <span className="font-mono text-rose-200 font-bold">Intercept & Resend</span>
          </div>

          {/* Eve Bases */}
          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-1.5 text-[11px] font-sans font-semibold">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Compass className="w-3.5 h-3.5 text-rose-400" />
                Eve Measurement Bases
              </span>
              <span>Random (+ / ×)</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto py-1">
              {records.map((r, i) => (
                <span
                  key={i}
                  className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${
                    r.eveBasis === '+'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                  }`}
                >
                  {r.eveBasis === 'x' ? '×' : r.eveBasis || '—'}
                </span>
              ))}
            </div>
          </div>

          {/* Eve Measurements */}
          <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-1.5 text-[11px] font-sans font-semibold">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Binary className="w-3.5 h-3.5 text-rose-400" />
                Eve Measured Bits
              </span>
              <span>0 or 1</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto py-1">
              {records.map((r, i) => (
                <span
                  key={i}
                  className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${
                    r.eveBit === 1 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {r.eveBit !== undefined ? r.eveBit : '—'}
                </span>
              ))}
            </div>
          </div>

        </div>
      ) : (
        <div className="mt-6 flex-1 flex flex-col items-center justify-center text-center p-6 bg-slate-900/40 rounded-xl border border-slate-800/60">
          <ShieldCheck className="w-12 h-12 text-emerald-400/60 mb-3" />
          <h5 className="font-bold text-slate-200 text-sm">Channel Is Uncompromised</h5>
          <p className="text-xs text-slate-400 max-w-xs mt-1.5 leading-relaxed">
            Eve is currently disabled. Photons pass through the quantum channel directly from Alice to Bob without measurement disturbance.
          </p>
        </div>
      )}

      {/* Explanation */}
      <p className="mt-4 text-[11px] text-slate-400 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/60 leading-relaxed font-sans">
        ⚠️ <strong>Measurement Disturbance:</strong> Because quantum states cannot be cloned without measurement, Eve's wrong basis choices collapse the qubit state, introducing an unavoidable <strong className="text-rose-300 font-mono">~25% error rate</strong> on matching bases.
      </p>
    </div>
  );
};
