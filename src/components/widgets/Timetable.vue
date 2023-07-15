<template>
    <div class="mb-4">
        <div v-if="show">
            <h2 class="subheader">{{dayTitle}}</h2>
<!--            <div v-html="timetable.outerHTML" class="mb-3"></div>-->
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
                    <div v-for="sub in timetableSubjects" v-html="sub.innerHTML"
                         :style="{backgroundColor: sub.style.getPropertyValue('background-color')}"
                         class="p-4 w-1/5 text-sm cb-subject"
                    ></div>
                </div>
            </div>
        </div>
        <span class="italic text-gray-500" v-else-if="widgInfo['edit']">(Timetable Widget)</span>

        <span class="text-red-500 text-2xl">{{criticalMessage}}</span>

        <EditingContextMenu @delete="$emit('delete')" :settings="true">
            Nicer Subject Names: <input type="checkbox" class="dui-toggle">
        </EditingContextMenu>
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

<style>
.cb-subject a {
    color: #085ba5;
}
</style>