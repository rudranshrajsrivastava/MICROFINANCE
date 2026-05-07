import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#13251b",
        moss: "#467f5a",
        forest: "#2f6947",
        paper: "#f7f4ee",
        panel: "#fbfaf6",
        line: "#ded5c7",
        wheat: "#ebe5d8",
        rust: "#c65a45",
        amber: "#edb14d"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(28, 38, 31, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
