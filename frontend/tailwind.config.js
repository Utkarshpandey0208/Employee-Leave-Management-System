export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef8ff",
          100: "#d8efff",
          500: "#1686c7",
          600: "#0d6fa8",
          700: "#0f5b87"
        }
      },
      boxShadow: {
        soft: "0 16px 45px rgba(17, 24, 39, 0.08)"
      }
    }
  },
  plugins: []
};
