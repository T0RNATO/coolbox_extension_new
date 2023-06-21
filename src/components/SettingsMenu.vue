<template>
    <h1 class="w-full p-4 text-2xl text-white mb-0 bg-gradient-to-r from-[#ca88ce] to-[#50a9c2]">Coolbox Settings</h1>
    <div class="grid-cols-2 grid p-4">
        <span class="settings-label">Hide Profile Picture:</span>
        <input type="checkbox" class="dui-toggle" v-model="pfp">

        <span class="settings-label">Hide Feedback Message:</span>
        <input type="checkbox" class="dui-toggle" v-model="feedback">

        <span class="settings-label">Enable Theme:</span>
        <input type="checkbox" class="dui-toggle" v-model="theme_on">

        <span class="settings-label">Theme:</span>
        <div>
            <input type="radio" name="theme" value="dark" class="dui-radio !bg-[#302f33]" title="Dark" v-model="theme">
            <input type="radio" name="theme" value="purple" class="dui-radio !bg-[#5438b3]" title="Purple" v-model="theme">
            <input type="radio" name="theme" value="dark_blue" class="dui-radio !bg-[#080e3b]" title="Dark Blue" v-model="theme">
        </div>
    </div>
</template>

<script setup>
import {useExtensionStorage} from "~/utils/utils";

const pfp = useExtensionStorage("pfp", false);
const feedback = useExtensionStorage("feedback", false);
const theme_on = useExtensionStorage("theme_enabled", false);
const theme = useExtensionStorage("theme", "dark");
</script>

<style>
.settings-label {
    @apply text-[18px]
}
.dui-toggle, input.dui-radio {
    @apply border-gray-500 border-solid
}
</style>
