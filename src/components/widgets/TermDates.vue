<script setup>
import {ref} from "vue";
import EditingContextMenu from "~/components/other/EditingContextMenu.vue";

const images = document.querySelectorAll(".swiper-wrapper .swiper-slide img");

const viewing = ref(0);

function back() {
    viewing.value -= 1;
    if (viewing.value < 0) {
        viewing.value = images.length - 1;
    }
}

function forward() {
    viewing.value += 1;
    if (viewing.value >= images.length) {
        viewing.value = 0;
    }
}

defineProps({widgInfo: Object});
</script>

<template>
<div class="relative rounded-xl">
    <span class="material-symbols-outlined left-1" @click="back">arrow_back_ios</span>
    <img v-if="images[viewing]" :src="images[viewing]?.src" draggable="false" class="rounded-xl" alt="Term Dates">
    <span class="material-symbols-outlined right-0" @click="forward">arrow_forward_ios</span>
    <EditingContextMenu @delete="$emit('delete')"/>
</div>
</template>

<style scoped>
span {
    position: absolute;
    color: grey;
    mix-blend-mode: difference;
    font-size: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    user-select: none;
}
img {
    transform: scale(0.85);
    border: 12px solid white;
}
</style>