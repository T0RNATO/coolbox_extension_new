<script setup>
import {defaultSheets} from "~/utils/componentUtils";
import {ShadowRoot} from "vue-shadow-dom";
</script>

<template>
    <shadow-root :adopted-style-sheets="defaultSheets">
        <slot/>
    </shadow-root>
</template>