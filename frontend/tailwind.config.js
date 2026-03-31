/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#1e293b', // slate-800
          card: '#334155', // slate-700
          border: '#475569', // slate-600
        },
        neon: {
          cyan: '#00f2fe',
          purple: '#4facfe',
          accent: '#00f2fe',
        }
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(to bottom right, #1e293b, #334155)',
      }
    },
  },
  plugins: [],
}
