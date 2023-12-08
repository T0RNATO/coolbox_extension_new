<script setup lang="ts">
import EditingContextMenu from "~/components/other/EditingContextMenu.vue";
import {dailyVerse, successToast} from "~/utils/apiUtils";

function share() {
    navigator.clipboard.writeText(`${dailyVerse.value.reference}: "${dailyVerse.value.content}"`).then(() => {
        successToast("Copied to clipboard");
    })
}
</script>

<template>
    <div class="relative">
        <h2 class="subheader">Daily Bible Verse</h2>
        <div class="bg-primary text-themeText rounded-md p-4">
            <div v-if="dailyVerse.content">
                <div class="flex">
                    <span class="material-symbols-outlined icon-fill mr-3 text-2xl -scale-x-100">format_quote</span>
                    <div>
                        {{dailyVerse.content}}
                    </div>
                </div>
                <span class="mt-2">
                    {{dailyVerse.reference}}
                </span>
                <div class="absolute right-6 bottom-2 flex">
                    <div class="dui-tooltip dui-tooltip-left" data-tip="View on BibleGateway">
                        <a :href="dailyVerse.link" target="_blank">
                            <span class="material-symbols-outlined !text-gray-500 text-xl">link</span>
                        </a>
                    </div>
                    <div class="dui-tooltip dui-tooltip-left cursor-pointer select-none" data-tip="Copy to clipboard">
                        <span class="material-symbols-outlined text-gray-500 text-xl" @click="share">share</span>
                    </div>
                </div>
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