<template>
    <SettingsMenu :popup="true"/>
</template>

<script setup>
import SettingsMenu from "~/components/other/SettingsMenu.vue";
</script>

<style>
body {
    @apply m-0;
    width: 450px;
}
</style>