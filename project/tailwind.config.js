/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 1.5s linear infinite',
      },
      colors: {
        navy: {
          50: '#f0f5fa',
          100: '#e1eaf4',
          200: '#bed3e7',
          300: '#94b5d8',
          400: '#648ec5',
          500: '#4571b0',
          600: '#375994',
          700: '#2f4878',
          800: '#2b3c64',
          900: '#283454',
        },
        primary: {
          DEFAULT: '#0D9488',
          light: '#14B8A6',
          dark: '#0F766E',
        },
        secondary: {
          DEFAULT: '#0891B2',
          light: '#22D3EE',
          dark: '#0E7490',
        },
        accent: {
          DEFAULT: '#22D3EE',
          light: '#67E8F9',
          dark: '#06B6D4',
        },
        success: {
          DEFAULT: '#22C55E',
          light: '#4ADE80',
          dark: '#16A34A',
        },
        warning: {
          DEFAULT: '#FBBF24',
          light: '#FCD34D',
          dark: '#F59E0B',
        },
        error: {
          DEFAULT: '#EF4444',
          light: '#F87171',
          dark: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};