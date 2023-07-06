<template>
  <div>
      <h1 v-html="greeting"></h1>
      <EditingContextMenu @delete="$emit('delete')"/>
  </div>
</template>

<script setup>
import EditingContextMenu from "~/components/EditingContextMenu.vue";

const greeting = document.querySelector('#component9 > div:nth-child(1) > div:nth-child(1) > h1:nth-child(1)').innerHTML;
</script>