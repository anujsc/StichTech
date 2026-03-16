/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#C0392B',
          light: '#E74C3C',
          dark: '#96281B',
        },
        gold: {
          DEFAULT: '#D4A017',
          light: '#F0C040',
          dark: '#A07810',
        },
        surface: {
          DEFAULT: '#FDF6EC',
          dark: '#F5E6D0',
        },
        navy: {
          DEFAULT: '#1A2744',
          light: '#2C3E6B',
          dark: '#0F1A30',
        },
        muted: {
          DEFAULT: '#F8F4EF',
          dark: '#EDE8E0',
        },
        'border-warm': '#E8D5B7',
        'text-warm': '#5C4A32',
      },
      fontFamily: {
        sans: ['Hind', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
