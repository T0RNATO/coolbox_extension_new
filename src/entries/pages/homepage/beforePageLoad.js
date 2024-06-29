import browser from "webextension-polyfill";

browser.storage.local.get("theme").then(result => {
    if (result) {
        browser.runtime.sendMessage("applyTheme");
    }
})