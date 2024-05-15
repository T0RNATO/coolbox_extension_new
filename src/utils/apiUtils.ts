import browser from "webextension-polyfill";
import {ref} from "vue";
import type {Ref} from 'vue';
import purify from 'dompurify'
// @ts-ignore
import {Reminder, RoomChange} from "./types";

let headers = null;

interface ApiResponse {
    user: {
        name: string;
        id: string;
        year: number;
        role: string;
        is_active: boolean;
        discord: {
            linked: boolean;
            info: {
                id: string;
                username: string;
                avatar: string;
                discriminator: string;
                public_flags: number;
                premium_type: number;
                flags: number;
                banner: string | null;
                accent_color: number;
                global_name: string;
                avatar_decoration_data: string | null;
                banner_color: string;
                mfa_enabled: boolean;
                locale: string;
            };
        };
    };
    status: {
        info: string | null;
        critical: string | null;
        message: string | null;
    };
    reminders: Array<any>;
    weather: {
        last_updated: string;
        forecast: any;
    };
    room_changes: Array<any>;
    daily_verse: {
        content: string;
        reference: string;
        link: string;
    }
}

export const statusMessages: Ref<{
    info?: string;
    critical?: string;
    message?: string;
}> = ref({});
export const discordLinked = ref(false);
export const weather: Ref<Array<{
    time: string;
    time_real: string;
    weathercode: {
        icon: string;
        message: string;
    };
    uv_index_max: number;
    temperature_2m_max: number;
    temperature_2m_min: number;
    precipitation_probability_mean: number;
}>> = ref([]);
export const roomChanges: Ref<RoomChange[]> = ref([]);
export const reminders: Ref<Reminder[]> = ref([]);
export const dailyVerse = ref({
    content: null,
    reference: null,
    link: null,
});

const periodChangeListeners = [];

export function periodChange() {
    for (const func of periodChangeListeners) {
        func()
    }
}

export function onPeriodChange(listener) {
    periodChangeListeners.push(listener);
}

export function updateReminders() {
    apiGet("reminders", (data) => {
        reminders.value = data;
    })
}

export const cookieFetched = browser.runtime.sendMessage("getCookie");
let triggerApiRespondedEvent: (value?: unknown) => void;
export const apiResponded = new Promise(resolve => {
    triggerApiRespondedEvent = resolve;
})

function processApiData(data: ApiResponse) {
    statusMessages.value = data.status;
    discordLinked.value = data.user.discord?.linked;
    weather.value = data.weather.forecast;
    roomChanges.value = data.room_changes;
    reminders.value = data.reminders;
    triggerApiRespondedEvent();
    {
        const {content, link, reference} = data.daily_verse;
        dailyVerse.value = {
            link,
            reference,
            content: purify.sanitize(content)
        };
    }

    if (data.user.is_active === false) {
        alert("You are banned from Coolbox.");
        browser.runtime.sendMessage("uninstall");
    }

    if (data.user.role !== "student") {
        alert("Sorry! Coolbox is only available to students at the moment.");
        browser.runtime.sendMessage("uninstall");
    }

    history.replaceState(data, "", location.href);
}

if (location.pathname === "/") {
    cookieFetched.then(cookie => {
        headers = new Headers({
            "Authorization": `Bearer ${cookie}`,
            "Content-Type": "application/json"
        });
        if (!history.state) {
            apiGet("start", processApiData);
        }
    });
}

if (history.state) {
    processApiData(history.state);
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

function animateToast(el: Element) {
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

export function successToast(message: string) {
    const successToast = document.querySelector("#toast-success");
    successToast.querySelector(".content").textContent = message;
    animateToast(successToast);
}

export function apiSend(method: string, path: string, body: any, successMessage: string, errorMessage: string, callback) {
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
                successToast(successMessage);
            }
        } else if (errorMessage) {
            const errorToast = document.querySelector("#toast-failure");
            errorToast.querySelector(".content").textContent = errorMessage;
            animateToast(errorToast);
        }
    }).catch(error => {
        console.error("API error:", error);
    })
}
