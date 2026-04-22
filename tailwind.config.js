/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Source Sans 3"', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      colors: {
        g1red: '#c4170c',
        g1redDark: '#a3130a',
        g1bg: '#f2f2f2',
      },
    },
  },
  plugins: [],
}
