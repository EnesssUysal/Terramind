/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'terramind-dark': '#0f172a',
        'terramind-card': '#1e293b',
        'terramind-primary': '#10b981', // green
        'terramind-secondary': '#3b82f6', // blue
        'terramind-accent': '#8b5cf6', // purple
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
