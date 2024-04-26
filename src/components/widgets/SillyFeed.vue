<script setup lang="ts">
import EditingContextMenu from "~/components/other/EditingContextMenu.vue";
import {dailyVerse, successToast} from "~/utils/apiUtils";
import Shadow from "~/components/other/Shadow.vue";
import {shadow_style} from "vue-shadow-dom";

const files = [
    "image1", "filenamewhatever"
]
</script>

<template>
    <div class="p-2">
        <EditingContextMenu @delete="$emit('delete')"/>
        <h1 class="!font-semibold">Daily Silly Feed</h1>
        <img src="https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F88d26018-fa1a-4b92-a8b9-d8ed3f9e178e_3840x2160.png" alt="Placeholder for Funny image"><img>
    </div>
</template>