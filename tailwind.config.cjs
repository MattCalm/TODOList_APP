/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        rounded: [
          "Arial Rounded MT Bold",
          "Trebuchet MS",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        cute: [
          "Comic Sans MS",
          "Segoe Print",
          "Trebuchet MS",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        widget: "0 24px 70px rgba(31, 41, 55, 0.24)",
      },
    },
  },
  plugins: [],
};
