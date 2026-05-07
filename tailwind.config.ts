import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101828",
        paper: "#fbfcf8",
        moss: "#2f6f4e",
        coral: "#d96b55",
        signal: "#f2c94c"
      },
      boxShadow: {
        "soft-panel": "0 18px 50px rgb(16 24 40 / 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
