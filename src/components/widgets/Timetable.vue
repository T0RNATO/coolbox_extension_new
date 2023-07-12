<template>
    <div class="mb-4">
        <div v-if="show">
            <div v-html="timetable.innerHTML" class="mb-3"></div>
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

const timetable = document.querySelector("div[data-timetable-container]");
const show = Boolean(timetable);

defineProps({
    widgInfo: Object
})
</script>
