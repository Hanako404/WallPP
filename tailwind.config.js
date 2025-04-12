/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff4c4c',
        darkBg: '#1a1a1a',
      },
    },
  },
  plugins: [],
}
