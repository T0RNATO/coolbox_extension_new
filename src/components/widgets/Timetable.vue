<template>
    <div class="mb-4">
        <div v-if="show">
            <h2 class="subheader">{{dayTitle}}</h2>
            <div v-html="timetable.outerHTML" class="mb-3"></div>
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

const timetable = document.querySelector(".timetable");
const dayTitle = document.querySelector("[data-timetable-header]").textContent;

const show = Boolean(timetable);

defineProps({
    widgInfo: Object
})
</script>

<style>
.timetable-subject {
    height: 100% !important;
}
</style>