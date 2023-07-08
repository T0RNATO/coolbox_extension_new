import browser from "webextension-polyfill";

let headers = null;

browser.runtime.sendMessage("getCookie").then(cookie => {
    headers = new Headers({
        "Authorization": `Bearer ${cookie}`,
        "Content-Type": "application/json"
    })
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

export function apiSend(method, path, body, callbackOrMessage, errorMessage) {
        fetch(`https://api.coolbox.lol/${path}`, {
            method: method,
            headers: headers,
            body: JSON.stringify(body)
        }).then(response => {
            if (response.ok) {
                if (typeof callbackOrMessage === "function") {
                    response.json().then(callbackOrMessage).catch(() => {});
                } else if (typeof callbackOrMessage === "string") {
                    const successToast = document.querySelector("#toast-success");
                    successToast.querySelector(".content").textContent = callbackOrMessage;
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