<template>
    <div class="pl-2 text-sm" v-if="show_feedback">
        <h1 class="mt-2">CoolBox</h1>
        <span id="cb-settings">
            Customise your homepage and enable themes by hitting the pencil in the top right, or view a full list of features at <a href="https://coolbox.lol">coolbox.lol</a>.<br>
            Got questions, comments, suggestions? Send us feedback!
        </span>
        <button id="cb-feedback" class="block my-4">Submit Feedback</button>
        <span class="italic text-gray-400">
            CoolBox is not endorsed by or affiliated with Donvale Christian College or Schoolbox Pty Ltd.<br>
        </span>
    </div>
    <EditingContextMenu @delete="$emit('delete')"/>
</template>

<script setup>
import {ref} from "vue";
import browser from "webextension-polyfill";
import EditingContextMenu from "~/components/EditingContextMenu.vue";

const show_feedback = ref(true)

browser.storage.local.get("feedback").then((result) => {
    show_feedback.value = !result.feedback
});
browser.storage.local.onChanged.addListener((changes) => {
    if (changes.feedback) {
        show_feedback.value = !changes.feedback.newValue;
    }
})
</script>

<style scoped>

</style>