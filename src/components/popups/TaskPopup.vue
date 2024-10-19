<script setup lang="ts">
import PopupBase from "~/components/popups/PopupBase.vue";
import {ref} from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import {apiSend, updateTasks} from "~/utils/apiUtils.js";
import {Task} from "~/utils/types.js";

function openPopup() {
    subject.value = '';
    error.value = '';
    title.value = '';
    due.value = 0;
    popup.value.openPopup();
}

defineExpose({openPopup});

defineProps<{
    subjects: {name: string, pretty: string}[];
}>();

const popup = ref(null);

const title = ref('');
const subject = ref('');
const due = ref(0);

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
    const task: Partial<Task> = {title: title.value, due: new Date(due.value).toISOString(), type: "Task"};
    if (subject.value) {
        task.subject = subject.value;
    }
    apiSend("POST", "tasks", task, "Task created successfully.", "Failed to create task.", updateTasks);
}
</script>

<template>
<PopupBase title="Create Task" ref="popup" class="overflow-y-visible">
    <div class="grid grid-cols-[30%_70%] items-center gap-y-4">
        <span>Title:</span>
        <input type="text" placeholder="Title" v-model="title">
        <span>Due Date:</span>
        <!--suppress TypeScriptValidateTypes -->
        <VueDatePicker :flow="['calender', 'time']" placeholder="Time" format="dd/MM/yyyy HH:mm"
                       position="left" input-class-name="!bg-primary !text-themeText"
                       :is-24="false" model-type="timestamp" class="h-10" v-model="due"/>
        <div class="col-span-2">
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
        <button class="button-l submit" @click="create">Create</button>
        <button class="button-r">Cancel</button>
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