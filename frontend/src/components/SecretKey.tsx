import React, { useState } from 'react';
import { Key, Copy, Check, ShieldCheck, AlertOctagon } from 'lucide-react';
import { SimulationResult } from '../types/bb84';

interface SecretKeyProps {
  result: SimulationResult | null;
}

export const SecretKey: React.FC<SecretKeyProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const { isSecure, aliceFinalKey, bobFinalKey } = result;

  const handleCopy = () => {
    if (isSecure && aliceFinalKey.length > 0) {
      const keyStr = aliceFinalKey.join('');
      navigator.clipboard.writeText(keyStr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className={`glass-card p-6 rounded-2xl border shadow-xl mb-8 transition-all ${
      isSecure ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-rose-500/30 bg-rose-950/10'
    }`}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isSecure ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
          }`}>
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              FINAL SHARED SECRET KEY
              <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                isSecure ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
              }`}>
                {isSecure ? `${aliceFinalKey.length} BITS` : 'REJECTED'}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Unconditionally secure cryptographic key shared between Alice and Bob
            </p>
          </div>
        </div>

        {/* Copy Button */}
        {isSecure && aliceFinalKey.length > 0 && (
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Key Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-cyan-400" />
                <span>Copy Key</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Content */}
      {isSecure ? (
        <div className="mt-6 space-y-4">
          
          {/* Key Agreement Banner */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs">
            <span className="text-emerald-300 font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              ✓ KEY AGREEMENT VERIFIED — Alice and Bob share an identical secret key.
            </span>
            <span className="font-mono text-emerald-400 font-bold">100% Fidelity</span>
          </div>

          {/* Key Displays */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            
            {/* Alice Key */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div className="text-[11px] font-sans font-bold text-cyan-400 mb-1.5 flex items-center justify-between">
                <span>Alice Final Key:</span>
                <span>{aliceFinalKey.length} bits</span>
              </div>
              <div className="text-sm font-bold tracking-widest text-emerald-300 bg-slate-950 p-3 rounded-lg border border-slate-800/80 break-all select-all">
                {aliceFinalKey.join('')}
              </div>
            </div>

            {/* Bob Key */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div className="text-[11px] font-sans font-bold text-teal-400 mb-1.5 flex items-center justify-between">
                <span>Bob Final Key:</span>
                <span>{bobFinalKey.length} bits</span>
              </div>
              <div className="text-sm font-bold tracking-widest text-emerald-300 bg-slate-950 p-3 rounded-lg border border-slate-800/80 break-all select-all">
                {bobFinalKey.join('')}
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="mt-6 p-6 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-center flex flex-col items-center">
          <AlertOctagon className="w-12 h-12 text-rose-400 mb-3 animate-bounce" />
          <h4 className="text-lg font-black text-rose-300 tracking-wide uppercase">
            ⚠ KEY REJECTED DUE TO HIGH QBER
          </h4>
          <p className="mt-2 text-xs text-slate-300 max-w-lg leading-relaxed font-sans">
            The observed Quantum Bit Error Rate exceeded the security threshold. Alice and Bob have aborted key agreement to prevent eavesdropper interception. No secret key was extracted from this transmission.
          </p>
        </div>
      )}

    </div>
  );
};
