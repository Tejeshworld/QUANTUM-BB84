import React from 'react';
import { Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#060913] py-10 px-4 lg:px-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-200 tracking-wide">
              BB84 Quantum Key Distribution Simulator
            </span>
            <p className="text-[11px] text-slate-500">
              Classical simulation of single-photon polarization state exchange & eavesdropper detection
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-center md:text-right max-w-md text-[11px] text-slate-500 leading-relaxed font-sans">
          This project is an educational classical simulation modeling quantum projection and measurement disturbance principles. It does not perform physical quantum hardware computation.
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-slate-900 text-center text-[11px] text-slate-600">
        © 2026 BB84 QKD Simulator. Open source under MIT License.
      </div>
    </footer>
  );
};
