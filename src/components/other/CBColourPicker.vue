<script setup lang="ts">
// noinspection TypeScriptUnresolvedReference
defineProps<{
    modelValue: string
}>();

// noinspection TypeScriptUnresolvedReference
const emit = defineEmits(["update:modelValue"]);

function debounce(callback, wait) {
    let timeoutId = null;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => callback.apply(this, args), wait);
    };
}

const handleInput = debounce((event: InputEvent) => {
    emit('update:modelValue', (event.target as HTMLInputElement).value);
}, 100);
</script>

<template>
    <input type="color" @input="handleInput" :value="modelValue" class="!w-10 !h-10 !p-0.5 !m-0">
</template>