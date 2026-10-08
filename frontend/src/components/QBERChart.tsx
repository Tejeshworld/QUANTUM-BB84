import React from 'react';
import { BarChart3 } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { HistoryRun } from '../types/bb84';

interface QBERChartProps {
  history: HistoryRun[];
  threshold: number;
}

export const QBERChart: React.FC<QBERChartProps> = ({ history, threshold }) => {
  const chartData = history.map((h) => ({
    name: `Run #${h.runId}`,
    qber: parseFloat(h.qber.toFixed(1)),
    eve: h.eveEnabled ? 'Eve ON' : 'Eve OFF',
    isSecure: h.isSecure,
  }));

  return (
    <div className="glass-card p-6 rounded-2xl border border-slate-800 shadow-xl mb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              Multi-Run QBER Historical Comparison
              <span className="text-xs font-mono font-normal text-slate-400">
                ({history.length} runs recorded)
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Observing statistical divergence in error rates between unintercepted and intercepted channels
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-cyan-400" />
            <span className="text-slate-300">Observed QBER %</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-purple-400" />
            <span className="text-purple-300">Threshold ({threshold}%)</span>
          </div>
        </div>
      </div>

      {/* Recharts Line Chart */}
      <div className="mt-6 h-64 w-full">
        {history.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#64748B"
                tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'monospace' }}
              />
              <YAxis
                stroke="#64748B"
                domain={[0, 50]}
                unit="%"
                tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'monospace' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#F8FAFC',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                }}
              />
              <ReferenceLine
                y={threshold}
                stroke="#A855F7"
                strokeDasharray="4 4"
                label={{
                  value: `Threshold ${threshold}%`,
                  fill: '#A855F7',
                  fontSize: 10,
                  position: 'insideTopRight',
                }}
              />
              <Line
                type="monotone"
                dataKey="qber"
                stroke="#38BDF8"
                strokeWidth={3}
                dot={{ fill: '#38BDF8', r: 5, strokeWidth: 2, stroke: '#0B0F19' }}
                activeDot={{ r: 7, fill: '#38BDF8', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500 text-xs font-sans">
            Execute simulations to populate the comparison chart.
          </div>
        )}
      </div>

    </div>
  );
};
