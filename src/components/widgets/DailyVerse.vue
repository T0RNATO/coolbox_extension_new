<script setup lang="ts">
import EditingContextMenu from "~/components/other/EditingContextMenu.vue";
import { dailyVerse, getDailyVerse } from "~/utils/apiUtils";

getDailyVerse();
</script>

<template>
    <div>
        <h2 class="subheader">Daily Bible Verse</h2>
        <div class="bg-primary text-themeText rounded-md p-4">
            <div v-if="dailyVerse.text">
                <div class="flex">
                    <span class="material-symbols-outlined icon-fill mr-3 text-2xl -scale-x-100">format_quote</span>
                    <div>
                        {{dailyVerse.text}}
                    </div>
                </div>
                <span class="text-gray-500 mt-2">
                    {{dailyVerse.reference}}
                </span>
            </div>
            <div v-else>
                <div class="dui-loading dui-loading-spinner"/>
            </div>
        </div>
        <EditingContextMenu @delete="$emit('delete')"/>
    </div>
</template>

<style scoped>

</style>