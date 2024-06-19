<script setup lang="ts">
import Shadow from "~/components/other/Shadow.vue";
import {useExtensionStorage} from "~/utils/componentUtils";
import {ref} from "vue";
import browser from "webextension-polyfill";

const font = useExtensionStorage("font", "default");
const dropdownOpen = ref(false);
const availableFonts = ref<string[]>([]);
const filteredFonts = ref<string[]>([]);
const fontLoadingError = ref(false);

const vFocus = {
    mounted: (el) => el.focus()
}

// TS doesn't seem to know about this API (it is experimental, but it's the only way to get installed fonts)
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
        filteredFonts.value = fonts;
    }).catch((error) => {
        console.log(error);
        fontLoadingError.value = true;
    })
}

function search(event: InputEvent) {
    const string = (event.target as HTMLInputElement).value;

    if (string === "") {
        filteredFonts.value = availableFonts.value;
        return;
    }

    filteredFonts.value = availableFonts.value.filter(font => font.toLowerCase().includes(string.toLowerCase()));
}

function openDropdown() {
    dropdownOpen.value = true;
    if (!availableFonts.value.length) {
        loadFonts()
    }
}

function closeDropdown() {
    // Wait for the click event to finish before closing the dropdown, because apparently it doesn't work otherwise?
    setTimeout(() => {
        dropdownOpen.value = false;
        filteredFonts.value = availableFonts.value;
    }, 100);
}

function setFont(f: string) {
    const oldFont = font.value;
    font.value = f;
    browser.runtime.sendMessage({newFont: f, oldFont});
}
</script>

<template>
    <Shadow>
        <div class="relative bg-generic">
            <div class="dui-input dui-input-sm bg-accent text-themeText cursor-text"
                 :style="{fontFamily: font == 'default' ? 'sans-serif' : font}"
                 @click="openDropdown" v-if="!dropdownOpen"
            >{{font}}</div>

            <template v-else>
                <input type="text" class="dui-input dui-input-xs w-[90%] bg-accent text-themeText font-sans"
                       v-focus @focusout="closeDropdown" @input="search"/>

                <div class="absolute bg-accent rounded-md w-2/3 mt-2 z-20 overflow-y-auto max-h-52 overflow-x-hidden">
                    <div v-if="fontLoadingError" class="p-1 text-red-500">Error Loading Fonts...</div>

                    <div v-else-if="!availableFonts.length" class="p-1">Loading Fonts...</div>

                    <template v-else>
                        <div @click="setFont('default')" class="font">Default</div>
                        <div v-for="item in filteredFonts" class="font"
                             :style="{fontFamily: item}" @click="setFont(item)"
                        >{{item}}</div>
                    </template>
                </div>
            </template>
        </div>
    </Shadow>
</template>

<style scoped>
.font {
    @apply hover:bg-background cursor-pointer p-1;
}
</style>