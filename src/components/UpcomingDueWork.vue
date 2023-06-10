<template>
  <div>
    <h2 class="subheader">Upcoming Due Work</h2>
    <div class="bg-white" v-html="duework"></div>
  </div>
</template>

<script setup>
let duework = document.querySelector('#component52396 > div:nth-child(1) > div:nth-child(1) > section:nth-child(2)').innerHTML;
</script>

<style scoped>

</style>
