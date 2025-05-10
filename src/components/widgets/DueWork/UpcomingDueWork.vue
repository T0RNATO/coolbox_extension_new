<template>
    <div>
        <h2 class="subheader">Due Work</h2>
        <ul class="information-list rounded-lg bg-primary overflow-hidden" id="due-work" :class="{limitHeight: widgInfo.add}">
            <DueWorkItem v-for="workItem in dueWorkItems"
                :key="workItem.id"
                :item="workItem"
                :hidden="workItem.id && hiddenReminderIds.includes(workItem.id)"
                @show="show"
                @hide="hide"
                @remind="workItemReminder"
                @edit="$emit('popup', 'editTask', $event)"
            />
            <li class="!pt-2">
                <div class="flex-row w-full flex p-1 pt-0 text-sm">
                    <div class="button-section">
                        <div class="dui-divider">Tasks</div>
                        <div class="button-container">
                            <div class=button @click="$emit('popup', 'createTask')">
                                <span class="cb-icon align-bottom">task</span>
                                Add
                            </div>
                        </div>
                    </div>
                    <div class="button-section !flex-grow-[2]">
                        <div class="dui-divider">Reminders</div>
                        <div class="button-container">
                            <div class=button @click="createReminder(false)">
                                <span class="cb-icon align-bottom">notifications</span>
                                Add
                            </div>
                            <div class=button @click="$emit('popup', 'viewReminders')">
                                <span class="cb-icon align-bottom">visibility</span>
                                View
                            </div>
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
import {computed, ComputedRef, Ref, ref} from "vue";
import browser from "webextension-polyfill";
import {useExtensionStorage} from "~/utils/componentUtils";
import type {widgInfo, WorkItem} from "~/utils/types";
import DueWorkItem from "~/components/widgets/DueWork/DueWorkItem.vue";
import {userTasks} from "~/utils/apiUtils.js";

const props = defineProps<{
    widgInfo: widgInfo
}>();

const dueWorkItems: ComputedRef<WorkItem[]> = computed(() => {
    const userWorkItems: WorkItem[] = [];

    for (const userTask of userTasks.value) {
        const task: WorkItem = {
            due: new Date(userTask.due),
            name: userTask.title,
            reminderExists: false, //todo
            userDefined: true,
            id: userTask.id,
        }

        if (userTask.subject) {
            task.subject = userTask.subject;
            task.prettySubject = computed(() =>
                prettySubjects.value.find(subject =>
                    subject.name.toLowerCase() === userTask.subject.toLowerCase()
                )?.pretty || userTask.subject
            )
            task.subjectLink = `/homepage/code/${userTask.subject}`;
        }

        userWorkItems.push(task);
    }

    return [...sbWorkItems, ...userWorkItems].sort((a, b) => (a.due?.getTime() || Number.NEGATIVE_INFINITY) - (b.due?.getTime() || Number.NEGATIVE_INFINITY));
})

const sbWorkItems: WorkItem[] = [];

for (const sbWorkItem of document.querySelectorAll<HTMLDivElement>('#component52396 .information-list .card')) {
    const titleEl = sbWorkItem.querySelector<HTMLAnchorElement>(".title");
    const timeEl = sbWorkItem.querySelector<HTMLTimeElement>("time");
    const subjectEl = sbWorkItem.querySelector<HTMLAnchorElement>(".meta > a");

    const subject = subjectEl.textContent.split(" (")[0];

    const possibleSubjectCodes = subjectEl.textContent.split("(")[1]?.slice(0, -1)?.split(',');
    const prettySubject = computed(() =>
        prettySubjects.value.find(
            subject => possibleSubjectCodes.some(
                code => code.toLowerCase() === subject.name.toLowerCase()
            )
        )?.pretty || subject
    )

    const date = timeEl ? new Date(timeEl.dateTime): null;

    const id = Number((titleEl.href.split('/').slice(-2, -1)[0]));

    sbWorkItems.push({
        reminderExists: reminderExists(id),
        userDefined: false,
        due: date,
        name: titleEl.textContent,
        link: titleEl.href,
        prettySubject, subject,
        subjectLink: subjectEl.href,
        id
    });
}

const prettySubjects: Ref<{pretty: string, name: string}[]> = ref([]);
const hiddenReminderIds: Ref<number[]> = useExtensionStorage('hiddenReminders', []);

// Couldn't find a better way to do this
setTimeout(() => {
    // Remove any hidden reminders that no longer exist
    for (const reminder of hiddenReminderIds.value) {
        if (!document.querySelector(`#component52396 .information-list .card h3 a[href*="/${reminder}"]`)) {
            hiddenReminderIds.value = hiddenReminderIds.value.toSpliced(hiddenReminderIds.value.indexOf(reminder), 1)
        }
    }
}, 1000)

browser.storage.local.get("subjects").then(data => {
    prettySubjects.value = data.subjects?.value || [];
})

const emit = defineEmits(['popup', 'delete']);

function createReminder(assessmentReminder: boolean, id?: number, title?: string) {
    if (assessmentReminder) {
        emit('popup', 'createReminder', {assessment: id, title})
    } else {
        emit('popup', 'createReminder', {});
    }
}

function reminderExists(item: Element | number): boolean {
    if (props.widgInfo.reminders) {
        const id = typeof item === 'number' ? item : getAssessmentId(item);
        return props.widgInfo.reminders.some(reminder => reminder.assessment === id);
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

function workItemReminder(id: number, title: string) {
    if (reminderExists(id)) {
        emit('popup', 'editReminder', props.widgInfo.reminders.find(reminder => reminder.assessment === id));
    } else {
        createReminder(true, id, title);
        dueWorkItems.value.find(item => item.id === id).reminderExists = true;
    }
}
</script>

<style scoped>
.limitHeight {
    max-height: 240px;
}
.button-section {
    @apply flex-grow mx-1 flex items-center flex-col justify-center rounded-md text-gray-500;
}
.dui-divider {
    @apply mt-0 mb-2 before:bg-gray-500 after:bg-gray-500 ;
}
.button {
    @apply rounded-md w-full;
}
.button-container {
    @apply flex align-middle w-full gap-x-2;
}
</style>

<style>
#due-work h3 {
    @apply w-[95%]
}
</style>
