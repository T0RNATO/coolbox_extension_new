<template>
    <div class="mb-4">
        <div v-if="show">
            <h2 class="subheader">{{dayTitle}}</h2>
            <div>
                <div class="flex">
                    <div v-for="head in timetableHeaders"
                         class="p-3 w-1/5 text-sm bg-primary text-themeText"
                    >
                        {{head.firstChild.textContent}}
                        <div v-html="head.firstElementChild.outerHTML"></div>
                    </div>
                </div>
                <div class="flex">
                    <div v-for="sub in timetableSubjects"
                         :style="{backgroundColor: sub.style.getPropertyValue('background-color')}"
                         class="p-4 w-1/5 text-sm cb-subject"
                         :data-change="c = changes?.find(
                            change => change['class_name'] ===
                                sub.children[1].textContent.match(/\(([^)]+)\)/)[1]
                         )"
                    >
                        <a :href="sub.firstElementChild.href">{{
                            pretty?.filter(name => name.name === sub.firstElementChild.textContent)[0]?.pretty
                            || sub.firstElementChild.textContent
                        }}</a><br>
                        <span>{{sub.children[1].textContent}}</span><br>
                        <span>
                            <span :class="{strike: c}">{{sub.children[2].textContent}}</span>
                            <span v-if="c" class="font-semibold">
                                → {{c}}
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <span class="italic text-gray-500" v-else-if="widgInfo['edit']">(Timetable Widget)</span>

        <span class="text-red-500 text-2xl">{{criticalMessage}}</span>

        <EditingContextMenu @delete="$emit('delete')"/>
    </div>
</template>

<script setup>
import EditingContextMenu from "~/components/EditingContextMenu.vue";
import {criticalMessage} from "~/utils/apiUtils";

const timetableSubjects = document.querySelectorAll(".timetable .timetable-subject");

const show = Boolean(timetableSubjects.length);
const timetableHeaders = document.querySelectorAll(".timetable th");
const dayTitle = document.querySelector("[data-timetable-header]")?.textContent;

defineProps({
    widgInfo: Object
})
</script>

<script>
import {apiGet, cookieFetched} from "~/utils/apiUtils";
import {computed} from "vue";
import browser from "webextension-polyfill";

let roomChanges = [];
let prettyNames = [];

cookieFetched.then(() => {
    apiGet("room-changes", (info) => {
        roomChanges = info['room_changes'];
    });
    browser.storage.local.get("subjects").then(data => {
        prettyNames = data.subjects.value;
    })
})

export default {
    setup() {
        const changes = computed(() => {return roomChanges})
        const pretty = computed(() => {return prettyNames})
        return {
            changes, pretty
        }
    }
}
</script>

<style>
.cb-subject a {
    color: #085ba5;
}
.strike {
    @apply line-through text-red-500;
}
</style>