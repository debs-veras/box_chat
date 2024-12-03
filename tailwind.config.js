const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e9f4ec",
          100: "#c7e4d1",
          200: "#a3d4b5",
          300: "#7fc498",
          400: "#5ab57b",
          500: "#25D366", 
          600: "#20b359",
          700: "#1a924b",
          800: "#14723d",
          900: "#0e512f"
        },
      }
    },
  },
  plugins: [],
}