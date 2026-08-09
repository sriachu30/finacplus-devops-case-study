/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: {
          950: '#0A0A0B',
          900: '#0F0F11',
          850: '#131316',
          800: '#18181C',
          700: '#232327',
          600: '#2E2E33',
          500: '#3D3D43',
        },
        line: {
          DEFAULT: '#28282D',
          soft: '#1D1D21',
          strong: '#3A3A41',
        },
        paper: {
          DEFAULT: '#EDEBE6',
          dim: '#A8A6A0',
          faint: '#6B6A66',
        },
        amber: {
          DEFAULT: '#C8802A',
          bright: '#E0983B',
          dim: '#8A5D22',
          faint: 'rgba(200, 128, 42, 0.12)',
        },
        signal: {
          ok: '#5B8C6E',
          warn: '#C8802A',
          err: '#B4503F',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        display: ['"Neue Haas Grotesk Display"', '"Inter Tight"', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'clamp-hero': 'clamp(2.75rem, 8vw, 7rem)',
        'clamp-h2': 'clamp(2rem, 5vw, 3.5rem)',
        'clamp-h3': 'clamp(1.375rem, 3vw, 2rem)',
      },
      letterSpacing: {
        widest2: '0.28em',
      },
      backgroundImage: {
        grid: 'linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '48px 48px',
      },
      transitionTimingFunction: {
        engineer: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        blink: {
          '0%, 49%': { opacity: 1 },
          '50%, 100%': { opacity: 0 },
        },
        scanline: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 -400px' },
        },
      },
      animation: {
        blink: 'blink 1s step-end infinite',
      },
    },
  },
  plugins: [],
}
