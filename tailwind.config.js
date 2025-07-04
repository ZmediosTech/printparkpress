// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1', // Indigo
        secondary: '#8b5cf6', // Purple
      },
      fontFamily: {
        sans: ['"Poppins"', 'ui-sans-serif', 'system-ui'], // Or your preferred font
      },
    }
  },
  plugins: [],
}
