import React from 'react';

export const QuantumCircuitPattern: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.05] select-none">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="quantum-circuit-grid" width="400" height="240" patternUnits="userSpaceOnUse">
            {/* Qubit Rail 0 */}
            <line x1="0" y1="40" x2="400" y2="40" stroke="#38BDF8" strokeWidth="1" />
            <text x="12" y="36" fill="#38BDF8" fontSize="9" fontFamily="monospace">|q₀⟩</text>
            {/* Gate H */}
            <rect x="80" y="28" width="24" height="24" rx="4" fill="#0F172A" stroke="#38BDF8" strokeWidth="1" />
            <text x="88" y="44" fill="#38BDF8" fontSize="11" fontWeight="bold" fontFamily="monospace">H</text>

            {/* Qubit Rail 1 */}
            <line x1="0" y1="120" x2="400" y2="120" stroke="#818CF8" strokeWidth="1" />
            <text x="12" y="116" fill="#818CF8" fontSize="9" fontFamily="monospace">|q₁⟩</text>
            {/* CNOT Control & Target */}
            <line x1="180" y1="40" x2="180" y2="120" stroke="#818CF8" strokeWidth="1" />
            <circle cx="180" cy="40" r="4" fill="#38BDF8" />
            <circle cx="180" cy="120" r="8" fill="#0F172A" stroke="#818CF8" strokeWidth="1" />
            <line x1="174" y1="120" x2="186" y2="120" stroke="#818CF8" strokeWidth="1" />
            <line x1="180" y1="114" x2="180" y2="126" stroke="#818CF8" strokeWidth="1" />

            {/* Qubit Rail 2 */}
            <line x1="0" y1="200" x2="400" y2="200" stroke="#C084FC" strokeWidth="1" />
            <text x="12" y="196" fill="#C084FC" fontSize="9" fontFamily="monospace">|q₂⟩</text>
            {/* Phase Gate S */}
            <rect x="260" y="188" width="24" height="24" rx="4" fill="#0F172A" stroke="#C084FC" strokeWidth="1" />
            <text x="268" y="204" fill="#C084FC" fontSize="11" fontWeight="bold" fontFamily="monospace">X</text>

            {/* Measurement Box */}
            <rect x="340" y="108" width="28" height="24" rx="4" fill="#0F172A" stroke="#38BDF8" strokeWidth="1" />
            <path d="M346,126 A8,8 0 0,1 362,126" stroke="#38BDF8" strokeWidth="1" fill="none" />
            <line x1="354" y1="126" x2="360" y2="114" stroke="#38BDF8" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#quantum-circuit-grid)" />
      </svg>
    </div>
  );
};
