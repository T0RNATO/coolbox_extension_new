<template>
    <div>
        <h2 class="subheader">News</h2>
        <div v-html="news" class="bg-white overflow-y-auto h-96"></div>
        <EditingContextMenu @delete="$emit('delete')"/>
    </div>
</template>

<script setup>
import EditingContextMenu from "~/components/EditingContextMenu.vue";

const news = document.querySelector("#news-component .tabs-content").innerHTML;
</script>