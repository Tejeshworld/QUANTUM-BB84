import React from 'react';
import { ShieldAlert, ShieldCheck, Lock } from 'lucide-react';
import { BlochSphere } from './BlochSphere';

export const SecuritySection: React.FC = () => {
  return (
    <div id="security" className="glass-card p-8 rounded-3xl border border-slate-800 shadow-2xl mb-8 relative overflow-hidden">
      
      {/* Background Decorative Mini Bloch Sphere */}
      <div className="absolute -left-10 -bottom-10 opacity-20 pointer-events-none -z-10 hidden md:block">
        <BlochSphere size="md" glowColor="#a855f7" />
      </div>

      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
          Quantum Mechanics & Cryptanalysis
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-3">
          Why Can Eve Always Be Detected?
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Security in QKD is founded on physical laws of nature, not computational hardness.
        </p>
      </div>

      {/* Comparison Grid: Safe vs Intercepted */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Without Eve Card */}
        <div className="bg-emerald-950/10 p-6 rounded-2xl border border-emerald-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Without Eve (Safe Channel)
                </h4>
                <span className="text-xs text-emerald-400 font-mono">Alice ──────► Bob</span>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed font-sans">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Photons travel undisturbed directly to Bob's single-photon detectors.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Whenever Bob selects Alice's basis, Bob measures Alice's exact bit with <strong>100% fidelity</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Observed <strong>QBER ≈ 0.0%</strong> (or only minor fiber noise). Key agreement succeeds.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* With Eve Card */}
        <div className="bg-rose-950/10 p-6 rounded-2xl border border-rose-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  With Eve (Intercept & Resend)
                </h4>
                <span className="text-xs text-rose-400 font-mono">Alice ───► Eve ───► Bob</span>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed font-sans">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>By the <strong>No-Cloning Theorem</strong>, Eve cannot duplicate the photon without measuring it.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>50% of the time, Eve chooses the wrong basis, collapsing the state and introducing a 50% measurement error for Bob.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>Net Error Rate: <strong>50% × 50% = 25% QBER</strong> on sifted keys, exceeding the 11% threshold and alerting Alice & Bob!</span>
              </li>
            </ul>
          </div>
        </div>

      </div>

      {/* Scientific Notes & Real-World Simplification */}
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2.5 text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
          <Lock className="w-4 h-4 text-cyan-400" />
          Educational Notes & Real-World QKD Deployments
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400 leading-relaxed">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
            <h5 className="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
              1. Classical Authentication
            </h5>
            <p>
              In real deployments, the classical public channel must be authenticated (e.g., using Carter-Wegman MACs) to prevent active Man-in-the-Middle (MITM) attacks.
            </p>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
            <h5 className="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
              2. Information Reconciliation
            </h5>
            <p>
              Real optical fibers have baseline noise. Classical error correction algorithms (like Cascade or LDPC) correct natural transmission errors without leaking excessive bits.
            </p>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
            <h5 className="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
              3. Privacy Amplification
            </h5>
            <p>
              Universal 2-hashing compresses the reconciled key into a shorter, unconditionally secure final key, reducing any partial information Eve might have gained to virtually zero.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
