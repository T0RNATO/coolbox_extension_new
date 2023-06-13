<template v-if="show">
    <div v-html="timetable.innerHTML"></div>
    <hr>
</template>

<script setup>
const timetable = document.querySelector("div[data-timetable-container]");
const show = Boolean(timetable);
</script>