import browser from "webextension-polyfill";

browser.storage.local.get(["theme", "pfp", "hidepwa"]).then(result => {
    if (result?.theme) {
        browser.runtime.sendMessage("applyTheme");
    }
    document.addEventListener("DOMContentLoaded", () => {
        if (result.pfp) {
            document.body.classList.add("hide-pfp");
        }
        if (result.hidepwa) {
            document.body.classList.add("hide-pwa");
        }
    })
})