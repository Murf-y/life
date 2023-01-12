/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
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
        primary: {
          DEFAULT: "#AA4465",
          dark: "#993d5b",
          light: "#b35774",
        },
        yellow: {
          DEFAULT: "#EDF0DA",
          dark: "#F0DFAD",
          darker: "#8F5C38",
        },
      },
    },
  },
  plugins: [],
};
