import browser from "webextension-polyfill";
import {possibleThemes} from "~/utils/themes.js";

browser.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === "applyTheme") {
        browser.storage.local.get("theme").then(result => {
            if (result.theme.setting !== "light") {
                applyTheme(sender, result.theme.setting);
            }
        })
    } else if (message?.type === "updateTheme") {
        console.log(message);
        // Remove the base styling, because apparently it can be added multiple times to the same page and cause issues
        browser.scripting.removeCSS({
            target: { tabId: sender.tab.id },
            files: ["/css/theme_base.css"]
        }).then(() => {
            // Remove the previous theme's styling (if it had any)
            if (message.old.setting !== "light") {
                browser.scripting.removeCSS({
                    target: {tabId: sender.tab.id},
                    css: generateThemeCss(message.old.setting)
                })
            }
            // And then if there's a new theme to add, add it
            if (message.new.setting !== "light") {
                applyTheme(sender, message.new.setting);
            }
        })
    }
})

function applyTheme(sender, themeName) {
    browser.scripting.insertCSS({
        target: { tabId: sender.tab.id },
        files: ["/css/theme_base.css"]
    }).then(() => {
        browser.scripting.insertCSS({
            target: { tabId: sender.tab.id },
            css: generateThemeCss(themeName)
        })
    })
}

function generateThemeCss(themeName) {
    const variables = possibleThemes.find(theme => theme.value === themeName).vars;
    let currentThemeCss = ":root {"
    for (const [name, value] of Object.entries(variables)) {
        currentThemeCss += `--${name}: ${value} !important;`;
    }
    return currentThemeCss + "}";
}