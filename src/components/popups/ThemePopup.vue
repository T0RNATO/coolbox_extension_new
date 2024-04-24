<script setup lang="ts">
import PopupBase from "~/components/popups/PopupBase.vue";
import {computed, ref, WritableComputedRef as WCR} from "vue";
import {useExtensionStorage} from "~/utils/componentUtils";
import {AdvancedData, Preset, ThemeType} from "~/utils/types.ts";
import {themePresets, legacyThemePresets} from "~/utils/themePresets";
import CBColourPicker from "~/components/other/CBColourPicker.vue";
import browser from "webextension-polyfill";

const popup = ref();
const themeType = useExtensionStorage("theme.type", "preset" as ThemeType);
const navbar = useExtensionStorage("theme.changeNavbar", false);

const preset = useExtensionStorage("theme.presetData.preset", "light" as Preset);

type Style = 'light' | 'dark';

const legacyColour = useExtensionStorage("theme.legacyData.colour", "#ffffff");
const legacyStyle = useExtensionStorage("theme.legacyData.style", "light" as Style);

const defaultAdvanced = {
    "theme-text":            "#000000",
    "theme-generic":         "#ffffff",
    "theme-accent":          "#ffffff",
    "link-colour":           "#ffffff",
    "body-background":       "#ffffff",
    "navigation-background": "#ffffff",
}

const variableOrder = [
    "theme-text",
    "theme-generic",
    "theme-accent",
    "link-colour",
    "body-background",
    "navigation-background"
]

const advancedColours: WCR<AdvancedData> = useExtensionStorage("theme.advancedData", Object.assign({}, defaultAdvanced));

browser.storage.local.onChanged.addListener((changes) => {
    if (changes.theme) {
        browser.runtime.sendMessage({
            type: "updateTheme",
            old: changes.theme.oldValue,
            new: changes.theme.newValue
        })
    }
});

function setVariable(variable: string, value: string) {
    const colours = advancedColours.value;
    colours[variable] = value;
    advancedColours.value = colours;
}

const themeExport = computed({
    get() {
        let output = "";
        for (const v of variableOrder) {
            output += advancedColours.value[v].replace("#", "") + ";";
        }
        return output.slice(0, -1);
    },
    set(value: string) {
        const colours = value.split(";");
        if (colours.length !== variableOrder.length) {
            advancedColours.value = Object.assign({}, defaultAdvanced);
            return;
        }
        const output = {};
        for (const [i, v] of variableOrder.entries()) {
            if (colours[i].length !== 6) {
                output[v] = defaultAdvanced[v];
                continue;
            }
            output[v] = "#" + colours[i];
        }
        advancedColours.value = output as AdvancedData; // avoid updating css 6 times
    }
});

defineExpose({openPopup() {
    popup.value.$el.showModal();
}});
</script>

<template>
<PopupBase title="Theme" ref="popup">
    Customise your Schoolbox Theme.
    <hr>
    <div class="options grid-rows-2">
        <span>Type:</span>
        <select v-model="themeType" class="!my-2 dui-select bg-black bg-opacity-10">
            <option value="preset">Preset</option>
            <option value="legacy">Legacy Customised</option>
            <option value="custom">Advanced</option>
        </select>
        <span>Recolour Navbar:</span>
        <input type="checkbox" v-model="navbar" class="plain w-6 scale-125"/>
    </div>
    <hr>
    <div v-if="themeType == 'preset'">
        <span class="title">Presets:</span>
        <div v-for="theme in themePresets" class="inline">
            <input type="radio" name="preset" :value="theme.value" :id="theme.value" v-model="preset">
            <label :for="theme.value" :style="{background: theme.hex}">
                <span class="text-white mix-blend-difference">
                    {{theme.display}}
                </span>
            </label>
        </div>
        <span class="title">Legacy Presets:</span>
        <div v-for="theme in legacyThemePresets" class="inline">
            <input type="radio" name="preset" :value="theme.value" :id="theme.value" v-model="preset">
            <label :for="theme.value" :style="{background: theme.hex}">
                <span class="text-white mix-blend-difference">
                    {{theme.display}}
                </span>
            </label>
        </div>
    </div>
    <div v-else-if="themeType == 'legacy'" class="options grid-rows-2">
        <span>Main Theme Colour:</span>
        <CBColourPicker v-model="legacyColour"/>
        <span>Style:</span>
        <div>
            <select v-model="legacyStyle">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
            </select>
        </div>
    </div>
    <div v-else-if="themeType == 'custom'">
        <div class="options grid-rows-7">
            <span>Text Colour</span>
            <CBColourPicker :model-value="advancedColours['theme-text']" @update:modelValue="setVariable('theme-text', $event)"/>
            <span>Generic Colour</span>
            <CBColourPicker :model-value="advancedColours['theme-generic']" @update:modelValue="setVariable('theme-generic', $event)"/>
            <span>Accent Colour</span>
            <CBColourPicker :model-value="advancedColours['theme-accent']" @update:modelValue="setVariable('theme-accent', $event)"/>
            <span>Link Colour</span>
            <CBColourPicker :model-value="advancedColours['link-colour']" @update:modelValue="setVariable('link-colour', $event)"/>
            <span>Background Colour</span>
            <CBColourPicker :model-value="advancedColours['body-background']" @update:modelValue="setVariable('body-background', $event)"/>
            <span>Navbar Colour</span>
            <CBColourPicker :model-value="advancedColours['navigation-background']" @update:modelValue="setVariable('navigation-background', $event)"/>
            <span>Import/Export Theme:</span>
            <input type="text" v-model="themeExport" spellcheck="false">
        </div>
    </div>
</PopupBase>
</template>

<style scoped>
label {
    @apply w-20 h-8 rounded-md font-normal !inline-flex items-center justify-center !mx-2;
}
input:checked + label {
    @apply outline outline-green-400;
}
.title {
    @apply block font-semibold;
}
.options {
    @apply grid grid-cols-2 items-center;
}
</style>