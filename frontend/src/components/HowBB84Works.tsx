import React from 'react';
import { Binary, Compass, Atom, UserCheck, KeyRound, CheckCircle, Activity, ShieldCheck } from 'lucide-react';

export const HowBB84Works: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Alice Generates Classical Bits',
      desc: 'Alice creates a random sequence of raw classical bits (0s and 1s) using a true random number generator.',
      icon: Binary,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
    },
    {
      num: '02',
      title: 'Alice Selects Random Bases',
      desc: 'Alice randomly assigns a preparation basis to each bit: Rectilinear (+) or Diagonal (×).',
      icon: Compass,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      num: '03',
      title: 'Alice Encodes Single Qubits',
      desc: 'Alice prepares single photons in polarized states: |0⟩, |1⟩ in the + basis, or |+⟩, |−⟩ in the × basis.',
      icon: Atom,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10 border-sky-500/20',
    },
    {
      num: '04',
      title: 'Bob Selects Measurement Bases',
      desc: 'Bob independently and randomly chooses a measurement basis (+ or ×) for each incoming photon.',
      icon: UserCheck,
      color: 'text-teal-400',
      bg: 'bg-teal-500/10 border-teal-500/20',
    },
    {
      num: '05',
      title: 'Alice & Bob Publicly Compare Bases',
      desc: 'Over a public classical channel, Alice and Bob announce ONLY their chosen bases, never their actual bits.',
      icon: KeyRound,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      num: '06',
      title: 'They Sift and Retain Matching Bases',
      desc: 'They discard all positions where their bases disagreed (~50%). The remaining bits form the Sifted Key.',
      icon: CheckCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      num: '07',
      title: 'Estimate Quantum Bit Error Rate (QBER)',
      desc: 'They compare a public sample of sifted bits to estimate channel errors. The sample is discarded afterward.',
      icon: Activity,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      num: '08',
      title: 'Accept or Reject Shared Key',
      desc: 'If QBER ≤ 11%, the remaining sifted bits form the secure shared key. If QBER > 11%, the transmission is aborted.',
      icon: ShieldCheck,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
    },
  ];

  return (
    <div id="how-it-works" className="glass-card p-8 rounded-3xl border border-slate-800 shadow-2xl mb-8">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          Protocol Workflow
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-3">
          How the BB84 Protocol Works
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Invented in 1984 by Charles Bennett and Gilles Brassard, BB84 leverages quantum measurement collapse for provable cryptographic key exchange.
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between hover:border-slate-700 transition-all hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    STEP {s.num}
                  </span>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${s.bg}`}>
                    <Icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                </div>
                <h4 className="text-sm font-bold text-slate-100 mb-1.5 font-sans">
                  {s.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {s.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
