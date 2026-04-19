/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        carbon: '#0D0D0D',
        charcoal: '#1A1A1A',
        graphite: '#242424',
        gold: {
          DEFAULT: '#C9A84C',
          dim: '#8A6E2F',
          pale: '#E8D5A3',
        },
        ivory: '#F0EDE6',
        silver: '#9E9A92',
      },
      fontFamily: {
        display: ['"Bodoni Moda"', 'Georgia', 'serif'],
        body: ['Raleway', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.3em',
        widest3: '0.5em',
      },
      backgroundImage: {
        'gold-shimmer': 'linear-gradient(90deg, transparent, #C9A84C55, transparent)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        shimmer: 'shimmer 3s linear infinite',
        'fade-up': 'fadeUp 1s ease both',
        'fade-in': 'fadeIn 0.8s ease both',
        'scale-in': 'scaleIn 0.4s ease both',
      },
    },
  },
  plugins: [],
}
