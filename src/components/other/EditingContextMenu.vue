<template>
    <div>
        <div class="dui-card dui-card-compact absolute shadow-xl bg-white p-0 cm hidden right-0 top-0" v-if="!settingsOpen">
            <div class="dui-tooltip bg-transparent [position:unset] p-0" data-tip="Customise Widget" @click="settingsOpen = true" v-if="settings">
                <button class="cb-icon-button material-symbols-outlined">settings</button>
            </div>

            <div class="dui-tooltip bg-transparent [position:unset] p-0" data-tip="Delete Widget" @click="$emit('delete')" v-if="del">
                <button class="cb-icon-button material-symbols-outlined">delete</button>
            </div>
        </div>
        <div class="absolute shadow-xl bg-white cm right-2 top-2 p-2 cursor-auto rounded-md widget-settings hidden" v-if="settingsOpen">
            <span class="font-bold">Edit Widget:</span><br>
            <span class="material-symbols-outlined absolute top-1 right-1 cursor-pointer hover:text-gray-400" @click="settingsOpen = false">Close</span>
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
.selected .cm {
    display: unset;
    animation: toggleSettings 100ms
}
</style>