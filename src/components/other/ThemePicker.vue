<script setup>
import ThemePopup from "~/components/popups/ThemePopup.vue";
import Shadow from "~/components/other/Shadow.vue";
import {ref} from "vue";

const popup = ref();
</script>

<template>
    <Shadow>
        <div class="dui-toast dui-toast-start z-[1004]">
            <div class="dui-alert p-2 shadow-2xl shadow-black">
                <span class="cb-icon text-lg">palette</span>
                <span>Theme:</span>
                <div class="dui-indicator">
                    <button @click="popup.openPopup()" class="dui-btn bg-gray-300">
                        Open Theme Editor
                    </button>
                </div>
            </div>
        </div>
    </Shadow>
    <teleport to="body">
        <ThemePopup ref="popup"/>
    </teleport>
</template>