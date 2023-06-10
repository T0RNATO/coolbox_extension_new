<template>
    <div>
        <div class="grid grid-cols-[65%,35%]">
            <!-- Left Column -->
            <div class="px-4">
                <GreetingText />
                <hr>
                <Tiles />
                <CoolBoxMessage v-if="show_feedback"/>
            </div>
            <!-- Right Column -->
            <div class="px-4">
                <UpcomingDueWork />
            </div>
        </div>
    </div>
</template>

<script setup>
import GreetingText from "~/components/GreetingText.vue";
import UpcomingDueWork from "~/components/UpcomingDueWork.vue";
import Tiles from "~/components/Tiles.vue";
import CoolBoxMessage from "~/components/CoolBoxMessage.vue";
import {ref} from "vue";
import browser from "webextension-polyfill";

const show_feedback = ref(true)

browser.storage.sync.get("feedback").then((result) => {
    show_feedback.value = !result.feedback
});
browser.storage.sync.onChanged.addListener((changes) => {
    if (changes.feedback) {
        show_feedback.value = !changes.feedback.newValue;
    }
})
</script>

<style>
</style>