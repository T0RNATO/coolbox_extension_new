<script setup>
import {ref} from "vue";
import EditingContextMenu from "~/components/EditingContextMenu.vue";

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
</script>

<template>
<div class="bg-white relative">
    <span class="material-symbols-outlined left-1" @click="back">arrow_back_ios</span>
    <img :src="images[viewing].src" draggable="false">
    <span class="material-symbols-outlined right-0" @click="forward">arrow_forward_ios</span>
    <EditingContextMenu @delete="$emit('delete')"/>
</div>
</template>

<style scoped>
span {
    position: absolute;
    color: #3d3d40;
    font-size: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    user-select: none;
}
img {
    transform: scale(0.9);
}
</style>