<script setup>
import EditingContextMenu from "~/components/other/EditingContextMenu.vue";

const calendar = document.querySelector("#component36739 .island");
</script>

<template>
<div>
    <div v-html="calendar.innerHTML"></div>
    <EditingContextMenu @delete="$emit('delete')"/>
</div>
</template>