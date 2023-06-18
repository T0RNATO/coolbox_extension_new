<template>
    <div>
        <div v-if="show">
            <div v-html="timetable.innerHTML" class="mb-3"></div>
        </div>
        <span class="italic text-gray-500" v-else-if="editMode">(Timetable Widget)</span>
        <EditingContextMenu @delete="$emit('delete')"/>
    </div>
</template>

<script setup>
import EditingContextMenu from "~/components/EditingContextMenu.vue";

const timetable = document.querySelector("div[data-timetable-container]");
const show = Boolean(timetable);

defineProps({
    "editMode": Boolean
})
</script>
