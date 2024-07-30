<template>
    <div class="z-20">
        <div class="context-menu hidden" v-if="!settingsOpen">
            <div class="dui-tooltip bg-transparent [position:unset] p-0" data-tip="Customise Widget" @click="settingsOpen = true" v-if="settings">
                <button class="cb-icon-button cb-icon">settings</button>
            </div>

            <div class="dui-tooltip bg-transparent [position:unset] p-0" data-tip="Delete Widget" @click="$emit('delete')" v-if="del">
                <button class="cb-icon-button cb-icon">delete</button>
            </div>
        </div>
        <div class="widget-settings hidden" v-if="settingsOpen">
            <span class="font-bold">Edit Widget:</span><br>
            <span class="cb-icon absolute top-1 right-1 cursor-pointer hover:text-gray-400" @click="settingsOpen = false">Close</span>
            <Shadow class="no-drag">
                <slot/>
            </Shadow>
        </div>
    </div>
</template>

<script setup>
import {ref} from "vue";
import Shadow from "~/components/other/Shadow.vue";

const settingsOpen = ref(false);

defineProps({
    del: {
        default: true
    },
    settings: {
        default: false
    }
})
</script>

<style scoped>
@keyframes toggleSettings {
    to {
        @apply top-0;
    }
    from {
        @apply -top-80
    }
}

/*noinspection CssUnusedSymbol*/
.selected .hidden {
    display: unset !important;
    animation: toggleSettings 100ms
}

.context-menu {
    @apply absolute shadow-xl bg-white p-0 right-0 top-0 rounded-md;
}

.widget-settings {
    @apply absolute shadow-xl bg-white right-2 top-2 p-2 cursor-auto rounded-md;
}
</style>