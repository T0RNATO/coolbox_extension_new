<template>
    <dialog class="dui-modal border-transparent">
        <div class="dui-modal-box p-0 rounded-lg shadow-2xl bg-primary" v-bind="$attrs">
            <h1 class="bg-[#325985] w-full !text-white p-4 mb-0 rounded-t-lg">{{title}}</h1>
            <div class="p-4 pb-2 text-themeText">
                <slot/>
            </div>
        </div>
        <!--Shadow root to prevent button styling-->
        <Shadow class="dui-modal-backdrop">
            <form method="dialog" class="dui-modal-backdrop">
                <button class="bg-black bg-transparent/20 border-transparent">close</button>
            </form>
        </Shadow>
    </dialog>
</template>

<script setup>
import Shadow from "~/components/other/Shadow.vue";

defineProps({
    title: String
})
defineOptions({
    inheritAttrs: false
})
</script>