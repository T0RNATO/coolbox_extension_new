<template>
    <h1 class="w-[calc(100%-2rem)] p-4 text-2xl text-white my-0 bg-gradient-to-r from-[#ca88ce] to-[#50a9c2]">Coolbox Settings</h1>
    <div class="grid-cols-2 grid p-4 items-center">
        <span class="settings-label">Hide Profile Picture:</span>
        <input type="checkbox" class="dui-toggle" v-model="pfp">

        <div class="col-span-2 my-2">
            Looking for settings for a specific widget? Click the customise homepage button in the top right of Schoolbox, and click on widgets to edit their settings or delete them.
        </div>
        <button class="mt-4 dui-btn dui-btn-error" v-if="displayButton && linked" @click="unlink">Unlink Discord Account</button>
        <button class="mt-4 dui-btn dui-btn-primary" v-else-if="displayButton" @click="link">Link Discord Account</button>
        <span class="text-red-500 block" v-else-if="networkError">Network error fetching Discord link status.</span>
        <div class="flex items-center gap-2" v-else>
            <span class="text-gray-700">Checking if you're linked with Discord...</span>
            <div class="dui-loading dui-loading-spinner"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {useExtensionStorage} from "~/utils/componentUtils";
import browser from "webextension-polyfill";
import {ref} from "vue";

const pfp = useExtensionStorage("pfp", false);
const linked = ref(false);
const displayButton = ref(false);
const networkError = ref(false);

let cookie;

defineProps<{
    popup?: boolean
}>();

function unlink() {
    fetch(`https://api.coolbox.lol/discord`, {
        method: "DELETE",
        headers: new Headers({
            "Authorization": `Bearer ${cookie}`,
            "Content-Type": "application/json"
        })
    }).then(() => {
        linked.value = false;
    })
}

function link() {
    browser.tabs.create({url: "https://api.coolbox.lol/discord/redirect?state=" + cookie})
}

function checkIfLinked() {
    fetch(`https://api.coolbox.lol/user`, {
        method: "GET",
        headers: new Headers({
            "Authorization": `Bearer ${cookie}`,
            "Content-Type": "application/json"
        })
    }).then(response => {response.json().then((data) => {
        linked.value = data.discord.linked;
        displayButton.value = true;
    })}).catch(() => {
        networkError.value = true;
    })
}

browser.runtime.sendMessage("getCookie").then((token) => {
    cookie = token;
    checkIfLinked()
})
</script>

<style>
.settings-label {
    @apply text-[18px];
}
/*noinspection CssUnusedSymbol*/
.dui-toggle, input.dui-radio, .dui-select {
    @apply !border-gray-500 border-solid;
}
</style>
