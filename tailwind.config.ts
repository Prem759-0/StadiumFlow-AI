import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // StadiumFlow brand colors
        navy: {
          50: "#e8eaf6",
          100: "#c5cae9",
          200: "#9fa8da",
          300: "#7986cb",
          400: "#5c6bc0",
          500: "#1a1f3a",
          600: "#161b33",
          700: "#12172b",
          800: "#0e1224",
          900: "#0a0d1c",
          950: "#060811",
        },
        electric: {
          50: "#e0ffe8",
          100: "#b3ffc7",
          200: "#80ffa3",
          300: "#4dff7f",
          400: "#26ff63",
          500: "#00e639",
          600: "#00b82e",
          700: "#008a22",
          800: "#005c17",
          900: "#002e0b",
        },
        accent: {
          blue: "#3b82f6",
          purple: "#8b5cf6",
          amber: "#f59e0b",
          red: "#ef4444",
          cyan: "#06b6d4",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "glow": "glow 2s ease-in-out infinite alternate",
        "heatmap-pulse": "heatmapPulse 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(0, 230, 57, 0.3)" },
          "100%": { boxShadow: "0 0 20px rgba(0, 230, 57, 0.6)" },
        },
        heatmapPulse: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "0.9" },
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
