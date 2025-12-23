/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 1px 0 rgba(255,255,255,0.06), 0 12px 32px rgba(0,0,0,0.55)',
      },
    },
  },
  plugins: [],
}
