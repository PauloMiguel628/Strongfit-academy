/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'], // Fonte nova aplicada aqui
      },
      colors: {
        sfBlack: '#000000',
        sfNavy: '#001f36',
        sfTeal: '#1c5560',
        sfGreen: '#79ae92',
        sfCream: '#fbffcd',
      }
    },
  },
  plugins: [],
}