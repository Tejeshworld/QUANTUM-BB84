import React, { useEffect, useState } from 'react';

export const ScrollProgress: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[2.5px] z-[100] bg-slate-900/40 pointer-events-none">
      {/* Glow gradient bar */}
      <div
        className="h-full bg-gradient-to-r from-cyan-400 via-sky-500 to-purple-500 transition-[width] duration-75 ease-out shadow-[0_0_12px_rgba(56,189,248,0.8)] relative"
        style={{ width: `${scrollProgress}%` }}
      >
        {/* Leading glowing quantum bead */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#38bdf8] animate-pulse" />
      </div>
    </div>
  );
};
