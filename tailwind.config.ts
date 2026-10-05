import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
       theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#16A34A',
        light: '#DCFCE7',
        dark: '#15803D',
      },
      background: '#FFFFFF',
      foreground: '#1F2937',
    },
  },
},
      },
    },
  },
  plugins: [],
} satisfies Config;