/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        synology: {
          blue: '#0062b8',
          dark: '#1e293b',
          light: '#f8fafc'
        }
      }
    },
  },
  plugins: [],
}
