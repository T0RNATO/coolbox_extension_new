import browser from "webextension-polyfill";
// @ts-ignore
import {shadeHexColor} from "../../utils/utilFunctions";
// @ts-ignore
import {themePresets, legacyThemePresets} from "../../utils/themePresets";
// @ts-ignore
import {AdvancedData, Theme} from "../../utils/types";

let customFont: string;

browser.storage.local.get("font").then(font => {
    customFont = font.font || 'default';
})

browser.runtime.onMessage.addListener((message: {newFont?: string}) => {
    if (message.newFont) {
        customFont = message.newFont;
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

export function updateTheme(tab: number, oldT: Theme, newT: Theme) {
    // Remove the base styling, because apparently it can be added multiple times to the same page and cause issues
    browser.scripting.removeCSS({
        target: { tabId: tab },
        files: ["/css/theme_base.css"]
    }).then(() => {
        const oldCss = generateThemeCss(oldT);
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

function generateThemeCss(themeObject: Theme): [string | null, boolean] {
    let variables: AdvancedData;
    switch (themeObject?.type || "preset") {
        case "preset":
            variables = themePresets.concat(legacyThemePresets).find(theme => theme.value === themeObject.presetData.preset)?.vars;
            break;
        case "legacy": {
            const colour = themeObject.legacyData.colour;
            if (themeObject.legacyData.style === "dark") {
                variables = {
                    "theme-text": "#e8e8e8",
                    "theme-accent": colour,
                    "theme-generic": shadeHexColor(colour, -0.2),
                    "body-background": shadeHexColor(colour, -0.4),
                    "link-colour": "#59a9ff",
                    "navigation-background": colour
                }
            } else {
                variables = {
                    "theme-text": "#000",
                    "theme-accent": shadeHexColor(colour, 0.4),
                    "theme-generic": shadeHexColor(colour, 0.2),
                    "body-background": colour,
                    "link-colour": "#345ee7",
                    "navigation-background": colour
                }
            }
            break;
        }
        case "custom":
            variables = themeObject.advancedData;
            break;
    }

    if (!variables) {
        if (customFont !== 'default') {
            return [`*{font-family:"${customFont}"}`, false];
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
    if (customFont !== 'default') {
        currentThemeCss += `}*{font-family:"${customFont}"`
    }
    return [currentThemeCss + "}", true];
}
