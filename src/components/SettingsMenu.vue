<template>
    <h1 class="w-full p-4 text-2xl text-white mb-0 bg-gradient-to-r from-[#ca88ce] to-[#50a9c2]">Coolbox Settings</h1>
    <div class="grid-cols-2 grid p-4">
        <span class="settings-label">Tiles RGB Speed:</span>
        <input type="range" id="rgb-tiles" min="1" max="200" class="range" v-model="rgb">

        <span class="settings-label">Hide Profile Picture:</span>
        <input type="checkbox" class="toggle" v-model="pfp_model" :hidden="pfp_model === undefined">

        <span class="settings-label">Hide Feedback Message:</span>
        <input type="checkbox" class="toggle" v-model="feedback_model" :hidden="feedback_model === undefined">

        <span class="settings-label">Enable Theme:</span>
        <input type="checkbox" class="toggle" v-model="theme_enabled_model" :hidden="theme_enabled_model === undefined">

        <span class="settings-label">Theme:</span>
        <div>
            <input type="radio" name="theme" value="dark" class="radio !bg-[#302f33]" title="Dark" v-model="theme_model">
            <input type="radio" name="theme" value="purple" class="radio !bg-[#5438b3]" title="Purple" v-model="theme_model">
            <input type="radio" name="theme" value="dark_blue" class="radio !bg-[#080e3b]" title="Dark Blue" v-model="theme_model">
        </div>
    </div>
</template>

<script setup>
import {computed, ref} from "vue";
import browser from "webextension-polyfill";


let rgb_speed = ref(0);
let pfp = ref(undefined);
let feedback = ref(undefined);
let theme_enabled = ref(undefined);
let theme = ref(false);


browser.storage.sync.get("rgb_speed").then((result) => {
  rgb_speed.value = result.rgb_speed;
});

browser.storage.sync.get("pfp").then((result) => {
  pfp.value = result.pfp;
});

browser.storage.sync.get("feedback").then((result) => {
  feedback.value = result.feedback;
});

browser.storage.sync.get("theme_enabled").then((result) => {
  theme_enabled.value = result.theme_enabled;
});

browser.storage.sync.get("theme").then((result) => {
  theme.value = result.theme;
});


const rgb = computed({
    get() {
        return rgb_speed.value;
    },
    set(value) {
        browser.storage.sync.set({
            rgb_speed: value
        })
    }
})

const pfp_model = computed({
    get() {
        return pfp.value;
    },
    set(value) {
        browser.storage.sync.set({
            pfp: value
        })
    }
})

const feedback_model = computed({
    get() {
        return feedback.value;
    },
    set(value) {
        browser.storage.sync.set({
            feedback: value
        })
    }
})

const theme_enabled_model = computed({
    get() {
        return theme_enabled.value;
    },
    set(value) {
        browser.storage.sync.set({
            theme_enabled: value
        })
    }
})

const theme_model = computed({
    get() {
        return theme.value;
    },
    set(value) {
        browser.storage.sync.set({
            theme: value
        })
    }
})

</script>

<style>
.settings-label {
    @apply text-[18px]
}
.toggle, input.radio {
    @apply border-gray-500 border-solid
}
</style>
