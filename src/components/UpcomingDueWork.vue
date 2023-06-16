<template>
    <div>
        <h2 class="subheader">Upcoming Due Work</h2>
        <ul class="information-list bg-white">
            <li v-for="tile in dueWorkItems">
                <div class="card" v-html="tile.innerHTML"></div>
                <div class="cb-icon reminder-button">notification_add</div>
            </li>
            <li>
                <div class="card flex-row w-full">
                    <div class="button">
                        <div>
                            <span class="cb-icon align-bottom">add</span>
                            Add Reminder
                        </div>
                    </div>
                    <div class="button">
                        <div>
                            <span class="cb-icon align-bottom">visibility</span>
                            View All Reminders
                        </div>
                    </div>
                </div>
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

.button {
    @apply w-full m-2 mt-0
}
</style>