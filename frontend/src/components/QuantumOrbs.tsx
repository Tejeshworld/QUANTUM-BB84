import React, { useEffect, useState } from 'react';

export const QuantumOrbs: React.FC = () => {
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
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      
      {/* Orb 1: Large Cyan Glass Sphere (Top Right) */}
      <div
        className="absolute -top-24 -right-24 w-96 h-96 md:w-[480px] md:h-[480px] rounded-full border border-cyan-500/15 bg-gradient-to-br from-cyan-500/10 via-sky-500/5 to-transparent backdrop-blur-[60px] shadow-[0_0_80px_rgba(56,189,248,0.12)] transition-transform duration-100 ease-out animate-pulse-slow"
        style={{
          transform: `translate3d(0, ${scrollY * 0.12}px, 0)`,
        }}
      >
        <div className="absolute inset-8 rounded-full border border-cyan-400/10" />
      </div>

      {/* Orb 2: Purple / Indigo Glass Sphere (Middle Left) */}
      <div
        className="absolute top-[45%] -left-36 w-80 h-80 md:w-[420px] md:h-[420px] rounded-full border border-purple-500/15 bg-gradient-to-tr from-purple-500/10 via-indigo-500/5 to-transparent backdrop-blur-[60px] shadow-[0_0_80px_rgba(168,85,247,0.1)] transition-transform duration-100 ease-out"
        style={{
          transform: `translate3d(0, ${scrollY * -0.08}px, 0)`,
        }}
      >
        <div className="absolute inset-10 rounded-full border border-purple-400/10" />
      </div>

      {/* Orb 3: Cyan / Teal Accent Orb (Lower Right) */}
      <div
        className="absolute top-[75%] right-10 w-64 h-64 md:w-80 md:h-80 rounded-full border border-teal-500/15 bg-gradient-to-bl from-teal-500/8 via-cyan-500/5 to-transparent backdrop-blur-[50px] shadow-[0_0_60px_rgba(45,212,191,0.08)] transition-transform duration-100 ease-out"
        style={{
          transform: `translate3d(0, ${scrollY * 0.18}px, 0)`,
        }}
      />

      {/* Orb 4: Floating Micro Photon Spheres */}
      <div
        className="absolute top-[25%] left-[20%] w-24 h-24 rounded-full border border-cyan-400/20 bg-cyan-500/5 backdrop-blur-md transition-transform duration-100 ease-out"
        style={{
          transform: `translate3d(0, ${scrollY * -0.22}px, 0)`,
        }}
      />

      <div
        className="absolute top-[60%] right-[25%] w-16 h-16 rounded-full border border-purple-400/20 bg-purple-500/5 backdrop-blur-md transition-transform duration-100 ease-out"
        style={{
          transform: `translate3d(0, ${scrollY * 0.15}px, 0)`,
        }}
      />

    </div>
  );
};
