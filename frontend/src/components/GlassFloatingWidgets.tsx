import React, { useEffect, useState } from 'react';
import { Atom, Radio, KeyRound } from 'lucide-react';

export const GlassFloatingWidgets: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none hidden xl:block">
      
      {/* Widget 1: State vector readout (Upper Left) */}
      <div
        className="absolute top-[22%] left-6 p-3 rounded-xl bg-slate-900/30 border border-cyan-500/10 backdrop-blur-md text-[10px] font-mono text-cyan-300/40 shadow-lg shadow-black/20"
        style={{
          transform: `translate3d(0, ${scrollY * 0.08}px, 0)`,
        }}
      >
        <div className="flex items-center gap-1.5 mb-1 font-bold text-cyan-400/50 uppercase">
          <Atom className="w-3 h-3 text-cyan-400/50" />
          <span>POLARIZATION</span>
        </div>
        <div>|ψ⟩ = cos(θ)|0⟩ + e^{'{iφ}'}sin(θ)|1⟩</div>
        <div className="text-slate-500 text-[9px] mt-0.5">ORTHOGONAL BASIS: {`{+, ×}`}</div>
      </div>

      {/* Widget 2: Channel detector readout (Middle Right) */}
      <div
        className="absolute top-[52%] right-6 p-3 rounded-xl bg-slate-900/30 border border-purple-500/10 backdrop-blur-md text-[10px] font-mono text-purple-300/40 shadow-lg shadow-black/20"
        style={{
          transform: `translate3d(0, ${scrollY * -0.06}px, 0)`,
        }}
      >
        <div className="flex items-center gap-1.5 mb-1 font-bold text-purple-400/50 uppercase">
          <Radio className="w-3 h-3 text-purple-400/50" />
          <span>FIBER CHANNEL</span>
        </div>
        <div>OPTICAL LOSS: &lt; 0.2 dB/km</div>
        <div className="text-slate-500 text-[9px] mt-0.5">DARK COUNT RATE: 10⁻⁶/pulse</div>
      </div>

      {/* Widget 3: Sifting Metric HUD (Lower Left) */}
      <div
        className="absolute top-[78%] left-8 p-3 rounded-xl bg-slate-900/30 border border-emerald-500/10 backdrop-blur-md text-[10px] font-mono text-emerald-300/40 shadow-lg shadow-black/20"
        style={{
          transform: `translate3d(0, ${scrollY * 0.1}px, 0)`,
        }}
      >
        <div className="flex items-center gap-1.5 mb-1 font-bold text-emerald-400/50 uppercase">
          <KeyRound className="w-3 h-3 text-emerald-400/50" />
          <span>SIFTING EFFICIENCY</span>
        </div>
        <div>THEORETICAL YIELD: ~50.0%</div>
        <div className="text-slate-500 text-[9px] mt-0.5">ASYMPTOTIC QBER: &lt; 11.0%</div>
      </div>

    </div>
  );
};
