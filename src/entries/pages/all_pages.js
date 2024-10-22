import {createApp, reactive, h} from "vue";
import render_content from "./render_content.js";
import Homepage from "./homepage/Homepage.vue";
import CalendarPage from "~/entries/pages/calendar/CalendarPage.vue";
import shadow from 'vue-shadow-dom'
import browser from "webextension-polyfill";
import {apiSend, cookieFetched} from "~/utils/apiUtils";
import {addViteStyleTarget} from "@samrum/vite-plugin-web-extension/client";
import TodoPage from "~/entries/pages/todo/TodoPage.vue";

if (import.meta.env.DEV) {
    import("tailwindcss/tailwind.css");
}

addViteStyleTarget(document.head);

const VueInjections = {
    "/": Homepage,
    "/coolbox-calendar": CalendarPage,
    "/coolbox-todo": TodoPage,
}

const appProps = reactive({subjects: [{name: 'Loading...', pretty: 'Loading...'}]})

// Render Vue
if (location.pathname in VueInjections) {
    render_content((appRoot) => {
        const app = createApp({
            render: () => h(VueInjections[location.pathname], appProps)
        });
        app.use(shadow);
        app.mount(appRoot);
    });
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
    appProps.subjects = names;
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

const replacementNavIcons = [
    "schedule",
    "school",
    "download", //or place_item
    "check",
    "calendar_month",
    "newspaper",
]

const nav = document.querySelector("#top-menu");

for (const [i, item] of Object.entries(nav.children)) {
    const anchor = item.firstElementChild;
    anchor.classList = [];
    anchor.innerHTML = `
        <span class="cb-icon icon-fill" style="font-size: 1.5rem; margin-bottom: .25rem">${replacementNavIcons[i]}</span>
    ` + anchor.innerHTML;
}

    const todoButton = document.createElement("li");
    todoButton.style.display = 'list-item';
    todoButton.addEventListener("click", () => {
        browser.storage.local.set({checkedNewFeatures: true});
        nav.querySelector(".dui-indicator").style.opacity = "0";
    })
    todoButton.innerHTML = `
        <a href="/coolbox-todo">
            <div class="dui-indicator flex flex-col w-full">
                <span class="dui-indicator-item dui-badge dui-badge-secondary !h-[18px] opacity-0"></span>
                <span class="cb-icon icon-fill" style="font-size: 1.5rem">list_alt</span>
                <span style="margin-top: .25rem;">To-Do Lists</span>
            </div>
        </a>`

browser.storage.local.get("checkedNewFeatures").then((data) => {
    if (!data.checkedNewFeatures) {
        nav.querySelector(".dui-badge").style.opacity = "1";
    }
});

nav.appendChild(todoButton);