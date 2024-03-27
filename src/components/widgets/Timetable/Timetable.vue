<template>
    <div class="mb-4 text-sm">
        <div v-if="show">
            <h2 class="subheader">{{dayTitle}}</h2>
            <div class="flex sm:flex-row lg:flex-col">
                <!--Timetable Headers-->
                <div class="flex lg:flex-row sm:flex-col">
                    <div v-for="head in timetableHeaders"
                         :class="{'head-active': head.classList.contains('timetable-period-active'), 'small': widgInfo.add}"
                        class="cb-header">
                        {{head.firstChild.textContent}}
                        <div v-html="head.firstElementChild.outerHTML"></div>
                    </div>
                </div>
                <div class="flex lg:flex-row sm:flex-col">
                    <Subject v-for="(timetableSubject, i) in timetableSubjects"
                             :subject="timetableSubject"
                             :pretty="prettySubjects"
                             :period="i"
                             :small_text="widgInfo.add"
                    />
                </div>
            </div>
        </div>
        <span class="italic text-gray-500" v-else-if="widgInfo['edit']">(Timetable Widget)</span>

        <span class="text-red-500 text-2xl whitespace-pre-line">{{statusMessages.critical}}</span>

        <EditingContextMenu @delete="$emit('delete')" settings="true">
            <div class="option">
                <input type="checkbox" class="dui-checkbox" id="darken" v-model="darkenSubjects">
                <label for="darken">Darken Timetable Colours</label>
            </div>
            <div class="option">
                <input type="checkbox" class="dui-checkbox" id="outline" v-model="outlineCurrent">
                <label for="outline">Outline Current Class</label>
            </div>
        </EditingContextMenu>
    </div>
</template>

<script setup lang="ts">
import EditingContextMenu from "~/components/other/EditingContextMenu.vue";
import {statusMessages, onPeriodChange} from "~/utils/apiUtils";
import {Ref, ref} from "vue";
import browser from "webextension-polyfill";
import {useExtensionStorage} from "~/utils/componentUtils";
import Subject from "~/components/widgets/Timetable/Subject.vue";
import type {widgInfo} from "~/utils/types";

const darkenSubjects = useExtensionStorage("timetable.dark", false);
const outlineCurrent = useExtensionStorage("timetable.outline", false);

const dayTitle = ref(document.querySelector("[data-timetable-header]")?.textContent);

type Elements = Ref<NodeListOf<HTMLElement>>;
type Subjects = Ref<{name: string, pretty: string}[]>;

const timetableSubjects: Elements = ref();
const timetableHeaders: Elements = ref();
const show: Ref<boolean> = ref();

const prettySubjects: Subjects = ref([]);

browser.storage.local.get("subjects").then(data => {
    prettySubjects.value = data.subjects?.value || []
})

function updateTimetable(page: Document) {
    // Quirky Firefox not supporting :has and using its own proprietary pseudoclass
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        timetableSubjects.value = page.querySelectorAll(".timetable .timetable-subject, .timetable td:-moz-only-whitespace");
    } else {
        timetableSubjects.value = page.querySelectorAll(".timetable .timetable-subject, .timetable td:not(td:has(.timetable-subject))")
    }
    show.value = Boolean(timetableSubjects.value.length);
    timetableHeaders.value = page.querySelectorAll(".timetable th");
}

updateTimetable(document)

const domParser = new DOMParser();

// this just.. doesnt work todo: fix
onPeriodChange(() => {
    fetch(location.href).then((data) => data.text().then((page) => {
        updateTimetable(domParser.parseFromString(page, "text/html"))
    }))
})

// Not remotely scuff code to wait until calendar is loaded and add the week number to the heading
setTimeout(() => {
    const calendarEvents: HTMLSpanElement[] = Array.from(document.querySelectorAll(".fc-event-title"));
    const weekEvent = calendarEvents.find(el => el.innerText.includes("Week") && el.innerText.includes("(W"));
    const weekNo = weekEvent?.innerText.slice(5,-5).trimEnd();
    dayTitle.value += ` (Week ${weekNo})`;
}, 1500);

defineProps<{
    widgInfo: widgInfo
}>()
</script>

<style scoped>
.cb-header {
    @apply p-3 lg:w-1/5 text-sm bg-primary text-themeText sm:w-full sm:h-full;
}
.small :deep(time), .small {
    font-size: 10px !important;
    line-height: 12px;
}
.head-active {
    @apply bg-accent;
}
.cb-header {
    @apply first:rounded-tl-lg lg:last:rounded-tr-lg sm:max-lg:last:rounded-bl-lg;
}
</style>