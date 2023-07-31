<template>
    <PopupBase :title="edit ? 'Edit Reminder' : 'Create Reminder'" ref="popupComponent" class="overflow-y-visible">
        Name:
        <input placeholder="Reminder Name" maxlength="128" class="!bg-primary !text-themeText" v-model="rem.title">
        Time:
        <VueDatePicker :flow="['calender', 'time']" placeholder="Time"
                       position="left" input-class-name="!bg-primary !text-themeText"
                       v-model="rem['due']" :is-24="false" model-type="timestamp"/>
        Notification Method:
        <shadow-root :adopted-style-sheets="defaultSheets">
            <!--Why is (key, value) backwards??-->
            <div class="flex items-center mb-1" v-for="(display, value) in {
                desktop: 'System Notification',
                discord: 'Discord Ping',
                both: 'Both'
            }">
                <input type="radio" name="notification_method" :id="value" :value="value" class="dui-radio" v-model="rem.method">
                <label :for="value" class="ml-1">{{display}}</label>
            </div>
        </shadow-root>

        <span class="text-red-500 block" v-if="(rem.method === 'discord' || rem.method === 'both') && !discordLinked">
            You must
            <a :href="authLink">authenticate</a>
            to receive Discord notifications
        </span>
        <span class="text-red-500" v-if="rem.method === 'desktop' || rem.method === 'both'">
            Note: You must enable browser notifications for system notifications
        </span>

        <form method="dialog">
            <div class="mt-4" v-if="edit">
                <button class="w-[calc(50%-0.5rem)] mr-2 bg-red-500 text-white" @click="deleteReminder">Delete Reminder</button>
                <button class="!w-[calc(50%-0.5rem)] ml-2 submit" @click="saveReminder">Save</button>
            </div>
            <div class="mt-4" v-else>
                <button class="w-[calc(50%-0.5rem)] mr-2">Cancel</button>
                <button class="!w-[calc(50%-0.5rem)] ml-2 submit" @click="createReminder">Create Reminder</button>
            </div>
        </form>
    </PopupBase>
</template>

<script setup>
import VueDatePicker from "@vuepic/vue-datepicker"
import {ShadowRoot} from "vue-shadow-dom";
import {defaultSheets} from "~/utils/componentUtils";
import {ref} from "vue";
import {apiSend, cookieFetched, discordLinked, updateReminders} from "~/utils/apiUtils";
import PopupBase from "~/components/popups/PopupBase.vue";
import browser from "webextension-polyfill";

defineProps({
    edit: Boolean
})

const authLink = ref();
cookieFetched.then(cookie => {
    authLink.value = "https://api.coolbox.lol/discord/redirect?state=" + cookie;
})

const rem = ref({});
const popupComponent = ref(null);
function openPopup(reminder) {
    popupComponent.value.$el.showModal();
    rem.value = reminder;
}

function validateReminder(ev) {
    const r = rem.value;
    if (r['title'] && r['due'] && r['method']) {
        return true;
    } else {
        ev.preventDefault();
        alert('Please fill out all fields');
        return false;
    }
}

function createReminder(ev) {
    if (validateReminder(ev)) {
        apiSend("POST", "reminders", rem.value,
            "Reminder created successfully",
            "Failed to create reminder", () => {
                browser.runtime.sendMessage("createNotifications");
                updateReminders();
            }
        );
    }
}
function saveReminder(ev) {
    if (validateReminder(ev)) {
        apiSend("PATCH", "reminders", rem.value,
            "Reminder updated successfully",
            "Failed to update reminder", () => {
                browser.runtime.sendMessage("createNotifications");
            }
        );
    }
}
function deleteReminder() {
    apiSend("DELETE", "reminders", rem.value,
        "Reminder deleted successfully",
        "Failed to delete reminder", () => {
            browser.runtime.sendMessage("createNotifications");
            updateReminders();
        }
    );
}

defineExpose({openPopup});
</script>

<style>
.dp__button {
    display: none;
}
</style>