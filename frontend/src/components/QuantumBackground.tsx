import React from 'react';
import { QuantumParticles } from './QuantumParticles';
import { QuantumOrbs } from './QuantumOrbs';
import { QuantumWaves } from './QuantumWaves';
import { QuantumCircuitPattern } from './QuantumCircuitPattern';
import { QuantumLabels } from './QuantumLabels';
import { GlassFloatingWidgets } from './GlassFloatingWidgets';

interface QuantumBackgroundProps {
  eveActive?: boolean;
}

export const QuantumBackground: React.FC<QuantumBackgroundProps> = ({ eveActive = false }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#060913]">
      {/* 1. Deep Space Vignette Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/60 via-[#060913] to-[#04060C]" />

      {/* 2. Quantum Circuit Grid */}
      <QuantumCircuitPattern />

      {/* 3. Floating Glass Spheres */}
      <QuantumOrbs />

      {/* 4. Sine Wave Flow Paths */}
      <QuantumWaves eveActive={eveActive} />

      {/* 5. Interactive Particle Canvas */}
      <QuantumParticles eveActive={eveActive} />

      {/* 6. Scientific Watermarks & Equations */}
      <QuantumLabels />

      {/* 7. Holographic Mini Glass Instruments */}
      <GlassFloatingWidgets />
    </div>
  );
};
