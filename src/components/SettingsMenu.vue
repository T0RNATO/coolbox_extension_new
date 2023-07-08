<template>
    <h1 class="w-full p-4 text-2xl text-white mb-0 bg-gradient-to-r from-[#ca88ce] to-[#50a9c2]">Coolbox Settings</h1>
    <div class="grid-cols-2 grid p-4">
        <span class="settings-label">Hide Profile Picture:</span>
        <input type="checkbox" class="dui-toggle" v-model="pfp">

        Looking for settings for a specific widget? Click the customise homepage button in the top right of Schoolbox, and edit widgets' settings or delete them.
    </div>
</template>

<script setup>

import {useExtensionStorage} from "~/utils/componentUtils";

const pfp = useExtensionStorage("pfp", false);
</script>

<style>
.settings-label {
    @apply text-[18px]
}
.dui-toggle, input.dui-radio {
    @apply border-gray-500 border-solid
}
</style>
