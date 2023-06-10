<template>
    <h1 class="w-full p-4 text-2xl text-white mb-0">Coolbox Settings</h1>
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
import "tailwindcss/tailwind.css"; // Add this line
import {computed} from "vue";
import browser from "webextension-polyfill";

const rgb = computed({
    async get() {
        let response = await browser.storage.sync.get("rgb_speed")
        return response.rgb_speed
    },
    set(value) {
        browser.storage.sync.set({
            rgb_speed: value
        })
    }
})
</script>

<style>
h1 {
    background: linear-gradient(45deg, #ca88ce, #50a9c2);
}
.settings-label {
    font-size: 18px;
}
.toggle, input.radio {
    border: 1px solid gray;
}
</style>