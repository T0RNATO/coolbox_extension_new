import { createApp } from "vue";
import renderContent from "../renderContent";
import App from "./Homepage.vue";
import "tailwindcss/tailwind.css";
import shadow from 'vue-shadow-dom'
import browser from "webextension-polyfill";
import {apiSend, cookieFetched} from "~/utils/apiUtils";

let collatedErrors = [];

function errorHandler(err, instance, info) {
    console.error(err);
    collatedErrors.push({error: JSON.stringify(err), detail: info})
}

if (location.pathname === "/") {
    renderContent(import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS, (appRoot) => {
        const app = createApp(App);

        setInterval(() => {
            if (collatedErrors.length) {
                apiSend("POST", "error-report", collatedErrors);
                collatedErrors = [];
            }
        }, 2000);

        app.config.errorHandler = errorHandler;
        app.config.warnHandler = errorHandler;

        app.use(shadow);
        app.mount(appRoot);
    });
}

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
    for (const sidebarItem of document.querySelectorAll("#side-menu-mysubjects li a")) {
        const subject = names.filter(name => {
            const linkSections = sidebarItem.href.split("/");
            return name.name?.toLowerCase() === linkSections[linkSections.length - 1]?.toLowerCase()
        })[0];
        if (subject) {
            let content = sidebarItem.textContent;
            let lastChar = content.charAt(content.length - 1);
            sidebarItem.textContent = subject.pretty;
            if (lastChar === lastChar.toUpperCase()) {
                sidebarItem.textContent += ` (${lastChar})`;
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