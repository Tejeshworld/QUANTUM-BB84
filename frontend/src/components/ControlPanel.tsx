import React from 'react';
import { Play, RotateCcw, ShieldAlert, ShieldCheck, Sparkles, Sliders, Waves, Activity } from 'lucide-react';
import { SimulationConfig } from '../types/bb84';

interface ControlPanelProps {
  config: SimulationConfig;
  onChangeConfig: (newConfig: SimulationConfig) => void;
  onRunSimulation: () => void;
  onGenerateOnly: () => void;
  onReset: () => void;
  isRunning: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  config,
  onChangeConfig,
  onRunSimulation,
  onGenerateOnly,
  onReset,
  isRunning,
}) => {
  const qubitOptions = [10, 20, 50, 100];

  return (
    <div id="controls" className="glass-card p-6 rounded-2xl border border-slate-800 shadow-xl mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              Simulation Controls
              <span className="text-[11px] font-normal text-slate-400 font-mono">
                [BB84 Engine]
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Configure quantum transmission parameters, adversary intercept, and channel fidelity
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onGenerateOnly}
            disabled={isRunning}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Generate Qubits
          </button>

          <button
            onClick={onRunSimulation}
            disabled={isRunning}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            {isRunning ? 'Running...' : 'Run Simulation'}
          </button>

          <button
            onClick={onReset}
            disabled={isRunning}
            className="px-3.5 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs sm:text-sm font-medium border border-slate-700/60 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Control Inputs Grid */}
      <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* 1. Number of Qubits */}
        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Number of Qubits (N)
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="1"
                max="1000"
                value={config.numQubits}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val)) {
                    onChangeConfig({
                      ...config,
                      numQubits: Math.max(1, Math.min(1000, val)),
                    });
                  } else {
                    onChangeConfig({ ...config, numQubits: 1 });
                  }
                }}
                className="w-16 px-2 py-0.5 text-xs font-mono font-bold text-center text-cyan-400 bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-1.5 mt-1">
            {qubitOptions.map((n) => (
              <button
                key={n}
                onClick={() => onChangeConfig({ ...config, numQubits: n })}
                className={`py-1 text-xs font-mono font-bold rounded-lg transition-all ${
                  config.numQubits === n
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Eavesdropper (Eve) Toggle */}
        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
          <label className="text-xs font-semibold text-slate-300 block mb-2 flex items-center justify-between">
            <span>Eavesdropper (Eve)</span>
            <span className={`text-xs font-bold font-mono ${config.eveEnabled ? 'text-rose-400' : 'text-emerald-400'}`}>
              {config.eveEnabled ? 'ON (Intercept)' : 'OFF (Safe)'}
            </span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onChangeConfig({ ...config, eveEnabled: false })}
              className={`py-1.5 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                !config.eveEnabled
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/25'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              OFF
            </button>
            <button
              onClick={() => onChangeConfig({ ...config, eveEnabled: true })}
              className={`py-1.5 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                config.eveEnabled
                  ? 'bg-rose-500 text-slate-950 font-bold shadow-md shadow-rose-500/25'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              ON
            </button>
          </div>
        </div>

        {/* 3. Channel Noise */}
        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Waves className="w-3.5 h-3.5 text-amber-400" />
              Channel Noise
            </label>
            <button
              onClick={() => onChangeConfig({ ...config, noiseEnabled: !config.noiseEnabled })}
              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                config.noiseEnabled ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {config.noiseEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={config.noiseProbability * 100}
              disabled={!config.noiseEnabled}
              onChange={(e) =>
                onChangeConfig({ ...config, noiseProbability: parseFloat(e.target.value) / 100 })
              }
              className="w-full accent-amber-400 cursor-pointer disabled:opacity-40"
            />
            <span className="text-xs font-mono font-bold text-amber-400 min-w-[36px] text-right">
              {config.noiseEnabled ? `${(config.noiseProbability * 100).toFixed(0)}%` : '0%'}
            </span>
          </div>
        </div>

        {/* 4. QBER Threshold */}
        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
          <label className="text-xs font-semibold text-slate-300 block mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              QBER Threshold
            </span>
            <span className="text-xs font-mono font-bold text-purple-400">
              {config.qberThreshold}%
            </span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="5"
              max="25"
              step="0.5"
              value={config.qberThreshold}
              onChange={(e) =>
                onChangeConfig({ ...config, qberThreshold: parseFloat(e.target.value) })
              }
              className="w-full accent-purple-400 cursor-pointer"
            />
            <span className="text-xs font-mono text-slate-400 min-w-[36px] text-right">
              {config.qberThreshold}%
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
