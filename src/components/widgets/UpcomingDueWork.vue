<template>
    <div>
        <h2 class="subheader">Due Work</h2>
        <ul class="information-list bg-white" id="due-work" :class="{limitHeight: widgInfo['add']}">
            <li v-for="workItem in dueWorkItems">
                <div class="card w-full" :class="{hiderem: hiddenReminders.includes(getAssessmentId(workItem))}">
                    <h3 v-html="workItem.firstElementChild.innerHTML"></h3>
                    <p class="meta">
                        <a :href="workItem.children[1].firstElementChild.href">
                            {{
                                prettySubjects?.find(
                                    subject => subject['name']?.toLowerCase() ===
                                        workItem.children[1].firstElementChild?.textContent?.split("(")[1].slice(0, -1)?.toLowerCase()
                                )?.pretty
                                || workItem.children[1].firstElementChild?.textContent
                            }}
                        </a>
                        {{workItem.children[1].lastChild.textContent}}
                    </p>
                    <p class="meta pb-2" v-html="workItem.lastElementChild.innerHTML"></p>
                    <div class="reminder-button" v-if="!hiddenReminders.includes(getAssessmentId(workItem))">
                        <span class="material-symbols-outlined assessment-button" @click="editReminder(workItem)">
                            {{reminderExists(workItem) ? 'notifications_active' : 'notification_add'}}
                        </span>
                            <span class="material-symbols-outlined assessment-button" @click="hiddenReminders = [...hiddenReminders, getAssessmentId(workItem)];">
                            visibility_off
                        </span>
                    </div>
                    <div v-else class="reminder-button">
                        <div class="dui-tooltip" data-tip="Restore Task">
                            <span class="material-symbols-outlined assessment-button text-green-400"
                                  @click="hiddenReminders = hiddenReminders.toSpliced(hiddenReminders.indexOf(getAssessmentId(workItem)), 1)">
                                visibility
                            </span>
                        </div>
                    </div>
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
import {ref} from "vue";
import browser from "webextension-polyfill";
import {useExtensionStorage} from "~/utils/componentUtils";

let dueWorkItems = document.querySelectorAll('#component52396 .information-list .card');

const prettySubjects = ref([]);
const hiddenReminders = useExtensionStorage('hiddenReminders', []);

// Remove any hidden reminders that no longer exist
for (const reminder of hiddenReminders.value) {
    console.log(reminder)
    console.log(document.querySelector(`#component52396 .information-list .card h3 a[href*="/${reminder}"]`))
    if (!document.querySelector(`#component52396 .information-list .card h3 a[href*="/${reminder}"]`)) {
        hiddenReminders.value = hiddenReminders.value.toSpliced(hiddenReminders.value.indexOf(reminder), 1)
    }
}

browser.storage.local.get("subjects").then(data => {
    prettySubjects.value = data.subjects?.value || []
})

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

function editReminder(workItem) {
    if (reminderExists(workItem)) {
        emit('editReminder', props.widgInfo['reminders'].find(reminder => reminder.assessment === getAssessmentId(workItem)));
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

.button {
    @apply w-full m-2 mt-0 flex items-center justify-center;
}

.limitHeight {
    max-height: 240px;
}

.hiderem {
    @apply max-h-3 !bg-accent transition-all overflow-hidden;
}

.hiderem:hover {
    @apply max-h-20;
}
</style>

<style>
#due-work h3 {
    @apply w-[95%]
}
</style>
