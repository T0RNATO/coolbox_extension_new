<template>
    <h1 class="w-full p-4 text-2xl text-white mb-0 bg-gradient-to-r from-[#ca88ce] to-[#50a9c2]">Coolbox Settings</h1>
    <div class="grid-cols-2 grid p-4">
        <span class="settings-label">Hide Profile Picture:</span>
        <input type="checkbox" class="dui-toggle" v-model="pfp">

        <div class="col-span-2">
            Looking for settings for a specific widget? Click the customise homepage button in the top right of Schoolbox, and edit widgets' settings or delete them.

            <div v-if="displayButton">
                <button class="mt-4 dui-btn dui-btn-primary" v-if="!linked" @click="link">Link Discord Account</button>
                <button class="mt-4 dui-btn dui-btn-error" v-else @click="unlink">Unlink Discord Account</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import {useExtensionStorage} from "~/utils/componentUtils";
import browser from "webextension-polyfill";
import {ref} from "vue";

const pfp = useExtensionStorage("pfp", false);
const linked = ref(false);
const displayButton = ref(false);

let cookie;

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
    })})
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
.dui-toggle, input.dui-radio {
    @apply border-gray-500 border-solid;
}
</style>
