import browser from "webextension-polyfill";
import {Theme} from "../../utils/types.ts";
import {generateThemeCss} from "./generateTheme.ts";

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
        const css = generateThemeCss(result.theme, customFont);
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
        const newCss = generateThemeCss(newT, customFont);
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