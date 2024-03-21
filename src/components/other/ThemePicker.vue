<script setup>
import ThemePopup from "~/components/popups/ThemePopup.vue";
import {ref} from "vue";

const popup = ref();
</script>

<template>
    <div class="fixed left-0 bottom-0 z-[1003] bg-white rounded-tr-md p-2">
        <div>
            Theme:
            <span class="font-bold">NEW!</span><br>
            <button @click="popup.openPopup()">Open Theme Editor</button>
        </div>
    </div>
    <teleport to="body">
        <ThemePopup ref="popup"/>
    </teleport>
</template>

<style scoped>

</style>