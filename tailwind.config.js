/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          DEFAULT: '#e11d48',
        },
        surface: {
          DEFAULT: '#ffffff',
          subtle: '#fafafa',
          muted: '#f4f4f5',
        },
        ink: {
          DEFAULT: '#18181b',
          secondary: '#52525b',
          muted: '#a1a1aa',
        },
        line: { DEFAULT: '#e4e4e7', focus: '#e11d48' },
        danger: { DEFAULT: '#dc2626', subtle: '#fef2f2' },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Barlow Condensed"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        focus: '0 0 0 3px rgb(225 29 72 / 0.25)',
      },
    },
  },
  plugins: [],
};
