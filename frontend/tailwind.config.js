/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        space: {
          950: '#060913',
          900: '#0B0F19',
          850: '#101726',
          800: '#151C2C',
          700: '#1E293B',
          600: '#334155',
        },
        quantum: {
          cyan: '#38BDF8',
          blue: '#60A5FA',
          purple: '#A855F7',
          pink: '#F472B6',
          emerald: '#34D399',
          rose: '#FB7185',
          amber: '#FBBF24',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(56, 189, 248, 0.2)' },
          '100%': { boxShadow: '0 0 25px rgba(56, 189, 248, 0.6), 0 0 40px rgba(168, 85, 247, 0.4)' },
        }
      }
    },
  },
  plugins: [],
}
