/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{vue,js,ts,jsx,tsx}",
        "./public/css/*.css",
    ],
    theme: {
        extend: {
            colors: {
                primary: 'rgb(var(--theme-generic) / <alpha-value>)',
                background: 'rgb(var(--body-background) / <alpha-value>)',
                accent: 'rgb(var(--theme-accent) / <alpha-value>)',
                themeText: 'rgb(var(--theme-text) / <alpha-value>)',
            }
        }
    },
    plugins: [require("daisyui")],
    corePlugins: {
        preflight: false,
    },
    daisyui: {
        base: false,
        themes: ["emerald", "dracula"],
        prefix: "dui-",
        logs: false,
    }
}
