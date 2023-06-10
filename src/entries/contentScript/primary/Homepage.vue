<template>
  <div>
    <div class="grid grid-cols-[65%,35%]">
      <!-- Left Column -->
      <div class="px-4">
        <GreetingText />
        <hr>
        <Tiles />
      </div>
      <!-- Right Column -->
      <div class="px-4">
        <UpcomingDueWork />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import GreetingText from "~/components/GreetingText.vue";
import UpcomingDueWork from "~/components/UpcomingDueWork.vue";
import Tiles from "~/components/Tiles.vue";

let count = ref(0);

function increaseCount() {
  count.value += 1;
}
</script>

<style>
</style>
