import { createApp } from "vue";
import renderContent from "./renderContent";
import App from "./homepage/Homepage.vue";
import shadow from 'vue-shadow-dom'
import browser from "webextension-polyfill";
import {apiSend, cookieFetched} from "~/utils/apiUtils";
import {coolboxifyCalendar} from "~/entries/contentScript/calendar/calendar.ts";
import {addViteStyleTarget} from "@samrum/vite-plugin-web-extension/client";

if (import.meta.env.DEV) {
    import("tailwindcss/tailwind.css");
}

addViteStyleTarget(document.head);

// let collatedErrors = [];


// Enum of the error codes used in prod
// const errorCodes = {
//     0: "SETUP_FUNCTION",
//     1: "RENDER_FUNCTION",
//     2: "WATCH_GETTER",
//     3: "WATCH_CALLBACK",
//     4: "WATCH_CLEANUP",
//     5: "NATIVE_EVENT_HANDLER",
//     6: "COMPONENT_EVENT_HANDLER",
//     7: "VNODE_HOOK",
//     8: "DIRECTIVE_HOOK",
//     9: "TRANSITION_HOOK",
//     10: "APP_ERROR_HANDLER",
//     11: "APP_WARN_HANDLER",
//     12: "FUNCTION_REF",
//     13: "ASYNC_COMPONENT_LOADER",
//     14: "SCHEDULER",
// }

// function errorHandler(err, instance, info) {
//     collatedErrors.push({error: err.toString(), detail: errorCodes?.[info]})
// }

// Render Vue on the homepage
if (location.pathname === "/") {
    renderContent((appRoot) => {
        const app = createApp(App);

        // If this is in prod, report any collected errors to the api
        // if (process.env.NODE_ENV === "production") {
        //     setInterval(() => {
        //         if (collatedErrors.length) {
        //             apiSend("POST", "error-report", collatedErrors);
        //             collatedErrors = [];
        //         }
        //     }, 2000);
        //
        //     app.config.errorHandler = errorHandler;
        //     app.config.warnHandler = errorHandler;
        // }

        app.use(shadow);
        app.mount(appRoot);
    });
} else if (location.pathname === "/calendar/week") {
    coolboxifyCalendar();
}

// Hide profile picture if needed, and apply pretty subjects to sidebar
browser.storage.local.get(["pfp", "subjects"]).then(data => {
    cookieFetched.then(() => {
        if (data.pfp) {
            document.body.classList.add("hide-pfp");
        }
        if (data.subjects) {
            if (data.subjects.time + 1000 * 60 * 60 * 24 > Date.now()) {
                setPrettySubjectNames(data.subjects.value);
            } else {
                fetchPrettySubjectNames();
            }
        } else {
            fetchPrettySubjectNames();
        }
    })
})

function fetchPrettySubjectNames() {
    const subjectNames = Array.from(document.querySelectorAll("#side-menu-mysubjects li a"))
    const mappedSubjects = subjectNames.map(el => {
        const linkSections = el.href.split("/");
        return {name: linkSections[linkSections.length - 1]}
    })

    apiSend("POST", "subjects", mappedSubjects, null, null,
        (data) => {
            browser.storage.local.set({subjects: {value: data, time: Date.now()}});
            setPrettySubjectNames(data);
        }
    )
}

function setPrettySubjectNames(names) {
    // Loop through subjects on sidebar to update their names
    for (const sidebarItem of document.querySelectorAll("#side-menu-mysubjects li a")) {
        // Match the subject name to the link because Schoolbox doesn't set the name correctly
        const subject = names.filter(name => {
            const linkSections = sidebarItem.href.split("/");
            return name.name?.toLowerCase() === linkSections[linkSections.length - 1]?.toLowerCase()
        })[0];
        if (subject) {
            let content = sidebarItem.textContent;
            // Get the last character of the subject name, which is usually the class letter like ABCD
            let lastChar = content.charAt(content.length - 1);
            sidebarItem.textContent = subject.pretty;
            // Check if it's uppercase, which is a good indicator that it's the class letter, and add it back
            if (lastChar === lastChar.toUpperCase()) {
                sidebarItem.textContent += ` (${lastChar})`;
            }
        }
    }
    // Full timetable page
    if (location.pathname === "/timetable") {
        for (const timetableItem of document.querySelectorAll(".timetable-subject > div")) {
            const subject = names.filter(name =>
                name.name?.toLowerCase() === timetableItem.firstChild.textContent.slice(1,-1)?.toLowerCase())[0];
            if (subject) {
                timetableItem.previousElementSibling.textContent = subject.pretty;
            }
        }
    }
}

browser.storage.local.onChanged.addListener((changes) => {
    if (changes.pfp) {
        if (changes.pfp.newValue) {
            document.body.classList.add("hide-pfp");
        } else {
            document.body.classList.remove("hide-pfp");
        }
    }
});