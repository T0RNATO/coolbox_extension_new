import browser from "webextension-polyfill";
import {possibleThemes} from "~/utils/themes.js";

browser.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === "applyTheme") {
        browser.storage.local.get("theme").then(result => {
            if (result.theme !== "light") {
                browser.scripting.insertCSS({
                    target: { tabId: sender.tab.id },
                    files: ["/css/theme_base.css"]
                })
                const variables = possibleThemes.find(theme => theme.value === result.theme).vars;
                let css = ":root {"
                for (const [name, value] of Object.entries(variables)) {
                    css += `--${name}: ${value} !important;`;
                }
                css += "}";
                browser.scripting.insertCSS({
                    target: { tabId: sender.tab.id },
                    css: css
                })
            }
        })
    }
})