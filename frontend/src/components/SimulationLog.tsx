import React from 'react';
import { Terminal, Trash2, CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { LogEntry } from '../types/bb84';

interface SimulationLogProps {
  logs: LogEntry[];
  onClearLogs: () => void;
}

export const SimulationLog: React.FC<SimulationLogProps> = ({ logs, onClearLogs }) => {
  return (
    <div className="glass-card p-6 rounded-2xl border border-slate-800 shadow-xl mb-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              SIMULATION CONSOLE LOG
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </h4>
            <p className="text-[11px] text-slate-400">Real-time quantum protocol events and reconciliation trace</p>
          </div>
        </div>

        {logs.length > 0 && (
          <button
            onClick={onClearLogs}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
            title="Clear Console Logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>

      {/* Terminal View */}
      <div className="mt-4 bg-slate-950 p-4 rounded-xl border border-slate-800/80 font-mono text-xs max-h-56 overflow-y-auto space-y-2">
        {logs.length > 0 ? (
          logs.map((log) => {
            let textColor = 'text-slate-300';
            let Icon = Info;
            if (log.type === 'success') {
              textColor = 'text-emerald-400';
              Icon = CheckCircle2;
            } else if (log.type === 'warning') {
              textColor = 'text-amber-400';
              Icon = AlertTriangle;
            } else if (log.type === 'danger') {
              textColor = 'text-rose-400';
              Icon = AlertCircle;
            }

            return (
              <div key={log.id} className="flex items-start gap-2.5 leading-relaxed">
                <span className="text-slate-500 text-[11px] shrink-0 font-sans">
                  [{log.timestamp}]
                </span>
                <Icon className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${textColor}`} />
                <span className={`${textColor} break-words`}>{log.message}</span>
              </div>
            );
          })
        ) : (
          <div className="text-slate-600 italic">No console logs available. Run a simulation to trace events.</div>
        )}
      </div>

    </div>
  );
};
