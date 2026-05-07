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
        amber: "#edb14d",
        saffron: "#f6c85f",
        mint: "#dff3e7",
        skyglass: "#dbeafe",
        roseglass: "#ffe4df"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(28, 38, 31, 0.08)",
        lift: "0 24px 70px rgba(30, 68, 45, 0.16)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        shine: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(120%)" }
        }
      },
      animation: {
        float: "float 5s ease-in-out infinite",
        shine: "shine 2.8s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
