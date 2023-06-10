<template>
  <h1 v-html="greeting"></h1>
</template>

<script setup>
let greeting = document.querySelector('#component9 > div:nth-child(1) > div:nth-child(1) > h1:nth-child(1)').innerHTML;
</script>

<style scoped>

</style>
