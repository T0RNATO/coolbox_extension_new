/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./public/css/*.css",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  corePlugins: {
    preflight: false,
  },
  daisyui: {
    base: false,
    themes: ["light", "dracula"],
    prefix: "dui-"
  }
}
