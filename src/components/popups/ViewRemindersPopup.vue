<script setup lang="ts">
import PopupBase from "~/components/popups/PopupBase.vue";
import {Ref, ref} from "vue";
import {reminders, updateReminders} from "~/utils/apiUtils";
import {formatDate, formatTimeAgo} from "@vueuse/core";

const popupComponent: Ref<InstanceType<typeof PopupBase>> = ref(null);
function openPopup() {
    reminders.value = null;
    popupComponent.value.openPopup();
    updateReminders();
}

const emit = defineEmits(['popup'])

function editReminder(rem) {
    emit('popup', 'editReminder', rem);
}

defineExpose({openPopup});
</script>

<template>
    <PopupBase ref="popupComponent" title="Reminders" class="overflow-y-auto h-1/2">
        <div v-if="reminders === null" class="flex w-full mt-2">
            <div class="dui-loading dui-loading-spinner justify-center"></div>
        </div>
        <div v-else-if="reminders.length === 0">You have no reminders</div>
        <div v-else v-for="(reminder, i) in reminders" :key="i" class="border-solid border-themeText mb-2 p-2 relative">
            <div class="inline-flex items-center">
                {{reminder.title}}
                <div class="dui-tooltip ml-1" :data-tip="formatDate(new Date(reminder.due), 'ddd D MMM h:mm a')">
                    <span class="text-gray-500">{{formatTimeAgo(new Date(reminder.due))}}</span>
                </div>
            </div>
            <br>
            <div class="inline-flex items-center">
                <span class="text-sm text-gray-500">
                Notification on {{reminder.method.charAt(0).toUpperCase() + reminder.method.slice(1)}}
                </span>
                <div v-if="reminder.assessment" class="inline ml-2 dui-tooltip" data-tip="Linked to assessment">
                    <a :href="'https://schoolbox.donvale.vic.edu.au/learning/assessments/' + reminder.assessment">
                        <span class="cb-icon inline-block">attachment</span>
                    </a>
                </div>
            </div>
            <span class="cb-icon text-[20px] absolute top-0 right-0 m-2 text-gray-500 cursor-pointer" @click="editReminder(reminder)">edit</span>
        </div>
    </PopupBase>
</template>