import browser from "webextension-polyfill";
import {ref} from "vue";

let headers = null;

export const statusMessages = ref({});
export const discordLinked = ref(false);
export const weather = ref([]);
export const roomChanges = ref([]);
export const reminders = ref([]);

export function updateReminders() {
    apiGet("reminders", (data) => {
        reminders.value = data;
    })
}

export const cookieFetched = browser.runtime.sendMessage("getCookie");

if (location.pathname === "/") {
    cookieFetched.then(cookie => {
        headers = new Headers({
            "Authorization": `Bearer ${cookie}`,
            "Content-Type": "application/json"
        });
        apiGet("start", (data) => {
            statusMessages.value = data.status;
            discordLinked.value = data.user.discord.linked;
            weather.value = data.weather.forecast;
            roomChanges.value = data.room_changes;
            reminders.value = data.reminders;

            if (!data.user['is_active']) {
                alert("You are banned from Coolbox.");
                browser.runtime.sendMessage("uninstall");
            }

            if (data.user.role !== "student") {
                alert("Sorry! Coolbox is only available to students at the moment.");
                browser.runtime.sendMessage("uninstall");
            }
        });
    });
}

function apiGet(path, callback) {
    fetch(`https://api.coolbox.lol/${path}`, {
        method: "GET",
        headers: headers
    }).then(response => {
        if (response.ok) {
            response.json().then(callback);
        } else {
            console.error("API error:", response);
        }
    }).catch(error => {
        console.error("API error:", error);
    })
}

const toastAnimation = [
    {bottom: "0.25rem", right: '-50%'},
    {bottom: "0.25rem", right: "1rem"},
];

function animateToast(el) {
    el.animate(toastAnimation, {
        duration: 300,
        easing: "cubic-bezier(0.25, 1, 0.5, 1)",
        fill: "forwards",
    }).finished.then(() => {setTimeout(() => {
        el.animate(toastAnimation, {
            duration: 200,
            easing: "cubic-bezier(0.25, 1, 0.5, 1)",
            direction: "reverse",
            fill: "forwards",
        })
    }, 2000)})
}

export function apiSend(method, path, body, successMessage, errorMessage, callback) {
    fetch(`https://api.coolbox.lol/${path}`, {
        method: method,
        headers: headers,
        body: JSON.stringify(body)
    }).then(response => {
        if (response.ok) {
            if (callback) {
                response.json().then(callback).catch((err) => {
                    if (err.message.includes("JSON")) {
                        callback();
                    }
                });
            }
            if (successMessage) {
                const successToast = document.querySelector("#toast-success");
                successToast.querySelector(".content").textContent = successMessage;
                animateToast(successToast);
            }
        } else {
            if (errorMessage) {
                const errorToast = document.querySelector("#toast-failure");
                errorToast.querySelector(".content").textContent = errorMessage;
                animateToast(errorToast);
            }
        }
    }).catch(error => {
        console.error("API error:", error);
    })
}