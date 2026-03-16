/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  safelist: [
    // ThumbnailGradientMap gradient classes
    'bg-gradient-to-br',
    'from-rose-100', 'to-rose-300',
    'from-amber-100', 'to-amber-300',
    'from-red-100', 'via-orange-200', 'to-red-300',
    'from-yellow-100', 'via-amber-200', 'to-orange-200',
    'from-rose-200', 'via-pink-300', 'to-red-400',
    'from-orange-100', 'via-amber-200', 'to-yellow-200',
  ],
  theme: {
    extend: {
      colors: {
        brand: '#C0392B',
        gold: '#C9A84C',
        navy: '#1A1A2E',
        surface: '#FDF8F2',
        muted: '#F5EFE6',
        'warm-border': '#EAE0D5',
        'warm-text': '#7B6B5D',
        card: '#FFFFFF',
      },
      borderRadius: {
        pill: '9999px',
      },
      boxShadow: {
        card: '0 2px 16px rgba(192, 57, 43, 0.07)',
        'card-hover': '0 8px 32px rgba(192, 57, 43, 0.14)',
      },
      fontFamily: {
        sans: ['Hind', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'scale-in': 'scaleIn 400ms ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
