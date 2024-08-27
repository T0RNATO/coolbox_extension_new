import {hexToRGBString, shadeHexColor} from "../../utils/utilFunctions.ts";
import {themePresets, legacyThemePresets} from "../../utils/themePresets.ts";
import {AdvancedData, Theme} from "../../utils/types.ts";

// Returns [cssString | null, shouldApplyBaseStyles]
export function generateThemeCss(themeObject: Theme, font: string): [string | null, boolean] {
    let variables: Partial<AdvancedData>;
    switch (themeObject?.type || "preset") {
        case "preset":
            variables = themePresets.concat(legacyThemePresets).find(theme => theme.value === themeObject.presetData.preset)?.vars;
            break;
        case "legacy": {
            const colour = themeObject.legacyData.colour;
            if (themeObject.legacyData.style === "dark") {
                variables = {
                    "theme-text": "232 232 232",
                    "theme-accent": hexToRGBString(colour),
                    "theme-generic": hexToRGBString(shadeHexColor(colour, -0.2)),
                    "link-colour": "89 169 255",
                    "body-background": shadeHexColor(colour, -0.4),
                    "navigation-background": colour,
                }
            } else {
                variables = {
                    "theme-text": "0 0 0",
                    "theme-accent": hexToRGBString(shadeHexColor(colour, 0.4)),
                    "theme-generic": hexToRGBString(shadeHexColor(colour, 0.2)),
                    "link-colour": "52 94 231",
                    "body-background": colour,
                    "navigation-background": colour,
                }
            }
            break;
        }
        case "custom":
            const vars = themeObject.advancedData;
            variables = {
                "theme-text": hexToRGBString(vars["theme-text"]),
                "theme-accent": hexToRGBString(vars["theme-accent"]),
                "theme-generic": hexToRGBString(vars["theme-generic"]),
                "link-colour": hexToRGBString(vars["link-colour"]),
                "body-background": vars["body-background"],
                "navigation-background": vars["navigation-background"],
            }
    }

    if (!variables) {
        if (font !== 'default') {
            return [`*{font-family:"${font}"}`, false];
        } else {
            return [null, false];
        }
    }

    let currentThemeCss = ":root {"
    for (const [name, value] of Object.entries(variables)) {
        if (name === "navigation-background" && !themeObject.changeNavbar) {
            continue;
        }
        currentThemeCss += `--${name}: ${value} !important;`;
    }
    if (font !== 'default') {
        currentThemeCss += `}*{font-family:"${font}"`
    }
    return [currentThemeCss + "}", true];
}
