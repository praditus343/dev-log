/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#22c55e',
          light: '#4ade80',
          dark: '#059669',
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
        },
      },
      borderRadius: {
        'card': '15px',
        'btn': '20px',
        'badge': '15px',
      },
      boxShadow: {
        'glow-green': '0 0 30px rgba(34, 197, 94, 0.3)',
        'glow-green-sm': '0 0 10px rgba(34, 197, 94, 0.5)',
        'card-hover': '0 10px 30px rgba(34, 197, 94, 0.1)',
      },
      fontFamily: {
        'sans': ['Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

