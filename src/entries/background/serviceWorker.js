import browser from "webextension-polyfill";
import {possibleThemes} from "~/utils/themes.js";
import {shadeHexColor} from "~/utils/utilFunctions";

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
    } else if (message === "getCookie") {
        browser.cookies.get({"url": "https://schoolbox.donvale.vic.edu.au/", "name": "PHPSESSID"}).then(cookie => {
            sendResponse(cookie.value);
        })
        return true;
    } else if (message === "createNotifications") {
        checkReminders();
    }
})

// Creates a loop to check for desktop reminders every 15 minutes
browser.alarms.create("cb-notification-loop", {periodInMinutes: 10, delayInMinutes: 0})

browser.alarms.onAlarm.addListener(alarm => {
    // Loop through all the notifications and check if any of them are due
    if (alarm.name === "cb-notification-loop") {
        checkReminders();
    } else if (alarm.name.startsWith("cba-")) {
        const reminder = JSON.parse(alarm.name.replace("cba-", ""));

        const notificationOptions = {
            buttons: [
                {title: "View on Schoolbox"}
            ],
            iconUrl: "/icons/icon.png",
            title: reminder.title,
            requireInteraction: true,
            message: "You have a notification for " + reminder.title,
            type: "basic",
            priority: 2
        }
        // Removes non-firefox compatible stuff if it's a firefox extension
        if (chrome.runtime.getURL('').startsWith('moz-extension://')) {
            delete notificationOptions.buttons;
            delete notificationOptions.requireInteraction;
        }

        console.log('Notification triggered: ', reminder);
        browser.notifications.create(JSON.stringify(reminder), notificationOptions);
    }
})
browser.notifications.onButtonClicked.addListener(redirectToSchoolbox)
browser.notifications.onClicked.addListener(redirectToSchoolbox)

function redirectToSchoolbox(notif) {
    const reminder = JSON.parse(notif);
    if (reminder.assessment) {
        browser.tabs.create({
            url: "https://schoolbox.donvale.vic.edu.au/learning/assessments/" + reminder.assessment
        })
    } else {
        browser.tabs.create({
            url: "https://schoolbox.donvale.vic.edu.au/"
        })
    }
}

function checkReminders() {
    browser.cookies.get({"url": "https://schoolbox.donvale.vic.edu.au/", "name": "PHPSESSID"}).then(cookie => {
        if (cookie) {
            fetch("https://api.coolbox.lol/reminders", {
                method: "GET",
                headers: new Headers({
                    "Authorization": `Bearer ${cookie.value}`,
                    "Content-Type": "application/json"
                })
            }).then(response => {response.json().then((reminders) => {
                for (const reminder of reminders) {
                    if (reminder.method === "desktop" || reminder.method === "both") {
                        browser.alarms.create("cba-" + JSON.stringify(reminder), {when: reminder['due']});
                    }
                }
            })})
        }
    })
}

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