import React, { useEffect, useState } from 'react';

export const QuantumLabels: React.FC = () => {
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

  const floatingLabels = [
    { text: '|ψ⟩ = α|0⟩ + β|1⟩', top: '15%', left: '4%', speed: 0.14, color: 'text-cyan-400/20' },
    { text: 'NO-CLONING THEOREM', top: '32%', right: '5%', speed: -0.1, color: 'text-purple-400/20' },
    { text: 'Δx · Δp ≥ ℏ/2', top: '48%', left: '3%', speed: 0.18, color: 'text-sky-400/20' },
    { text: 'BASIS {|+⟩, |−⟩} ⟂ {|0⟩, |1⟩}', top: '65%', right: '4%', speed: -0.12, color: 'text-indigo-400/20' },
    { text: 'QBER THRESHOLD ≤ 11.0%', top: '82%', left: '5%', speed: 0.15, color: 'text-emerald-400/20' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none hidden lg:block">
      {floatingLabels.map((item, idx) => (
        <div
          key={idx}
          className={`absolute font-mono text-[11px] tracking-widest uppercase font-semibold ${item.color} backdrop-blur-[1px]`}
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
            transform: `translate3d(0, ${scrollY * item.speed}px, 0)`,
            transition: 'transform 0.1s ease-out',
          }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
};
