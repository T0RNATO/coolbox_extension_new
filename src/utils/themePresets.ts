import {PresetDefinition} from "./types.ts";

export const themePresets: PresetDefinition[] = [
    {display: "Light", value: "light", rgb: "221 221 221", vars: null},
    {display: "Dark", value: "dark", rgb: "48 47 51", vars: {
        "theme-text":            "232 232 232",
        "theme-generic":         "48 47 51",
        "theme-accent":          "71 70 74",
        "link-colour":           "89 169 255",
        "body-background":       "#1e1e24",
        "navigation-background": "#302f33",
    }},
    {display: "Mocha", value: "catppuccin_mocha", rgb: "49 50 68", vars: {
        "theme-text":            "205 214 244", // text
        "theme-generic":         "30 30 46",    // base
        "theme-accent":          "49 50 68",    // surface 0
        "link-colour":           "116 199 236", // sapphire
        "body-background":       "#11111b", // crust
        "navigation-background": "#181825", // mantle
    }},
    {display: "Frappe", value: "catppuccin_frappe", rgb: "49 50 68", vars: {
        "theme-text":            "198 208 245", // text
        "theme-generic":         "48 52 70",    // base
        "theme-accent":          "65 69 89",    // surface 0
        "link-colour":           "140 170 238", // blue
        "body-background":       "#232634", // crust
        "navigation-background": "#292c3c", // mantle
    }},
]

export const legacyThemePresets: PresetDefinition[] = [
    {display: "Purple", value: "purple", rgb: "84 56 179", vars: {
        "theme-text":            "232 232 232",
        "theme-generic":         "30 20 60",
        "theme-accent":          "38 22 87",
        "link-colour":           "115 142 188",
        "body-background":       "#160b25",
        "navigation-background": "#1e143c",
    }},
    {display: "Dark Blue", value: "dark_blue", rgb: "8 14 59", vars: {
        "theme-text":            "232 232 232",
        "theme-generic":         "14 13 66",
        "theme-accent":          "26 34 106",
        "link-colour":           "50 131 237",
        "body-background":       "#0a0a26",
        "navigation-background": "#0e0d42",
    }}
]