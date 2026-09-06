import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#102d3b",
        brand: { 50: "#edf9f8", 100: "#d4f1ef", 200: "#a9e2df", 300: "#71cac6", 500: "#168c88", 600: "#0b746f", 700: "#095b58", 800: "#084946" },
        accent: { 50: "#fff7ed", 500: "#f28b3c", 600: "#df7022" },
      },
      boxShadow: {
        card: "0 1px 2px rgba(16, 45, 59, 0.03), 0 12px 32px rgba(16, 45, 59, 0.065)",
        lift: "0 18px 45px rgba(16, 45, 59, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
