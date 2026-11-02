import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#5b21b6", light: "#7c3aed", lighter: "#a78bfa" },
        accent: { DEFAULT: "#2563eb", light: "#60a5fa" },
        ink: "#0d0d0d",
      },
      fontFamily: {
        syne: ["var(--font-syne)", "Syne", "sans-serif"],
        jakarta: ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
      },
    },
  },
  plugins: [animate],
};

export default config;
