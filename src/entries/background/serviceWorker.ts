import browser from "webextension-polyfill";
// @ts-ignore
import {applyTheme, updateTheme} from "./themes";
// @ts-ignore
import {Reminder, Theme} from "../../utils/types";

type UpdateThemeMessage = {type: string, old: Theme, new: Theme}

browser.runtime.onMessage.addListener((message: string | UpdateThemeMessage, sender, sendResponse: (cookie: string) => void) => {
    switch (message) {
        case "applyTheme":
            applyTheme(sender.tab.id)
            break;
        case "getCookie":
            browser.cookies.get({"url": "https://schoolbox.donvale.vic.edu.au/", "name": "PHPSESSID"}).then(cookie => {
                sendResponse(cookie.value);
            })
            return true;
        case "createNotifications":
            checkReminders()
            break
        case "uninstall":
            browser.management.uninstallSelf();
            break;
        default:
            if (typeof message == "string") break;
            if (message.type == "updateTheme") {
                updateTheme(sender.tab.id, message.old, message.new)
            }
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
            type: ("basic" as browser.Notifications.TemplateType),
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

function redirectToSchoolbox(reminderData: string) {
    const reminder: Reminder = JSON.parse(reminderData);
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