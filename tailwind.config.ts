import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f7ff",
          100: "#e9eeff",
          500: "#3c5cff",
          700: "#2440cc",
        },
      },
    },
  },
  plugins: [],
};

export default config;
