<script setup>
import {ref} from "vue";

const currentTab = ref(0);

const kebabToTitle = str => str.replace(/(^|-)(\w)/g, (_, __, c) => " " + c.toUpperCase()).trim();
</script>

<template>
    <div class="w-full h-full">
        <div class="w-full flex bg-background gap-1 px-2 pt-2" v-bind="$attrs">
            <div v-for="(slot, i) in Object.keys($slots)" class="tab" :class="{current: currentTab === i}"
                 @click="currentTab = i" :key="i">
                {{kebabToTitle(slot)}}
            </div>
        </div>
        <div class="h-full bg-primary rounded-md text-themeText p-2">
            <slot :name="Object.keys($slots)[currentTab]"/>
        </div>
    </div>
</template>

<style scoped>
.tab {
    @apply rounded-t-md bg-accent p-2 text-themeText cursor-pointer;
}
.current {
    @apply bg-primary;
}
</style>