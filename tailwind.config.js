/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#394C8C',
          light: '#5A70B9',
          dark: '#1E2E62'
        },
        background: {
          light: '#EFF5FB'
        }
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '2rem',
        '3xl': '3rem'
      }
    },
  },
  plugins: [],
}