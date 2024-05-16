<template>
    <PopupBase :title="edit ? 'Edit Reminder' : 'Create Reminder'" ref="popupComponent" class="overflow-y-visible">
        Name:
        <input placeholder="Reminder Name" maxlength="128" class="!bg-primary !text-themeText" v-model="openReminder.title">
        Time:
        <!--suppress TypeScriptValidateTypes -->
        <VueDatePicker :flow="['calender', 'time']" placeholder="Time" format="dd/MM/yyyy HH:mm"
                       position="left" input-class-name="!bg-primary !text-themeText"
                       v-model="openReminder.due" :is-24="false" model-type="timestamp"/>
        Notification Method:
        <Shadow>
            <!--Why is (key, value) backwards??-->
            <div class="flex items-center mb-1" v-for="(display, value) in {
                desktop: 'System Notification',
                discord: 'Discord Ping',
                both: 'Both'
            }">
                <input type="radio" name="notification_method" :id="value" :value="value" class="dui-radio" v-model="openReminder.method">
                <label :for="value" class="ml-1">{{display}}</label>
            </div>
        </Shadow>

        <span class="text-red-500 block" v-if="(openReminder.method === 'discord' || openReminder.method === 'both') && !discordLinked">
            You must
            <a :href="authLink">authenticate</a>
            to receive Discord notifications
        </span>
        <span class="text-red-500" v-if="openReminder.method === 'desktop' || openReminder.method === 'both'">
            Note: You must enable browser notifications for system notifications
        </span>

        <template #buttons>
            <div class="mt-4" v-if="edit">
                <button class="button-l bg-red-500 text-white" @click="deleteReminder">Delete Reminder</button>
                <button class="button-r submit" @click="saveReminder">Save</button>
            </div>
            <div class="mt-4" v-else>
                <button class="button-l">Cancel</button>
                <button class="button-r submit" @click="createReminder">Create Reminder</button>
            </div>
        </template>
    </PopupBase>
</template>

<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker"
import Shadow from "~/components/other/Shadow.vue";
import {Ref, ref} from "vue";
import {apiSend, cookieFetched, discordLinked, updateReminders} from "~/utils/apiUtils";
import PopupBase from "~/components/popups/PopupBase.vue";
import browser from "webextension-polyfill";
import {Reminder} from "~/utils/types";

defineProps<{
    edit: boolean;
}>();

const authLink = ref();
cookieFetched.then(cookie => {
    authLink.value = "https://api.coolbox.lol/discord/redirect?state=" + cookie;
})

const openReminder: Ref<Reminder> = ref({});
const popupComponent: Ref<InstanceType<typeof PopupBase>> = ref(null);
function openPopup(reminder: Reminder) {
    popupComponent.value.openPopup();
    openReminder.value = reminder;
}

function validateReminder(event: MouseEvent) {
    const r = openReminder.value;
    if (r.title && r.due && r.method) {
        return true;
    } else {
        event.preventDefault();
        alert('Please fill out all fields');
        return false;
    }
}

function createReminder(event: MouseEvent) {
    if (validateReminder(event)) {
        apiSend("POST", "reminders", openReminder.value,
            "Reminder created successfully",
            "Failed to create reminder", () => {
                browser.runtime.sendMessage("createNotifications");
                updateReminders();
            }
        );
    }
}
function saveReminder(event: MouseEvent) {
    if (validateReminder(event)) {
        apiSend("PATCH", "reminders", openReminder.value,
            "Reminder updated successfully",
            "Failed to update reminder", () => {
                browser.runtime.sendMessage("createNotifications");
            }
        );
    }
}
function deleteReminder() {
    apiSend("DELETE", "reminders", openReminder.value,
        "Reminder deleted successfully",
        "Failed to delete reminder", () => {
            browser.runtime.sendMessage("createNotifications");
            updateReminders();
        }
    );
}

defineExpose({openPopup});
</script>

<!--suppress CssUnusedSymbol -->
<style>
.dp__button {
    display: none;
}
</style>