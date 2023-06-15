<template>
    <h2 class="subheader">News</h2>
    <div v-html="news" class="bg-white overflow-y-auto h-96"></div>
</template>

<script setup>
const news = document.querySelector("#news-component .tabs-content").innerHTML;
</script>