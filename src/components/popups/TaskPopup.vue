<script setup lang="ts">
import PopupBase from "~/components/popups/PopupBase.vue";
import {ref} from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import {apiSend, updateTasks, userTasks} from "~/utils/apiUtils.js";
import {Task, WorkItem} from "~/utils/types.js";

function openPopup(task?: WorkItem) {
    if (!task) {
        editing.value = false;
        subject.value = '';
        title.value = '';
        content.value = '';
        due.value = 0;
    } else {
        editing.value = true;
        editingID = task.id;
        subject.value = task.subject;
        title.value = task.name;
        content.value = userTasks.value.find(t => t.id === task.id).content;
        due.value = new Date(task.due).getTime();
    }
    error.value = '';
    popup.value.openPopup();
}

defineExpose({openPopup});

defineProps<{
    subjects: {name: string, pretty: string}[];
}>();

const editing = ref(false);
let editingID = 0;

const popup = ref(null);

const title = ref('');
const subject = ref('');
const due = ref(0);
const content = ref('');

const error = ref('');

function create(event: MouseEvent) {
    if (!title.value) {
        error.value = "A title is required.";
        event.preventDefault()
        return
    } else if (!due.value) {
        error.value = "A due date is required.";
        event.preventDefault()
        return
    }
    const task: Partial<Task> = {title: title.value, content: content.value,
        due: new Date(due.value).toISOString(), type: "Task"};
    if (subject.value) {
        task.subject = subject.value;
    }
    if (!editing.value) {
        apiSend("POST", "tasks", task, "Task created successfully.", "Failed to create task.",
            Array.prototype.push.bind(userTasks.value));
    } else {
        task.id = editingID;
        apiSend("PATCH", "tasks", task, "Task edited successfully.", "Failed to edit task.", (newTask: Task) => {
            userTasks.value[userTasks.value.findIndex(el => el.id === newTask.id)] = newTask
        })
    }
}
</script>

<template>
<PopupBase :title="editing ? 'Edit Task':'Create Task'" ref="popup" class="overflow-y-visible">
    <div class="grid grid-cols-[30%_70%] items-center gap-y-4">
        <span>Title:</span>
        <input type="text" placeholder="Title" v-model="title">
        <span>Due Date:</span>
        <!--suppress TypeScriptValidateTypes -->
        <VueDatePicker :flow="['calender', 'time']" placeholder="Time" format="dd/MM/yyyy HH:mm"
                       position="left" input-class-name="!bg-primary !text-themeText"
                       :is-24="false" model-type="timestamp" class="h-10" v-model="due"/>
        <div class="col-span-2">
            <span>Details:</span><span class="text-gray-500 pl-2 text-sm">(Optional)</span>
            <textarea v-model="content" class="resize-y max-h-60"></textarea>
            <span>Subject:</span>
            <div class="flex flex-wrap gap-2 mt-2">
                <div v-for="subj in subjects">
                    <input type="radio" name="subjects" :value="subj.name" :id="'cb-' + subj.name" v-model="subject">
                    <label class="button" :for="'cb-' + subj.name">{{subj.pretty}}</label>
                </div>
                <div>
                    <input type="radio" name="subjects" value="" id="cb-none" v-model="subject">
                    <label class="button" for="cb-none">None</label>
                </div>
            </div>
            <span class="text-red-500">{{error}}</span>
        </div>
    </div>
    <template #buttons>
        <button class="button-l">Cancel</button>
        <button class="button-r submit" @click="create">{{editing ? 'Save' : 'Create'}}</button>
    </template>
</PopupBase>
</template>

<style scoped>
input, label {
    @apply !m-0;
}
label {
    @apply !p-2 !min-h-0 rounded-sm !flex items-center;
}
input:checked + label {
    @apply bg-faded-green outline-green-400 outline-2 outline;
}
</style>