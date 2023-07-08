<template>
    <div>
        <h2 class="subheader">Due Work</h2>
        <ul class="information-list bg-white" :class="{limitHeight: widgInfo['add']}">
            <li v-for="tile in dueWorkItems">
                <div class="card w-full" v-html="tile.innerHTML"></div>
                <div class="material-symbols-outlined reminder-button"
                     @click="createReminder">
                    notification_add
                </div>
            </li>
            <li>
                <div class="card flex-row w-full flex px-0">
                    <div class="button">
                        <div>
                            <span class="material-symbols-outlined align-bottom">add</span>Add Reminder
                        </div>
                    </div>
                    <div class="button">
                        <div>
                            <span class="material-symbols-outlined align-bottom">visibility</span>View All Reminders
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <EditingContextMenu @delete="$emit('delete')"/>
    </div>
</template>

<script setup>
import EditingContextMenu from "~/components/EditingContextMenu.vue";

let dueWorkItems = document.querySelectorAll('#component52396 .information-list .card');

defineProps({
    widgInfo: Object
})

const emit = defineEmits(['openReminder', 'delete']);

function createReminder(ev) {
    // Extracts the assessment ID from the link
    const h3 = ev.target.previousElementSibling.firstElementChild;
    const linkSections = h3.firstElementChild.href.split("/");
    const assessment = Number(linkSections[linkSections.length - 2]);
    emit('openReminder', {assessment: assessment, method: 'desktop', title: h3.innerText})
}
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

.limitHeight {
    max-height: 240px;
}
</style>