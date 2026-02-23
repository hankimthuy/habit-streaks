import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#f49d25",
        "primary-dark": "#d68215",
        "primary-hover": "#e08a14",
        "background-light": "#f8f7f5",
        "background-dark": "#18181b",
        "surface-dark": "#27272a",
        "surface-dark-lighter": "#3e3120",
        "card-dark": "#2a2218",
        "accent-green": "#22c55e",
        "accent-red": "#ef4444",
        "text-light": "#cbb290",
        success: "#22c55e",
        danger: "#ef4444",
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "2.5rem",
        full: "9999px",
      },
      boxShadow: {
        glow: "0 0 15px -3px rgba(244, 157, 37, 0.3)",
        "glow-success": "0 0 20px rgba(34, 197, 94, 0.15)",
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.15)",
      },
      keyframes: {
        fillProgress: {
          from: { width: "0%" },
          to: { width: "var(--progress-width, 65%)" },
        },
      },
      animation: {
        progress: "fillProgress 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
