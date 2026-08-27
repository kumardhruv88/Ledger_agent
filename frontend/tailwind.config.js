/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pearl: '#FCFCFD',
        ink: '#0F172A',
        slate: '#64748B',
        silver: '#E2E8F0',
        royal: '#1E3A8A',
        emerald: '#059669',
        crimson: '#E11D48',
        amber: '#D97706',
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
