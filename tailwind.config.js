/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./packages/client/**/*.{ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontSize: {
        "heading-1": "2rem",
        "heading-2": "1.5rem",
        "heading-3": "1.125",
        "heading-4": "1rem",
        "heading-5": "0.875rem",
        "heading-6": "0.75rem",
        "heading-7": "0.625rem",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      lineHeight: {
        "heading-1": "2.2rem",
        "heading-2": "1.7rem",
        "heading-3": "1.2rem",
        "heading-4": "1.2rem",
        "heading-5": "1.075rem",
        "heading-6": "0.95rem",
        "heading-7": "0.825rem",
      },
      colors: {
        "primary-black": "#2C2C2C",
        "black-75": "#3A3A3A",
      },
    },
  },
  plugins: [],
};
