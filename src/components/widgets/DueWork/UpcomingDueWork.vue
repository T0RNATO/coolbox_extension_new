<template>
    <div>
        <h2 class="subheader">Due Work</h2>
        <ul class="information-list rounded-lg bg-primary overflow-hidden" id="due-work" :class="{limitHeight: widgInfo.add}">
            <li v-for="workItem in dueWorkItems">
                <div class="w-full p-2" :class="{hiderem: hiddenReminderIds.includes(getAssessmentId(workItem))}">
                    <!-- Work Item Name -->
                    <h3 v-html="workItem.firstElementChild.innerHTML" class="m-0"></h3>
                    <!-- Work Item Subject -->
                    <p class="meta inline">
                        <a :href="(workItem.children[1].firstElementChild as HTMLAnchorElement)?.href">
                            {{
                                prettySubjects?.find(
                                    subject => subject?.name?.toLowerCase() ===
                                        workItem.children[1]?.firstElementChild?.textContent?.split("(")[1]?.slice(0, -1)?.toLowerCase()
                                )?.pretty
                                || workItem.children[1].firstElementChild?.textContent
                            }}
                        </a>
                        {{workItem.children[1].lastChild.textContent}}
                    </p>
                    <!-- Time left -->
                    <p class="meta" v-html="workItem.lastElementChild.innerHTML"></p>
                    <!-- Add reminder button -->
                    <div class="reminder-button" v-if="!hiddenReminderIds.includes(getAssessmentId(workItem))">
                        <span class="cb-icon assessment-button" @click="editReminder(workItem as HTMLElement)">
                            {{reminderExists(workItem) ? 'notifications_active' : 'notification_add'}}
                        </span>
                            <span class="cb-icon assessment-button" @click="hiddenReminderIds = [...hiddenReminderIds, getAssessmentId(workItem)];">
                            visibility_off
                        </span>
                    </div>
                    <!-- Hide work item button -->
                    <div v-else class="reminder-button !top-2">
                        <div class="dui-tooltip dui-tooltip-left" data-tip="Restore Task">
                            <!--suppress TypeScriptUnresolvedReference, toSpliced randomly is unrecognised despite target of ESNext -->
                            <span class="cb-icon assessment-button text-green-400"
                                  @click="hiddenReminderIds = hiddenReminderIds.toSpliced(hiddenReminderIds.indexOf(getAssessmentId(workItem)), 1)">
                                visibility
                            </span>
                        </div>
                    </div>
                </div>
            </li>
            <ReminderButtons
                @view-reminders="$emit('viewReminders')"
                @create-reminder="createReminder(false)"
            />
        </ul>
        <EditingContextMenu @delete="$emit('delete')"/>
    </div>
</template>

<script setup lang="ts">
import EditingContextMenu from "~/components/other/EditingContextMenu.vue";
import {Ref, ref} from "vue";
import browser from "webextension-polyfill";
import {useExtensionStorage} from "~/utils/componentUtils";
import ReminderButtons from "~/components/widgets/DueWork/ReminderButtons.vue";
import type {widgInfo} from "~/utils/types";

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

function editReminder(workItem: Element) {
    if (reminderExists(workItem)) {
        emit('editReminder', props.widgInfo.reminders.find(reminder => reminder.assessment === getAssessmentId(workItem)));
    } else {
        createReminder(true, workItem);
    }
}
</script>

<style scoped>
.reminder-button {
    @apply absolute w-[20px] aspect-square right-[10px] top-[5px] cursor-pointer text-gray-500 text-xl;
}

.assessment-button {
    @apply transition-all;
}

.assessment-button:hover {
    @apply text-gray-400;
}

.limitHeight {
    max-height: 240px;
}

.hiderem {
    @apply max-h-3 !bg-accent transition-[max-height] overflow-hidden;
}

.hiderem > h3 {
    @apply mt-5 transition-[margin];
}
.hiderem:hover > h3 {
    @apply mt-0;
}
.hiderem .assessment-button {
    @apply transition-[opacity] opacity-0;
}
.hiderem:hover .assessment-button {
    @apply opacity-100;
}

.hiderem:hover {
    @apply max-h-24 pt-2;
}
</style>

<style>
#due-work h3 {
    @apply w-[95%]
}
</style>
