import React from 'react';

interface BlochSphereProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  glowColor?: string;
}

export const BlochSphere: React.FC<BlochSphereProps> = ({
  size = 'md',
  className = '',
  glowColor = '#38bdf8',
}) => {
  const dimensions = {
    sm: { w: 120, h: 120, r: 45 },
    md: { w: 200, h: 200, r: 75 },
    lg: { w: 280, h: 280, r: 105 },
  }[size];

  const { w, h, r } = dimensions;
  const cx = w / 2;
  const cy = h / 2;

  return (
    <div className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}>
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-[spin_45s_linear_infinite]"
      >
        {/* Outer Sphere Rim */}
        <circle cx={cx} cy={cy} r={r} stroke={glowColor} strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3 3" />
        
        {/* Equator Ellipse */}
        <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.32} stroke="#818CF8" strokeWidth="1" strokeOpacity="0.4" />
        
        {/* Meridian Ellipse */}
        <ellipse cx={cx} cy={cy} rx={r * 0.32} ry={r} stroke="#C084FC" strokeWidth="1" strokeOpacity="0.3" />

        {/* Z-Axis (Vertical: |0> to |1>) */}
        <line x1={cx} y1={cy - r - 12} x2={cx} y2={cy + r + 12} stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.5" />
        <text x={cx + 6} y={cy - r - 4} fill="#38BDF8" fontSize="10" fontWeight="bold" fontFamily="monospace">|0⟩</text>
        <text x={cx + 6} y={cy + r + 12} fill="#38BDF8" fontSize="10" fontWeight="bold" fontFamily="monospace">|1⟩</text>

        {/* X-Axis (Diagonal: |+> to |->) */}
        <line x1={cx - r - 8} y1={cy} x2={cx + r + 8} y2={cy} stroke="#818CF8" strokeWidth="1" strokeOpacity="0.35" strokeDasharray="2 2" />
        <text x={cx + r + 10} y={cy + 4} fill="#818CF8" fontSize="9" fontFamily="monospace">|+⟩</text>
        <text x={cx - r - 22} y={cy + 4} fill="#818CF8" fontSize="9" fontFamily="monospace">|−⟩</text>

        {/* Central Origin Dot */}
        <circle cx={cx} cy={cy} r="2" fill="#E2E8F0" opacity="0.6" />

        {/* Quantum State Vector |ψ> Arrow */}
        <line
          x1={cx}
          y1={cy}
          x2={cx + r * 0.55}
          y2={cy - r * 0.65}
          stroke="#38BDF8"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* State Vector Glowing Bead */}
        <circle cx={cx + r * 0.55} cy={cy - r * 0.65} r="4" fill="#38BDF8">
          <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
        </circle>
        <text x={cx + r * 0.55 + 6} y={cy - r * 0.65 - 4} fill="#38BDF8" fontSize="10" fontWeight="bold" fontFamily="monospace">
          |ψ⟩
        </text>
      </svg>
    </div>
  );
};
