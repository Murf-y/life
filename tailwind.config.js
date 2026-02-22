/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      xs: "400px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    extend: {
      colors: {
        void: "#0a0a0a",
        surface: "#111111",
        ink: {
          DEFAULT: "#f0f0f0",
          dim: "#777777",
          muted: "#444444",
        },
        accent: {
          DEFAULT: "#FF2D6B",
          hover: "#ff5088",
        },
        neon: "#39FF14",
        stroke: {
          DEFAULT: "#2a2a2a",
          heavy: "#444444",
        },
      },
      fontFamily: {
        mono: ['"Space Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};
