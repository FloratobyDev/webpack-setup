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
        "md": "1rem",
      },
      borderRadius: {
        "smd": "0.25rem",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        jost: ["Jost", "monospace"],
        gothic: ["Gothic A1", "sans-serif"],
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
        "primary-black": "#181818",
        "primary-outline": "#333333",
        "black-75": "#232323",
        "black-5": "#878787",
        "paragraph": "#F0F0F0",
        "sub-paragraph": "#CFCFCF",
        "error": "#E72D14",
        "success": "#32E714",
        "primary-yellow": "#DFB626",
        "black-50": "#5C5C5C",
        "primary-red": "#E72D14",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
