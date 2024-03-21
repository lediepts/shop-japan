/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "**/*.{css,scss}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: '4px',
          sm: '4px',
          lg: '8px',
          xl: '1rem',
          '2xl': '2rem',
        },
      },
    },
    colors: {
      ...colors,
      primary: '#376A1F',
      secondary: '#56624C',
    }
  },
  plugins: [],
}

