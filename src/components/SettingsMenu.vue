<template>
    <h1 class="w-full p-4 text-2xl text-white mb-0 bg-gradient-to-r from-[#ca88ce] to-[#50a9c2]">Coolbox Settings</h1>
    <div class="grid-cols-2 grid p-4">
        <span class="settings-label">Tiles RGB Speed:</span>
        <input type="range" id="rgb-tiles" min="1" max="200" class="range" v-model="rgb">

        <span class="settings-label">Hide Profile Picture:</span>
        <input type="checkbox" class="toggle">

        <span class="settings-label">Enable Theme:</span>
        <input type="checkbox" class="toggle">

        <span class="settings-label">Hide Feedback Message:</span>
        <input type="checkbox" class="toggle">

        <span class="settings-label">Theme:</span>
        <div>
            <input type="radio" name="theme" value="dark" class="radio" style="background-color: #302f33;" title="Dark">
            <input type="radio" name="theme" value="purple" class="radio" style="background-color: #5438b3;" title="Purple">
            <input type="radio" name="theme" value="dark_blue" class="radio" style="background-color: #080e3b;" title="Dark Blue">
        </div>
    </div>
</template>

<script setup>
import {computed, ref} from "vue";
import browser from "webextension-polyfill";

let slider_value = ref(0);

browser.storage.sync.get("rgb_speed").then((result) => {
  console.log(result.rgb_speed);
  slider_value.value = result.rgb_speed;
});

const rgb = computed({
    get() {
        return slider_value.value;
    },
    set(value) {
        browser.storage.sync.set({
            rgb_speed: value
        })
    }
})
</script>

<style>
.settings-label {
    @apply text-[18px]
}
.toggle, input.radio {
    @apply border border-gray-500 border-solid
}
</style>