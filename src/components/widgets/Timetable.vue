<template>
    <div class="mb-4">
        <div v-if="show">
            <h2 class="subheader">{{dayTitle}}</h2>
            <div class="flex sm:flex-row lg:flex-col">
                <!--Timetable Headers-->
                <div class="flex lg:flex-row sm:flex-col">
                    <div v-for="head in timetableHeaders"
                         :class="{'head-active': head.classList.contains('timetable-period-active')}"
                        class="cb-header">
                        {{head.firstChild.textContent}}
                        <div v-html="head.firstElementChild.outerHTML"></div>
                    </div>
                </div>
                <div class="flex lg:flex-row sm:flex-col">
                    <!--A period on the timetable-->
                    <div v-for="timetableSubject in timetableSubjects"
                         :style="{backgroundColor: timetableSubject['style'].getPropertyValue('background-color')}"
                         :class="{
                            'darken': darkenSubjects,
                            'outline': outlineCurrent && timetableSubject.parentElement.classList.contains('timetable-subject-active')
                        }"
                         class="cb-subject"
                         :data-change="c = roomChanges?.find(
                            change => change['class_name'] ===
                                timetableSubject.children[1]?.textContent.slice(1, -1)
                         )">
                        <div v-if="timetableSubject.tagName === 'DIV'">
                            <!--The title of the subject-->
                            <a :href="timetableSubject.firstElementChild?.href" class="cb-link">
                                {{
                                    prettySubjects?.find(
                                        subject => subject['name']?.toLowerCase() === timetableSubject.children[1]?.textContent.slice(1,-1)?.toLowerCase()
                                    )?.pretty
                                    || timetableSubject.firstElementChild?.textContent
                                }}
                            </a>
                            <br>
                            <!--The id of the subject-->
                            <span>{{timetableSubject.children[1]?.textContent}}</span><br>
                            <!--The room of the subject-->
                            <div>
                                <!--The normal room, struck through if a roomchange exists-->
                                <span :class="{strike: c}">{{timetableSubject.children[2]?.textContent}}</span>
                                <!--The room change, if applicable-->
                                <div class="dui-tooltip ml-1" data-tip='Room Change' v-if="c">
                                <span class="font-semibold">
                                    → {{c['assigned_room']}}
                                </span>
                                </div>
                            </div>
                        </div>
                    </div>
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

<script setup>
import EditingContextMenu from "~/components/other/EditingContextMenu.vue";
import {statusMessages, roomChanges} from "~/utils/apiUtils";
import {ref} from "vue";
import browser from "webextension-polyfill";
import {useExtensionStorage} from "~/utils/componentUtils";

const darkenSubjects = useExtensionStorage("timetable.dark", false);
const outlineCurrent = useExtensionStorage("timetable.outline", false);

const dayTitle = ref(document.querySelector("[data-timetable-header]")?.textContent);
const prettySubjects = ref([]);

browser.storage.local.get("subjects").then(data => {
    prettySubjects.value = data.subjects?.value || []
})

const timetableSubjects = ref();
const show = ref();
const timetableHeaders = ref();

function updateTimetable() {
    // Quirky Firefox not supporting :has and using its own proprietary pseudoclass
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        timetableSubjects.value = document.querySelectorAll(".timetable .timetable-subject, .timetable td:-moz-only-whitespace");
    } else {
        timetableSubjects.value = document.querySelectorAll(".timetable .timetable-subject, .timetable td:not(td:has(.timetable-subject))")
    }
    show.value = Boolean(timetableSubjects.value.length);
    timetableHeaders.value = document.querySelectorAll(".timetable th");
}

updateTimetable()

// Not remotely scuff code to wait until calendar is loaded and add the week number to the heading
setTimeout(() => {
    const calendarEvents = document.querySelectorAll(".fc-event-title");
    const weekEvent = Array.from(calendarEvents).find(el => el.innerText.includes("Week") && el.innerText.includes("(W"));
    const weekNo = weekEvent?.innerText.slice(5,-5);
    dayTitle.value += ` (Week ${weekNo})`;
}, 1500);

defineProps({
    widgInfo: Object
})
</script>

<style scoped>
.cb-subject a {
    color: #085ba5;
}
.cb-subject {
    @apply p-4 lg:w-1/5 lg:h-auto text-sm sm:w-full sm:h-1/5;
}
.cb-subject.darken {
    filter: brightness(0.8);
}
.cb-subject.outline {
    outline: 2px solid #355983;
    outline-offset: -2px;
    position: relative;
}
.cb-subject.outline::after {
    border-top: 10px solid #355983;
    border-right: 10px solid #355983;
    border-bottom: 10px solid transparent;
    border-left: 10px solid transparent;
    height: 20px;
    aspect-ratio: 1/1;
    position: absolute;
    top: 0;
    right: 0;
    content: "";
}
.cb-header {
    @apply p-3 lg:w-1/5 text-sm bg-primary text-themeText sm:w-full sm:h-full;
}
.strike {
    @apply line-through text-red-500;
}
.head-active {
    @apply bg-accent;
}
.cb-header:first-child {@apply rounded-tl-lg;}
.cb-header:last-child {@apply rounded-tr-lg;}
.cb-subject:first-child {@apply rounded-bl-lg;}
.cb-subject:last-child {@apply rounded-br-lg;}
</style>