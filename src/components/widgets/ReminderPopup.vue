<script setup>
import Popup from "~/components/Popup.vue";
import VueDatePicker from "@vuepic/vue-datepicker"
import {ShadowRoot} from "vue-shadow-dom";
import {defaultSheets} from "~/utils/componentUtils";
import {ref} from "vue";
import {apiSend} from "~/utils/apiUtils";

defineProps({
    edit: Boolean
})

const rem = ref({});
const popupComponent = ref(null);
function openPopup(reminder) {
    popupComponent.value.$el.showModal();
    rem.value = reminder;
}

function createReminder() {
    console.log(rem.value);
    const r = rem.value;
    if (r['title'] && r['due'] && r['method']) {
        apiSend("POST", "reminders", r, "Reminder created successfully", "Failed to create reminder");
    } else {
        alert('Please fill out all fields');
    }
}

defineExpose({openPopup})
</script>

<template>
    <Popup :title="edit ? 'Edit Reminder' : 'Create Reminder'" ref="popupComponent">
        Name:
        <input placeholder="Reminder Name" maxlength="128" class="!bg-primary !text-themeText" v-model="rem.title">
        Time:
        <VueDatePicker :flow="['calender', 'time']" placeholder="Time"
                       position="left" input-class-name="!bg-primary !text-themeText"
                       v-model="rem.due" :is-24="false" model-type="timestamp"/>
        Notification Method:
        <shadow-root :adopted-style-sheets="defaultSheets">
            <!--Why is (key, value) backwards??-->
            <div class="flex items-center mb-1" v-for="(display, value) in {
                desktop: 'System Notification',
                discord: 'Discord Ping',
                both: 'Both'
            }">
                <input type="radio" name="notification_method" :id="value" :value="value" class="dui-radio" v-model="rem.method">
                <label for="desktop" class="ml-1">{{display}}</label>
            </div>
        </shadow-root>
        <div class="mt-4" v-if="edit">
            <button class="w-[calc(50%-0.5rem)] mr-2 bg-red-500 text-white">Delete Reminder</button>
            <button class="!w-[calc(50%-0.5rem)] ml-2 submit">Save</button>
        </div>
        <div class="mt-4" v-else>
            <button class="w-[calc(50%-0.5rem)] mr-2">Cancel</button>
            <button class="!w-[calc(50%-0.5rem)] ml-2 submit" @click="createReminder">Create Reminder</button>
        </div>
    </Popup>
</template>

<style>
.dp__button {
    display: none;
}
</style>