import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Farby priamo z loga FINIX - nemeniť bez konzultácie s brandom
        brand: {
          blue: "#005CB2",
          teal: "#10D0A0",
          tealDark: "#04382C",
          navy: "#0B2B47",
        },
      },
      fontFamily: {
        serif: ["var(--font-newsreader)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      // PRIDANÉ: Definícia animácie pre plynulé prepínanie referencií
      animation: {
        "fade-in": "fadeIn 0.35s cubic-bezier(0.215, 0.610, 0.355, 1.000) forwards",
      },
      // PRIDANÉ: Hardvérovo akcelerované kľúčové snímky (využitie opacity a transform)
      keyframes: {
        fadeIn: {
          "0%": { 
            opacity: "0", 
            transform: "translateY(4px)" 
          },
          "100%": { 
            opacity: "1", 
            transform: "translateY(0)" 
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;