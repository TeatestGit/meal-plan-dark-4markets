export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        page: "#121110",
        card: "#1e1c1a",
        rim: {
          DEFAULT: "#2a2724",
          hover: "#3a3632",
          deep: "#4a4642",
        },
        ink: {
          primary: "#f5f0e8",
          secondary: "#a89e92",
          muted: "#6b6560",
          cta: "#ece6dc",
        },
      },
    },
  },
};
