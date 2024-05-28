<template>
    <h1 class="w-[calc(100%-2rem)] p-4 text-2xl text-white my-0 bg-gradient-to-r from-[#ca88ce] to-[#50a9c2]">Coolbox Settings</h1>
    <div class="grid-cols-2 grid p-4 items-center">
        <span class="settings-label">Hide Profile Picture:</span>
        <input type="checkbox" class="dui-toggle" v-model="pfp">
        <span class="settings-label">Custom Font</span>
        <div>
            <div v-if="!popup">
                <select class="dui-select dui-select-sm"
                        @click="loadFonts"
                        v-if="!fontLoadingError"
                        v-model="selectedFont"
                        :style="{fontFamily: selectedFont == 'default' ? 'unset' : selectedFont}"
                        @change="browser.runtime.sendMessage({newFont: $event.target.value})"
                >
                    <option value="default" style="font-family: system-ui, sans-serif">Default</option>
                    <option :value="selectedFont" v-if="selectedFont !== 'default'" :style="{fontFamily: selectedFont}">{{selectedFont}}</option>
                    <option :value="font" v-for="font in availableFonts" :style="{fontFamily: font}">{{font}}</option>
                </select>
                <span v-else class="text-red-500">Error loading fonts.</span>
            </div>
            <a v-else class="dui-link dui-link-primary mx-1" :href="optionsUrl" target="_blank">
                Open in tab to customise
            </a>
        </div>

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
import {Ref, ref} from "vue";
import {customFont, updateCustomFont} from "~/entries/background/themes";

const pfp = useExtensionStorage("pfp", false);
const linked = ref(false);
const displayButton = ref(false);
const networkError = ref(false);
const fontLoadingError = ref(false);

const optionsUrl = browser.runtime.getURL("src/entries/options/index.html");

const availableFonts: Ref<string[]> = ref([]);
const selectedFont = useExtensionStorage("font", "default");

let cookie;

defineProps<{
    popup?: boolean
}>();

// TS doesn't seem to know about this API (it is experimental after all)
// noinspection JSUnusedGlobalSymbols
interface Window {
    queryLocalFonts: (() => Promise<{
        postscriptName: string
        fullName: string
        family: string
        style: string
    }[]>)
}

function loadFonts() {
    window.queryLocalFonts().then(fontData => {
        const fonts: string[] = [];
        for (const font of fontData.map(f => f.family)) {
            if (!fonts.includes(font)) {
                fonts.push(font);
            }
        }
        availableFonts.value = fonts;
    }).catch((error) => {
        console.log(error);
        fontLoadingError.value = true;
    })
}

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
