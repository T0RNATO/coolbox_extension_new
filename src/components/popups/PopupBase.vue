<template>
    <dialog class="dui-modal border-transparent" ref="dialog">
        <div class="dui-modal-box p-0 rounded-lg shadow-2xl bg-primary" v-bind="$attrs">
            <h1 class="bg-[#325985] w-full !text-white p-4 mb-0 rounded-t-lg" v-if="title">{{title}}</h1>
            <div class="text-themeText" :class="{'p-4': !noPad}">
                <slot/>
            </div>
            <div class="px-4 pb-2">
                <form method="dialog">
                    <slot name="buttons"/>
                </form>
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

<script setup lang="ts">
import Shadow from "~/components/other/Shadow.vue";
import {Ref, ref} from "vue";

const dialog: Ref<HTMLDialogElement> = ref();

defineExpose({
    openPopup() {
        dialog.value.showModal();
    },
    closePopup() {
        dialog.value.close();
    }
})
defineProps({
    title: String,
    noPad: Boolean
})
defineOptions({
    inheritAttrs: false
})
</script>

<style scoped>
:deep(.button-l) {
    width: calc(50% - 0.25rem) !important;
    @apply mr-1;
}
:deep(.button-r) {
    width: calc(50% - 0.25rem) !important;
    @apply ml-1;
}
</style>