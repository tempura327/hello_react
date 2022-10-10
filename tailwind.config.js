/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    // 'public/index.html'
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '8px',
      },
    },
    extend: {},
  },
  plugins: [],
}
