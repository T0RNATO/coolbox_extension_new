import browser from "webextension-polyfill";
// @ts-ignore
import {shadeHexColor} from "../../utils/utilFunctions";
// @ts-ignore
import {themePresets, legacyThemePresets} from "../../utils/themePresets";
// @ts-ignore
import {AdvancedData, Theme} from "../../utils/types";

const customFont = {value: null};

browser.storage.local.get("font").then(font => {
    customFont.value = font.font;
})

browser.runtime.onMessage.addListener((message: {newFont?: string}) => {
    if (message.newFont) {
        console.log(message);
        customFont.value = message.newFont;
    }
})

export function applyTheme(tab: number) {
    browser.storage.local.get("theme").then(result => {
        const css = generateThemeCss(result.theme)
        if (css) {
            applyCss(tab, css);
        }
    })
}

const appliedCss = [];

export function updateTheme(tab: number, oldT: Theme, newT: Theme) {
    // Remove the base styling, because apparently it can be added multiple times to the same page and cause issues
    browser.scripting.removeCSS({
        target: { tabId: tab },
        files: ["/css/theme_base.css"]
    }).then(() => {
        const oldCss = generateThemeCss(oldT);
        const newCss = generateThemeCss(newT);
        if (oldCss) {
            browser.scripting.removeCSS({
                target: {tabId: tab},
                css: oldCss
            })
            appliedCss.splice(appliedCss.indexOf(oldCss), 1);
        }

        if (newCss) {
            applyCss(tab, newCss);
        }
    })
}

function applyCss(tab: number, css: string) {
    browser.scripting.insertCSS({
        target: { tabId: tab },
        files: ["/css/theme_base.css"]
    }).then(() => {
        browser.scripting.insertCSS({
            target: { tabId: tab },
            css: css
        })
        appliedCss.push(css);
    })
}

function generateThemeCss(themeObject: Theme): string | null {
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

    if (!variables) { return null }

    let currentThemeCss = ":root {"
    for (const [name, value] of Object.entries(variables)) {
        if (name === "navigation-background" && !themeObject.changeNavbar) {
            continue;
        }
        currentThemeCss += `--${name}: ${value} !important;`;
    }
    console.log(customFont);
    if (customFont.value !== 'default') {
        currentThemeCss += `}*{font-family:"${customFont.value}"`
    }
    return currentThemeCss + "}";
}
