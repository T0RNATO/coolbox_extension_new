<template>
    <h1 class="w-full p-4 text-2xl text-white mb-0 bg-gradient-to-r from-[#ca88ce] to-[#50a9c2]">Coolbox Settings</h1>
    <div class="grid-cols-2 grid p-4">
        <span class="settings-label">Hide Profile Picture:</span>
        <input type="checkbox" class="dui-toggle" v-model="pfp_model">

        <span class="settings-label">Hide Feedback Message:</span>
        <input type="checkbox" class="dui-toggle" v-model="feedback_model">

        <span class="settings-label">Enable Theme:</span>
        <input type="checkbox" class="dui-toggle" v-model="theme_enabled_model">

        <span class="settings-label">Theme:</span>
        <div>
            <input type="radio" name="theme" value="dark" class="dui-radio !bg-[#302f33]" title="Dark" v-model="theme_model">
            <input type="radio" name="theme" value="purple" class="dui-radio !bg-[#5438b3]" title="Purple" v-model="theme_model">
            <input type="radio" name="theme" value="dark_blue" class="dui-radio !bg-[#080e3b]" title="Dark Blue" v-model="theme_model">
        </div>
    </div>
</template>

<script setup>
import {computed, ref} from "vue";
import browser from "webextension-polyfill";


let pfp = ref(undefined);
let feedback = ref(undefined);
let theme_enabled = ref(undefined);
let theme = ref(false);

browser.storage.local.get("pfp").then((result) => {
  pfp.value = result.pfp;
});

browser.storage.local.get("feedback").then((result) => {
  feedback.value = result.feedback;
});

browser.storage.local.get("theme_enabled").then((result) => {
  theme_enabled.value = result.theme_enabled;
});

browser.storage.local.get("theme").then((result) => {
  theme.value = result.theme;
});

const pfp_model = computed({
    get() {
        return pfp.value;
    },
    set(value) {
        browser.storage.local.set({
            pfp: value
        })
    }
})

const feedback_model = computed({
    get() {
        return feedback.value;
    },
    set(value) {
        browser.storage.local.set({
            feedback: value
        })
    }
})

const theme_enabled_model = computed({
    get() {
        return theme_enabled.value;
    },
    set(value) {
        browser.storage.local.set({
            theme_enabled: value
        })
    }
})

const theme_model = computed({
    get() {
        return theme.value;
    },
    set(value) {
        browser.storage.local.set({
            theme: value
        })
    }
})

</script>

<style>
.settings-label {
    @apply text-[18px]
}
.dui-toggle, input.dui-radio {
    @apply border-gray-500 border-solid
}
</style>
