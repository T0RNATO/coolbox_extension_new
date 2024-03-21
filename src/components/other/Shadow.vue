<script setup lang="ts">
import {defaultSheets} from "~/utils/componentUtils";
import {ShadowRoot} from "vue-shadow-dom";

const props = defineProps<{
    styles?: string
}>();

const sheet = new CSSStyleSheet();
sheet.replaceSync(props.styles ?? "");
const allSheets: CSSStyleSheet[] = defaultSheets.concat([sheet]);
</script>

<template>
    <shadow-root :adopted-style-sheets="allSheets">
        <slot/>
    </shadow-root>
</template>