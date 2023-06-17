<template>
    <div class="dui-card dui-card-compact absolute shadow-xl bg-white p-0 cm hidden" :style="{right: 0, top: 0}">
        <div class="dui-tooltip bg-transparent [position:unset] p-0" data-tip="Customise Widget" v-if="settings">
            <button class="cb-icon-button material-symbols-outlined">settings</button>
        </div>

        <div class="dui-tooltip bg-transparent [position:unset] p-0" data-tip="Delete Widget" @click="$emit('delete')" v-if="del">
            <button class="cb-icon-button material-symbols-outlined">delete</button>
        </div>
    </div>
</template>

<script setup>
defineProps({
    del: {
        default: true
    },
    settings: {
        default: false
    }
})
</script>

<style scoped>
.selected .cm {
    display: unset;
}
</style>