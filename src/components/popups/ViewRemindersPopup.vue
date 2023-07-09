<script setup>
import PopupBase from "~/components/popups/PopupBase.vue";
import {ref} from "vue";
import {apiGet, apiSend} from "~/utils/apiUtils";

const popupComponent = ref(null);
const reminders = ref(null);
function openPopup() {
    reminders.value = null;
    popupComponent.value.$el.showModal();
    apiGet("reminders", (data) => {
        reminders.value = data;
    })
}

const emit = defineEmits(['editReminder'])

function editReminder(rem) {
    emit('editReminder', rem);
}

function deleteReminder(rem) {
    apiSend("DELETE", "reminders", rem,
        "Reminder deleted successfully", "Failed to delete reminder",
        () => {
            // When reminder is deleted, refresh the list
            popupComponent.value.$el.close();
            openPopup()
        }
    )
}

defineExpose({openPopup});
</script>

<template>
    <PopupBase ref="popupComponent" title="Reminders" class="overflow-y-auto h-1/2">
        <div v-if="reminders === null">Loading...</div>
        <div v-else-if="reminders.length === 0">You have no reminders</div>
        <div v-else v-for="(reminder, i) in reminders" :key="i" class="border-solid border-themeText mb-2 p-2 relative">
            <span class="inline-flex items-center">
                {{reminder['title']}}
                <span class="text-gray-500">
                    <span class="material-symbols-outlined mx-1 text-sm">schedule</span>
                    {{new Date(reminder['due']).toLocaleString("en-AU", {timeStyle: "short", dateStyle: "short"})}}
                </span>
            </span>
            <br>
            <span class="text-sm text-gray-500">
                Notification on {{reminder.method.charAt(0).toUpperCase() + reminder.method.slice(1)}}
            </span>
            <!--TODO? have a link to the reminder assessment, if any-->
            <div class="absolute top-0 right-0 m-2 text-gray-500 cursor-pointer">
                <span class="material-symbols-outlined text-[20px]" @click="editReminder(reminder)">edit</span>
                <span class="material-symbols-outlined text-[20px]" @click="deleteReminder(reminder)">delete</span>
            </div>
        </div>
    </PopupBase>
</template>

<style scoped>

</style>