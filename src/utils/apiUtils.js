import browser from "webextension-polyfill";
import {ref} from "vue";

let headers = null;

export const criticalMessage = ref("");
export const infoMessage = ref("");
export const discordLinked = ref("");
export const weather = ref([]);
export const roomChanges = ref([]);

export const cookieFetched = browser.runtime.sendMessage("getCookie");
cookieFetched.then(cookie => {
    headers = new Headers({
        "Authorization": `Bearer ${cookie}`,
        "Content-Type": "application/json"
    })

    apiGet("start", (data) => {
        criticalMessage.value = data.status.critical;
        infoMessage.value = data.status.info;
        discordLinked.value = data.user.discord.linked;
        weather.value = data.weather.forecast;
        roomChanges.value = data.room_changes;
    })

    // apiGet("stats/message", (status) => {
    //     criticalMessage.value = status.critical;
    //     infoMessage.value = status.info;
    // })
    //
    // apiGet("room-changes", (info) => {
    //     roomChanges.value = info['room_changes'];
    // });
})

export function apiGet(path, callback) {
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
    {bottom: "0.25rem", right: '-25%'},
    {bottom: "0.25rem", right: "1rem"},
];

function animateToast(el) {
    el.animate(toastAnimation, {
        duration: 150,
        easing: "cubic-bezier(0.25, 1, 0.5, 1)",
        fill: "forwards",
    }).finished.then(() => {setTimeout(() => {
        el.animate(toastAnimation, {
            duration: 100,
            easing: "cubic-bezier(0.25, 1, 0.5, 1)",
            direction: "reverse",
            fill: "forwards",
        })
    }, 1200)})
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