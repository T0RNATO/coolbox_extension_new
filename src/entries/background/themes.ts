import browser from "webextension-polyfill";
import {hexToRGBString, shadeHexColor} from "../../utils/utilFunctions.ts";
import {themePresets, legacyThemePresets} from "../../utils/themePresets.ts";
import {AdvancedData, Theme} from "../../utils/types.ts";

let customFont: string;

browser.storage.local.get("font").then(font => {
    customFont = font.font || 'default';
})

browser.runtime.onMessage.addListener((message: {newFont: string, oldFont: string}, sender) => {
    if (message.newFont) {
        customFont = message.newFont;
        browser.storage.local.get("theme").then(result => {
            // Mildly cursed but it works
            updateTheme(sender.tab.id, result.theme, result.theme, message.oldFont);
        })
    }
})

export function applyTheme(tab: number) {
    browser.storage.local.get("theme").then(result => {
        const css = generateThemeCss(result.theme);
        if (css[0]) {
            applyCss(tab, ...css);
        }
    })
}

export function updateTheme(tab: number, oldT: Theme, newT: Theme, overrideOldFont?: string) {
    // Remove the base styling, because apparently it can be added multiple times to the same page and cause issues
    browser.scripting.removeCSS({
        target: { tabId: tab },
        files: ["/css/theme_base.css"]
    }).then(() => {
        const oldCss = generateThemeCss(oldT, overrideOldFont || customFont);
        const newCss = generateThemeCss(newT);
        if (oldCss[0]) {
            browser.scripting.removeCSS({
                target: {tabId: tab},
                css: oldCss[0]
            })
        }

        if (newCss[0]) {
            applyCss(tab, ...newCss);
        }
    })
}

function applyCss(tab: number, css: string, applyBase = true) {
    function applyTheme() {
        browser.scripting.insertCSS({
            target: { tabId: tab },
            css: css
        })
    }
    if (!applyBase) return applyTheme()
    browser.scripting.insertCSS({
        target: { tabId: tab },
        files: ["/css/theme_base.css"]
    }).then(applyTheme);
}

// Returns [cssString | null, shouldApplyBaseStyles]
function generateThemeCss(themeObject: Theme, font = customFont): [string | null, boolean] {
    console.log(themePresets, themeObject);
    let variables: Partial<AdvancedData>;
    switch (themeObject?.type || "preset") {
        case "preset":
            variables = themePresets.concat(legacyThemePresets).find(theme => theme.value === themeObject.presetData.preset)?.vars;
            console.log(variables);
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
