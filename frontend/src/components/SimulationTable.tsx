import React, { useState } from 'react';
import { Table, Check, X, AlertTriangle } from 'lucide-react';
import { QubitRecord } from '../types/bb84';

interface SimulationTableProps {
  records: QubitRecord[];
  eveEnabled: boolean;
}

export const SimulationTable: React.FC<SimulationTableProps> = ({ records, eveEnabled }) => {
  const [filter, setFilter] = useState<'all' | 'matched' | 'discarded' | 'errors'>('all');

  const filteredRecords = records.filter((r) => {
    if (filter === 'matched') return r.basisMatched;
    if (filter === 'discarded') return !r.basisMatched;
    if (filter === 'errors') return r.isError;
    return true;
  });

  return (
    <div className="glass-card p-6 rounded-2xl border border-slate-800 shadow-xl mb-8">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Table className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              Comprehensive Qubit Simulation Table
              <span className="text-xs font-mono font-normal text-slate-400">
                ({filteredRecords.length} / {records.length} shown)
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Detailed step-by-step state collapse, eavesdropping intercept, and measurement outcomes
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg transition-all ${
              filter === 'all' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Qubits
          </button>
          <button
            onClick={() => setFilter('matched')}
            className={`px-3 py-1 rounded-lg transition-all ${
              filter === 'matched' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Matching Bases
          </button>
          <button
            onClick={() => setFilter('discarded')}
            className={`px-3 py-1 rounded-lg transition-all ${
              filter === 'discarded' ? 'bg-slate-700 text-slate-200 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Discarded
          </button>
          {eveEnabled && (
            <button
              onClick={() => setFilter('errors')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filter === 'errors' ? 'bg-rose-500 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Errors Only
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/60">
        <table className="w-full text-left border-collapse text-xs font-mono">
          
          {/* Table Head */}
          <thead>
            <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800 text-[11px] font-sans font-bold uppercase tracking-wider">
              <th className="py-3 px-3 text-center">#</th>
              <th className="py-3 px-3 text-center text-cyan-400">Alice Bit</th>
              <th className="py-3 px-3 text-center text-cyan-400">Alice Basis</th>
              <th className="py-3 px-3 text-center text-cyan-400">Alice State</th>
              <th className="py-3 px-3 text-center text-rose-400">Eve Basis</th>
              <th className="py-3 px-3 text-center text-rose-400">Eve Bit</th>
              <th className="py-3 px-3 text-center text-rose-400">Eve State</th>
              <th className="py-3 px-3 text-center text-teal-400">Bob Basis</th>
              <th className="py-3 px-3 text-center text-teal-400">Bob Bit</th>
              <th className="py-3 px-3 text-center text-teal-400">Bob State</th>
              <th className="py-3 px-3 text-center">Match?</th>
              <th className="py-3 px-3 text-center">Role / Status</th>
              <th className="py-3 px-3 text-center text-amber-400">Error?</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-800/50">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((r) => {
                const isMatch = r.basisMatched;
                const isErr = r.isError;
                const isTest = r.isTestBit;

                let rowBg = 'hover:bg-slate-900/40';
                if (isErr) {
                  rowBg = 'bg-rose-950/20 hover:bg-rose-950/30';
                } else if (isMatch) {
                  rowBg = 'bg-emerald-950/10 hover:bg-emerald-950/20';
                } else {
                  rowBg = 'opacity-60 hover:opacity-90';
                }

                return (
                  <tr key={r.index} className={`transition-colors ${rowBg}`}>
                    
                    {/* Index */}
                    <td className="py-2.5 px-3 text-center font-bold text-slate-400">
                      {String(r.index).padStart(2, '0')}
                    </td>

                    {/* Alice Bit */}
                    <td className="py-2.5 px-3 text-center font-bold text-cyan-300">
                      <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                        {r.aliceBit}
                      </span>
                    </td>

                    {/* Alice Basis */}
                    <td className="py-2.5 px-3 text-center font-bold text-purple-300">
                      {r.aliceBasis === 'x' ? '×' : '+'}
                    </td>

                    {/* Alice State */}
                    <td className="py-2.5 px-3 text-center text-sky-300">
                      {r.aliceState}
                    </td>

                    {/* Eve Basis */}
                    <td className="py-2.5 px-3 text-center text-rose-300">
                      {r.eveBasis ? (r.eveBasis === 'x' ? '×' : '+') : '—'}
                    </td>

                    {/* Eve Bit */}
                    <td className="py-2.5 px-3 text-center text-rose-300">
                      {r.eveBit !== undefined ? r.eveBit : '—'}
                    </td>

                    {/* Eve State */}
                    <td className="py-2.5 px-3 text-center text-rose-400">
                      {r.eveResentState || '—'}
                    </td>

                    {/* Bob Basis */}
                    <td className="py-2.5 px-3 text-center font-bold text-teal-300">
                      {r.bobBasis === 'x' ? '×' : '+'}
                    </td>

                    {/* Bob Bit */}
                    <td className="py-2.5 px-3 text-center font-bold text-teal-300">
                      <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                        {r.bobBit}
                      </span>
                    </td>

                    {/* Bob Collapsed State */}
                    <td className="py-2.5 px-3 text-center text-teal-400">
                      {r.bobCollapsedState}
                    </td>

                    {/* Match? */}
                    <td className="py-2.5 px-3 text-center font-bold">
                      {isMatch ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400">
                          <Check className="w-3.5 h-3.5" /> YES
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-500">
                          <X className="w-3.5 h-3.5" /> NO
                        </span>
                      )}
                    </td>

                    {/* Role */}
                    <td className="py-2.5 px-3 text-center text-[11px] font-sans">
                      {!isMatch ? (
                        <span className="text-slate-500">Discarded</span>
                      ) : isTest ? (
                        <span className="text-purple-400 font-semibold px-2 py-0.5 rounded bg-purple-950/40 border border-purple-800/40">
                          Test Sample
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/40">
                          Final Key
                        </span>
                      )}
                    </td>

                    {/* Error? */}
                    <td className="py-2.5 px-3 text-center font-bold">
                      {!isMatch ? (
                        <span className="text-slate-600">—</span>
                      ) : isErr ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-black border border-rose-500/40">
                          <AlertTriangle className="w-3 h-3" /> YES
                        </span>
                      ) : (
                        <span className="text-emerald-400">NO</span>
                      )}
                    </td>

                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={13} className="py-8 text-center text-slate-500 font-sans text-xs">
                  No records match current filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
