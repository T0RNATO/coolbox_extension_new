function mix(color, percent = 20) {
    return `color-mix(in oklab, theme(colors.${color}) ${percent}%, theme(colors.accent))`
}

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

                faded: {
                    accent: mix('primary', 40),

                    green:  mix('green.400'),
                    red:    mix('red.400'),
                    blue:   mix('blue.400'),
                    yellow: mix('yellow.400'),
                    purple: mix('purple.400'),
                    pink:   mix('pink.400'),
                    orange: mix('orange.400'),
                    cyan:   mix('cyan.400'),
                }
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
