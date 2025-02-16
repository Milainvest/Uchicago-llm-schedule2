/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "translate-x-0",
    "-translate-x-full",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          600: '#800000',
          700: '#6B0000',
        }
      }
    }
  },
  plugins: [],
} 