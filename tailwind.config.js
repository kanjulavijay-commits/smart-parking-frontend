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
        brand: {
          50:  '#fdf3f4',   // lightest blush
          100: '#fce6e8',   // very light rose
          200: '#f8cdd2',   // soft pink
          300: '#f2a8b0',   // medium pink
          400: '#C9A0B8',   // bluish-pink (warm mauve)
          500: '#B76E79',   // rose gold — primary
          600: '#AD7B5E',   // muted copper — hover
          700: '#8B503E',   // deep warm brown
          800: '#5C1E24',   // mahogany
          900: '#3D1215',   // dark mahogany
        },
      },
      fontFamily: {
        sans:    ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        display: ['"Orbitron"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-in':         'fadeIn 0.3s ease-in-out',
        'slide-up':        'slideUp 0.3s ease-out',
        'blob':            'blob 10s infinite ease-in-out',
        'blob-slow':       'blob 16s infinite ease-in-out',
        'float':           'float 6s ease-in-out infinite',
        'shimmer':         'shimmer 3s linear infinite',
        'move-background': 'moveBackground 60s linear infinite',
        'pulse-slow':      'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'glow-pulse':      'glowPulse 3s ease-in-out infinite',
        'orbit':           'orbit 20s linear infinite',
        'scan':            'scan 2s linear infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(10px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        blob: {
          '0%':   { transform: 'translate(0px, 0px) scale(1)' },
          '33%':  { transform: 'translate(30px, -60px) scale(1.15)' },
          '66%':  { transform: 'translate(-25px, 25px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-18px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        moveBackground: {
          from: { backgroundPosition: '0% 0%' },
          to:   { backgroundPosition: '0% -1000%' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%':      { opacity: '0.8', transform: 'scale(1.08)' },
        },
        orbit: {
          from: { transform: 'rotate(0deg) translateX(120px) rotate(0deg)' },
          to:   { transform: 'rotate(360deg) translateX(120px) rotate(-360deg)' },
        },
        scan: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(400%)' },
        },
      },
      backgroundSize: { '200%': '200%' },
    },
  },
  plugins: [],
}
