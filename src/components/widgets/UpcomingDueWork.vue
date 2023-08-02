<template>
    <div>
        <h2 class="subheader">Due Work</h2>
        <ul class="information-list bg-white" id="due-work" :class="{limitHeight: widgInfo['add']}">
            <li v-for="workItem in dueWorkItems">
                <div class="card w-full" v-html="workItem.innerHTML"></div>
                <div class="material-symbols-outlined reminder-button"
                     @click="reminderButtonClick(workItem)"
                >
                    {{reminderExists(workItem) ? 'notifications_active' : 'notification_add'}}
                </div>
            </li>
            <li>
                <div class="card flex-row w-full flex px-0 text-sm">
                    <div class="button" @click="createReminder(false)">
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
        </ul>
        <EditingContextMenu @delete="$emit('delete')"/>
    </div>
</template>

<script setup>
import EditingContextMenu from "~/components/EditingContextMenu.vue";

let dueWorkItems = document.querySelectorAll('#component52396 .information-list .card');

const props = defineProps({
    widgInfo: Object
})

const emit = defineEmits(['openReminder', 'delete', 'viewReminders', 'editReminder']);

function createReminder(assessmentReminder, workItem) {
    if (assessmentReminder) {
        const assessmentId = getAssessmentId(workItem);
        const title = workItem.querySelector('h3').innerText;
        emit('openReminder', {assessment: assessmentId, title: title})
    } else {
        emit('openReminder', {});
    }
}

function reminderExists(workItem) {
    if (props.widgInfo['reminders']) {
        return props.widgInfo['reminders'].some(reminder => reminder.assessment === getAssessmentId(workItem));
    }
    return false;
}

function getAssessmentId(workItem) {
    return Number(workItem.querySelector('h3 a').href.split('/').slice(-2, -1)[0]);
}

function reminderButtonClick(workItem) {
    if (reminderExists(workItem)) {
        emit('editReminder', props.widgInfo['reminders'].find(reminder => reminder.assessment === getAssessmentId(workItem)));
    } else {
        createReminder(true, workItem);
    }
}
</script>

<style scoped>
.reminder-button {
    @apply absolute w-[20px] aspect-square right-[10px] top-[5px] cursor-pointer text-gray-500 transition-all text-xl
}

.reminder-button:hover {
    @apply text-gray-400;
}

.button {
    @apply w-full m-2 mt-0 flex items-center justify-center;
}

.limitHeight {
    max-height: 240px;
}
</style>

<style>
#due-work h3 {
    @apply w-[95%]
}
</style>