/** @type {import('tailwindcss').Config} */
export default {
  content: [
    ./index.html,
    ./src/**/*.{js,ts,jsx,tsx},
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ocean: {
          950: '#030712',
          900: '#060f26',
          850: '#0a1638',
          800: '#0d1e4c',
          700: '#142c6e',
          600: '#1e3a8a',
          500: '#3b82f6',
          400: '#60a5fa',
          300: '#93c5fd',
          accent: '#00f0ff',
          neonGreen: '#10b981',
          neonOrange: '#f59e0b',
          neonPink: '#ec4899',
          neonRed: '#ef4444',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -3px rgba(0, 240, 255, 0.4)',
        'glow-red': '0 0 20px -3px rgba(239, 68, 68, 0.5)',
        'glow-blue': '0 0 25px -4px rgba(59, 130, 246, 0.4)',
        'cockpit': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
