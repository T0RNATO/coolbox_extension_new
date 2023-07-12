import { createApp } from "vue";
import renderContent from "../renderContent";
import App from "./Homepage.vue";
import "tailwindcss/tailwind.css";
import shadow from 'vue-shadow-dom'
import browser from "webextension-polyfill";
import {apiSend} from "~/utils/apiUtils";

if (location.pathname === "/") {
    renderContent(import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS, (appRoot) => {
        const app= createApp(App);
        app.use(shadow);
        app.mount(appRoot);
    });
}

browser.storage.local.get(["pfp", "subjects"]).then(data => {
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

function fetchPrettySubjectNames() {
    apiSend("POST", "subjects",
        Array.from(document.querySelectorAll("#side-menu-mysubjects li a")).map(el => {return {name: el.textContent}}),
        null, null, (data) => {
            browser.storage.local.set({subjects: {value: data, time: Date.now()}});
            setPrettySubjectNames(data);
        }
    )
}

function setPrettySubjectNames(names) {
    for (const sidebarItem of document.querySelectorAll("#side-menu-mysubjects li a")) {
        const subject = names.filter(name => name.name === sidebarItem.textContent)[0];
        if (subject) {
            sidebarItem.textContent = subject.pretty;
        }
    }

    for (const timetableItem of document.querySelectorAll(".timetable-subject a")) {
        const subject = names.filter(name => name.name === timetableItem.nextElementSibling.textContent.replace(/\(|\)/g, ""))[0];
        if (subject) {
            timetableItem.textContent = subject.pretty;
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