<template v-if="show">
    <div v-html="timetable.innerHTML" class="mb-3"></div>
</template>

<script setup>
const timetable = document.querySelector("div[data-timetable-container]");
const show = Boolean(timetable);
</script>
