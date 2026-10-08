import React from 'react';
import { Cpu, CheckCircle2, XCircle, Key, AlertTriangle, ShieldCheck, ShieldAlert } from 'lucide-react';
import { SimulationResult } from '../types/bb84';

interface ResultsDashboardProps {
  result: SimulationResult | null;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result }) => {
  if (!result) return null;

  const { records, matchingIndices, discardedIndices, aliceFinalKey, errorCount, qber, isSecure } = result;

  const kpis = [
    {
      title: 'TOTAL QUBITS',
      value: records.length,
      sub: 'Simulated Photons',
      color: 'text-cyan-400',
      border: 'border-cyan-500/20',
      icon: Cpu,
    },
    {
      title: 'MATCHING BASES',
      value: matchingIndices.length,
      sub: `${((matchingIndices.length / records.length) * 100).toFixed(0)}% Sifted`,
      color: 'text-purple-400',
      border: 'border-purple-500/20',
      icon: CheckCircle2,
    },
    {
      title: 'DISCARDED QUBITS',
      value: discardedIndices.length,
      sub: 'Basis Disagreement',
      color: 'text-slate-400',
      border: 'border-slate-800',
      icon: XCircle,
    },
    {
      title: 'DETECTED ERRORS',
      value: errorCount,
      sub: 'Sample Inconsistencies',
      color: errorCount > 0 ? 'text-rose-400' : 'text-emerald-400',
      border: errorCount > 0 ? 'border-rose-500/20' : 'border-emerald-500/20',
      icon: AlertTriangle,
    },
    {
      title: 'OBSERVED QBER',
      value: `${qber.toFixed(1)}%`,
      sub: isSecure ? 'Below Threshold' : 'Threshold Exceeded',
      color: isSecure ? 'text-emerald-400' : 'text-rose-400',
      border: isSecure ? 'border-emerald-500/20' : 'border-rose-500/20',
      icon: isSecure ? ShieldCheck : ShieldAlert,
    },
    {
      title: 'FINAL KEY LENGTH',
      value: isSecure ? `${aliceFinalKey.length} bits` : '0 bits',
      sub: isSecure ? 'Secure Shared Key' : 'Key Aborted',
      color: isSecure ? 'text-emerald-400' : 'text-rose-400',
      border: isSecure ? 'border-emerald-500/20' : 'border-rose-500/20',
      icon: Key,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-8">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div
            key={idx}
            className={`glass-card p-4 rounded-xl border ${kpi.border} flex flex-col justify-between transition-all hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">
                {kpi.title}
              </span>
              <Icon className={`w-3.5 h-3.5 ${kpi.color}`} />
            </div>
            <div>
              <div className={`text-xl sm:text-2xl font-black font-mono tracking-tight ${kpi.color}`}>
                {kpi.value}
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                {kpi.sub}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
