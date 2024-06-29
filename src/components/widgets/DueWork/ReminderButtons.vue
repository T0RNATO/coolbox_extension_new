<script setup>
defineEmits(['viewReminders', 'createReminder']);
</script>

<template>
    <li class="!pt-2">
        <div class="flex-row w-full flex p-0 text-sm">
            <div class="button" @click="$emit('createReminder')">
                <div>
                    <span class="material-symbols-outlined align-bottom">add</span>
                    Add Reminder
                </div>
            </div>
            <div class="button" @click="$emit('viewReminders')">
                <div>
                    <span class="material-symbols-outlined align-bottom">visibility</span>
                    View All Reminders
                </div>
            </div>
        </div>
    </li>
</template>

<style scoped>
.button {
    @apply w-full m-2 mt-0 flex items-center justify-center rounded-md;
}
</style>