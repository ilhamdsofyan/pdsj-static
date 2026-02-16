/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}", "./assets/js/**/*.js"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#1754cf",
        "background-light": "#f6f6f8",
        "background-dark": "#111621",
        "timber-dark": "#2d241e",
      },
      fontFamily: {
        display: ["Inter"],
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
