import browser from "webextension-polyfill";
import {possibleThemes} from "~/utils/themes.js";

browser.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === "applyTheme") {
        browser.storage.local.get("theme").then(result => {
            if (result.theme.setting !== "light") {
                applyTheme(sender, result.theme);
            }
        })
    } else if (message?.type === "updateTheme") {
        // Remove the base styling, because apparently it can be added multiple times to the same page and cause issues
        browser.scripting.removeCSS({
            target: { tabId: sender.tab.id },
            files: ["/css/theme_base.css"]
        }).then(() => {
            // Remove the previous theme's styling (if it had any)
            if (message.old.setting !== "light") {
                browser.scripting.removeCSS({
                    target: {tabId: sender.tab.id},
                    css: generateThemeCss(message.old)
                })
            }
            // And then if there's a new theme to add, add it
            if (message.new.setting !== "light") {
                applyTheme(sender, message.new);
            }
        })
    }
})

function applyTheme(sender, theme) {
    browser.scripting.insertCSS({
        target: { tabId: sender.tab.id },
        files: ["/css/theme_base.css"]
    }).then(() => {
        browser.scripting.insertCSS({
            target: { tabId: sender.tab.id },
            css: generateThemeCss(theme)
        })
    })
}

// Code from https://github.com/PimpTrizkit/PJs/wiki/12.-Shade,-Blend-and-Convert-a-Web-Color-(pSBC.js)
function shadeHexColor(color, percent) {
    let f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

function generateThemeCss(themeObject) {
    let variables;
    if (themeObject.setting !== "custom") {
        variables = possibleThemes.find(theme => theme.value === themeObject.setting).vars;
    } else {
        const colour = themeObject.custom;
        if (themeObject.style === "dark") {
            variables = {
                "theme-text": "#e8e8e8",
                "theme-accent": colour,
                "theme-generic": shadeHexColor(colour, -0.2),
                "body-background": shadeHexColor(colour, -0.4),
                "link-colour": "#59a9ff",
            }
        } else {
            variables = {
                "theme-text": "#000",
                "theme-accent": shadeHexColor(colour, 0.4),
                "theme-generic": shadeHexColor(colour, 0.2),
                "body-background": colour,
                "link-colour": "#345ee7",
            }
        }
    }
    let currentThemeCss = ":root {"
    for (const [name, value] of Object.entries(variables)) {
        currentThemeCss += `--${name}: ${value} !important;`;
    }
    return currentThemeCss + "}";
}