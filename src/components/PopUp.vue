<template>
  <img :src="imageUrl" height="45" alt="" />
  <h1>
    <slot></slot>
  </h1>
  <button type="button"
    class="bg-gray-200 p-2 text-md hover:bg-gray-300 transition-all rounded-md shadow-lg"
    @click="increment">Clicks: {{ count }}
  </button>
</template>

<script setup>
import "tailwindcss/tailwind.css"; // Add this line
import { ref } from "vue";
import logo from "~/assets/logo.svg";

const imageUrl = new URL(logo, import.meta.url).href;

const count = ref(0);

const increment = () => (count.value += 1);
</script>

<style>
h1 {
  margin: 5px;
}

button {
  margin-top: 10px;
}
</style>
