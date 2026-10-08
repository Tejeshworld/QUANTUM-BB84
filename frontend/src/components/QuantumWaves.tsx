import React from 'react';

interface QuantumWavesProps {
  eveActive?: boolean;
}

export const QuantumWaves: React.FC<QuantumWavesProps> = ({ eveActive = false }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-25">
      <svg
        className="absolute top-1/3 left-0 w-[200%] h-48 -translate-y-1/2 animate-[wave_18s_linear_infinite]"
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d={
            eveActive
              ? "M0,35 C180,95 360,0 540,60 C720,110 900,10 1080,75 C1260,115 1440,25 1620,60 L1620,120 L0,120 Z"
              : "M0,45 C240,85 480,15 720,55 C960,95 1200,25 1440,55 C1680,85 1920,25 2160,55 L2160,120 L0,120 Z"
          }
          stroke="url(#quantum-wave-grad-1)"
          strokeWidth="1.2"
          strokeDasharray="6 4"
          fill="none"
        />
        <path
          d="M0,65 C220,25 440,85 660,45 C880,15 1100,75 1320,45 C1540,15 1760,75 1980,45 L1980,120 L0,120 Z"
          stroke="url(#quantum-wave-grad-2)"
          strokeWidth="1"
          fill="none"
        />
        <defs>
          <linearGradient id="quantum-wave-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#818CF8" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#C084FC" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="quantum-wave-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
