<template>
    <div>
        <h2 class="subheader">Upcoming Due Work</h2>
        <ul class="information-list">
            <li v-for="tile in dueWorkItems" class="bg-white">
                <div class="card small-12" v-html="tile.innerHTML"></div>
                <div class="material-symbols-outlined reminder-button">notification_add</div>
            </li>
        </ul>
    </div>
</template>

<script setup>
let dueWorkItems = document.querySelectorAll('#component52396 .information-list .card');
</script>

<style scoped>
.reminder-button {
    @apply absolute w-[20px] aspect-square right-[10px] top-[5px] cursor-pointer text-gray-500 transition-all text-xl
}

.reminder-button:hover {
    @apply text-gray-400
}
</style>