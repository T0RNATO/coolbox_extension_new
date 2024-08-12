<script setup lang="ts">
import PopupBase from "~/components/popups/PopupBase.vue";
import {ref} from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";

function openPopup() {
    subject.value = '';
    popup.value.openPopup();
}

defineExpose({openPopup});

defineProps<{
    subjects: {name: string, pretty: string}[];
}>();

const popup = ref(null);

const subject = ref('');
</script>

<template>
<PopupBase title="Create Task" ref="popup" class="overflow-y-visible">
    <div class="grid grid-cols-2 items-center gap-y-4">
        <span>Title:</span>
        <input type="text" placeholder="Title">
        <span>Date:</span>
        <VueDatePicker :flow="['calender', 'time']" placeholder="Time" format="dd/MM/yyyy HH:mm"
                       position="left" input-class-name="!bg-primary !text-themeText"
                       :is-24="false" model-type="timestamp"/>
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
        </div>
    </div>
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