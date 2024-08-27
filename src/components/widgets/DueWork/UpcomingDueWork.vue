<template>
    <div>
        <h2 class="subheader">Due Work</h2>
        <ul class="information-list rounded-lg bg-primary overflow-hidden" id="due-work" :class="{limitHeight: widgInfo.add}">
            <li v-for="workItem in dueWorkItems">
                <DueWorkItem
                    :work-item="workItem"
                    :hidden-ids="hiddenReminderIds"
                    :pretty="prettySubjects"
                    @show="show"
                    @hide="hide"
                />
            </li>
            <li class="!pt-2">
                <div class="flex-row w-full flex p-0 text-sm">
                    <div class="button" @click="createReminder(false)">
                        <div>
                            <span class="cb-icon align-bottom">add</span>
                            Add Reminder
                        </div>
                    </div>
                    <div class="button" @click="$emit('viewReminders')">
                        <div>
                            <span class="cb-icon align-bottom">visibility</span>
                            View All Reminders
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <EditingContextMenu @delete="$emit('delete')"/>
    </div>
</template>

<script setup lang="ts">
import EditingContextMenu from "~/components/other/EditingContextMenu.vue";
import {Ref, ref} from "vue";
import browser from "webextension-polyfill";
import {useExtensionStorage} from "~/utils/componentUtils";
import type {widgInfo} from "~/utils/types";
import DueWorkItem from "~/components/widgets/DueWork/DueWorkItem.vue";

let dueWorkItems = document.querySelectorAll('#component52396 .information-list .card');

const prettySubjects: Ref<{pretty: string, name: string}[]> = ref([]);
const hiddenReminderIds: Ref<number[]> = useExtensionStorage('hiddenReminders', []);

// Couldn't find a better way to do this
setTimeout(() => {
    // Remove any hidden reminders that no longer exist
    for (const reminder of hiddenReminderIds.value) {
        if (!document.querySelector(`#component52396 .information-list .card h3 a[href*="/${reminder}"]`)) {
            // noinspection TypeScriptUnresolvedReference, toSpliced randomly is unrecognised despite target of ESNext
            hiddenReminderIds.value = hiddenReminderIds.value.toSpliced(hiddenReminderIds.value.indexOf(reminder), 1)
        }
    }
}, 1000)

browser.storage.local.get("subjects").then(data => {
    prettySubjects.value = data.subjects?.value || []
})

const props = defineProps<{
    widgInfo: widgInfo
}>();

const emit = defineEmits(['openReminder', 'delete', 'viewReminders', 'editReminder']);

function createReminder(assessmentReminder: boolean, workItem?: Element) {
    if (assessmentReminder) {
        const assessmentId = getAssessmentId(workItem);
        const title = workItem.querySelector('h3').innerText;
        emit('openReminder', {assessment: assessmentId, title: title})
    } else {
        emit('openReminder', {});
    }
}

function reminderExists(workItem: Element): boolean {
    if (props.widgInfo.reminders) {
        return props.widgInfo.reminders.some(reminder => reminder.assessment === getAssessmentId(workItem));
    }
    return false;
}

function getAssessmentId(workItem: Element): number {
    const id = (workItem.querySelector('h3 a') as HTMLAnchorElement)?.href.split('/').slice(-2, -1)[0];
    return Number(id);
}

function hide(id: number) {
    hiddenReminderIds.value = [...hiddenReminderIds.value, id];
}
function show(id: number) {
    hiddenReminderIds.value = hiddenReminderIds.value.toSpliced(hiddenReminderIds.value.indexOf(id), 1)
}

function editReminder(workItem: Element) {
    if (reminderExists(workItem)) {
        emit('editReminder', props.widgInfo.reminders.find(reminder => reminder.assessment === getAssessmentId(workItem)));
    } else {
        createReminder(true, workItem);
    }
}
</script>

<style scoped>
.limitHeight {
    max-height: 240px;
}
.button {
    @apply w-full m-2 mt-0 flex items-center justify-center rounded-md;
}
</style>

<style>
#due-work h3 {
    @apply w-[95%]
}
</style>
