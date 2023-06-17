<template>
    <div v-if="show">
        <div v-html="timetable.innerHTML" class="mb-3"></div>
    </div>
    <span v-else class="italic text-gray-500" v-if="editMode">(Timetable Widget)</span>
</template>

<script setup>
const timetable = document.querySelector("div[data-timetable-container]");
const show = Boolean(timetable);

defineProps({
    "editMode": Boolean
})
</script>
