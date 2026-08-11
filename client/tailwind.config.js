/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Unbounded', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Bricolage Grotesque', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        wa: {
          DEFAULT: '#25D366',
          dark: '#128C7E',
          mint: '#6FF7A8',
          deep: '#0B0F0D',
          panel: '#111816',
        },
      },
    },
  },
  plugins: [],
};
