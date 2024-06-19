<script setup lang="ts">
import {defaultSheets} from "~/utils/componentUtils";
import {ShadowRoot} from "vue-shadow-dom";
import {getCurrentInstance} from "vue";

const props = defineProps<{
    styles?: string
}>();

const instance = getCurrentInstance();

// `.styles` is semi-undocumented and TS doesn't know about it
// https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#using-vue-sfcs-as-custom-elements
// @ts-ignore
const parentStyles = instance.proxy.$parent.$.type?.styles ?? "";
const extraStyles = parentStyles + (props.styles ?? "");

let sheets = defaultSheets;

if (extraStyles) {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(extraStyles);
    sheets = defaultSheets.concat([sheet]);
}
</script>

<template>
    <shadow-root :adopted-style-sheets="sheets">
        <slot/>
    </shadow-root>
</template>