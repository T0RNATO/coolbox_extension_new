<template>
    <dialog class="dui-modal">
        <div class="dui-modal-box p-0 rounded-sm shadow-2xl bg-primary" v-bind="$attrs">
            <h1 class="bg-[#325985] w-full !text-white p-4 mb-0">{{title}}</h1>
            <div class="p-4 pb-2 text-themeText">
                <slot/>
            </div>
        </div>
        <!--Shadow root to prevent button styling-->
        <shadow-root :adopted-style-sheets="defaultSheets" class="dui-modal-backdrop">
            <form method="dialog" class="dui-modal-backdrop">
                <button class="bg-black bg-transparent/20">close</button>
            </form>
        </shadow-root>
    </dialog>
</template>

<script setup>

import {defaultSheets} from "~/utils/componentUtils";
import {ShadowRoot} from "vue-shadow-dom";

defineProps({
    title: String
})
defineOptions({
    inheritAttrs: false
})
</script>