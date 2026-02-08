import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3b82f6", // blue-500
          dark: "#2563eb", // blue-600
          light: "#60a5fa", // blue-400
        },
        secondary: {
          DEFAULT: "#8b5cf6", // violet-500
          dark: "#7c3aed", // violet-600
          light: "#a78bfa", // violet-400
        },
        success: "#10b981", // green-500
        danger: "#ef4444", // red-500
        warning: "#f59e0b", // amber-500
      },
      screens: {
        xs: "475px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [],
};

export default config;
