// @ts-ignore
import {AdvancedData} from "./types";

type Preset = {
    display: string,
    value: string,
    hex: string,
    vars: AdvancedData
}

export const themePresets: Preset[] = [
    {display: "Light", value: "light", hex: "#ddd", vars: null},
    {display: "Dark", value: "dark", hex: "#302f33", vars: {
        "theme-text": "#e8e8e8",
        "theme-generic": "#302f33",
        "theme-accent": "#47464a",
        "link-colour": "#59a9ff",
        "body-background": "#1e1e24",
        "navigation-background": "#302f33",
    }},
    {display: "Mocha", value: "catppuccin_mocha", hex: "#313244", vars: {
        "theme-text":            "#cdd6f4", // text
        "theme-generic":         "#1e1e2e", // base
        "theme-accent":          "#313244", // surface 0
        "link-colour":           "#74c7ec", // sapphire
        "body-background":       "#11111b", // crust
        "navigation-background": "#181825", // mantle
    }},
    {display: "Frappe", value: "catppuccin_frappe", hex: "#313244", vars: {
        "theme-text":            "#c6d0f5", // text
        "theme-generic":         "#303446", // base
        "theme-accent":          "#414559", // surface 0
        "link-colour":           "#8caaee", // blue
        "body-background":       "#232634", // crust
        "navigation-background": "#292c3c", // mantle
    }},
]

export const legacyThemePresets: Preset[] = [
    {display: "Purple", value: "purple", hex: "#5438b3", vars: {
        "theme-text": "#e8e8e8",
        "theme-generic": "#1e143c",
        "theme-accent": "#261657",
        "link-colour": "#738ebc",
        "body-background": "#160b25",
        "navigation-background": "#1e143c",
    }},
    {display: "Dark Blue", value: "dark_blue", hex: "#080e3b", vars: {
        "theme-text": "#e8e8e8",
        "theme-generic": "#0e0d42",
        "theme-accent": "#1a226a",
        "link-colour": "#3283ed",
        "body-background": "#0a0a26",
        "navigation-background": "#0e0d42",
    }}
]