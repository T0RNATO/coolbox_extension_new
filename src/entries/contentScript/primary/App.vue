<template>
  <h2 @click="increaseCount" class="subheader select-none text-red-500" data-timetable-header="">Day {{ count }}</h2>
</template>

<script setup>
import { ref } from 'vue';

let count = ref(0);

function increaseCount() {
  count.value += 1;
}
</script>

<style>
</style>
