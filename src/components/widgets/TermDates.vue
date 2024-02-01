<script setup>
import EditingContextMenu from "~/components/other/EditingContextMenu.vue";

const dates = document.querySelector("#component146956 article");

defineProps({widgInfo: Object});
</script>

<template>
<div class="relative">
    <h2 class="subheader">Term Dates</h2>
    <div class="rounded-xl bg-primary p-2">
        <div v-for="date of dates?.children" class="text-themeText *:!text-themeText mb-2" v-html="date?.innerHTML"></div>
    </div>

    <EditingContextMenu @delete="$emit('delete')"/>
</div>
</template>

<style scoped>
span {
    position: absolute;
    color: grey;
    mix-blend-mode: difference;
    font-size: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    user-select: none;
}
img {
    transform: scale(0.85);
    border: 12px solid white;
}
</style>