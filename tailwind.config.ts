import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#18122b",
        moss: "#8b5cf6",
        forest: "#4f46e5",
        paper: "#fbf7ff",
        panel: "#ffffff",
        line: "#e7dff5",
        wheat: "#f0e7ff",
        rust: "#c65a45",
        amber: "#60a5fa",
        saffron: "#f0abfc",
        mint: "#ede9fe",
        skyglass: "#dbeafe",
        roseglass: "#fce7f3"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(79, 70, 229, 0.10)",
        lift: "0 24px 70px rgba(139, 92, 246, 0.22)"
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
