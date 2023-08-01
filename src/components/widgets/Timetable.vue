<template>
    <div class="mb-4">
        <div v-if="show">
            <h2 class="subheader">{{dayTitle}}</h2>
            <div class="flex sm:flex-row lg:flex-col">
                <div class="flex lg:flex-row sm:flex-col">
                    <div v-for="head in timetableHeaders"
                         class="cb-header"
                         :class="{'head-active': head.classList.contains('timetable-period-active')}"
                    >
                        {{head.firstChild.textContent}}
                        <div v-html="head.firstElementChild.outerHTML"></div>
                    </div>
                </div>
                <div class="flex lg:flex-row sm:flex-col">
                    <!--A period on the timetable-->
                    <div v-for="timetableSubject in timetableSubjects"
                         :style="{backgroundColor: timetableSubject['style'].getPropertyValue('background-color')}"
                         class="cb-subject"
                         :data-change="c = roomChanges?.find(
                            change => change['class_name'] ===
                                timetableSubject.children[1]?.textContent.slice(1, -1)
                         )">
                        <!--The title of the subject-->
                        <a :href="timetableSubject.firstElementChild?.href">
                            {{
                                prettySubjects?.find(
                                    subject => subject['name'] === timetableSubject.children[1]?.textContent.slice(1,-1)
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
        <span class="italic text-gray-500" v-else-if="widgInfo['edit']">(Timetable Widget)</span>

        <span class="text-red-500 text-2xl">{{statusMessages.critical}}</span>

        <EditingContextMenu @delete="$emit('delete')"/>
    </div>
</template>

<script setup>
import EditingContextMenu from "~/components/EditingContextMenu.vue";
import {statusMessages, roomChanges} from "~/utils/apiUtils";
import {ref} from "vue";
import browser from "webextension-polyfill";

const prettySubjects = ref([]);

browser.storage.local.get("subjects").then(data => {
    prettySubjects.value = data.subjects?.value || []
})

const timetableSubjects = document.querySelectorAll(".timetable .timetable-subject");

const show = Boolean(timetableSubjects.length);

const timetableHeaders = document.querySelectorAll(".timetable th");
const dayTitle = document.querySelector("[data-timetable-header]")?.textContent;

defineProps({
    widgInfo: Object
})
</script>

<style scoped>
.cb-subject a {
    color: #085ba5;
}
.cb-subject {
    @apply p-4 lg:w-1/5 text-sm sm:w-full;
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
</style>