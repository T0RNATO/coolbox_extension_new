<script setup lang="ts">
import {WorkItem} from "~/utils/types.js";
import {useDateFormat, useTimeAgo} from "@vueuse/core";
import {apiSend, updateTasks} from "~/utils/apiUtils.js";

const props = defineProps<{
    item: WorkItem;
    hidden?: boolean;
}>();

function colourTimeDiff(date: Date): string {
    const diff = date.getTime() - Date.now();
    return `gradient-${Math.min(Math.floor(diff/1000/60/60/24), 10)}`
}

const relativeTime = useTimeAgo(props.item.due);
const time = useDateFormat(props.item.due, 'dddd Do MMMM, h:mma')

defineEmits(['hide', 'show', 'remind', 'edit']);

function deleteTask() {
    apiSend("DELETE", "tasks", {id: props.item.id}, "Successfully deleted task.", "Failed to delete task.", updateTasks)
}
</script>

<template>
<li>
    <div class="w-full p-2" :class="{hiderem: hidden}">
        <h3 class="m-0">
            <a class="title" :href="item.link">{{item.name}}</a>
        </h3>
        <p class="meta inline" v-if="item.subject">
            <a :href="item.subjectLink">
                {{ item.prettySubject.value }}
            </a>
            {{ item.subject }}
        </p>
        <p class="meta">
            <span v-if="item.due !== null" :class="colourTimeDiff(item.due)">
                Due {{ time }} ({{ relativeTime }})
            </span>
            <span v-else class="bg-red-500 inline-block p-1 mt-1 rounded-sm text-white">
                Resubmission Required!
            </span>
        </p>

        <div class="reminder-buttons">
            <span class="cb-icon text-green-400 -mt-2" @click="$emit('show', item.id)" v-if="hidden">visibility</span>
            <template v-else>
                <span class="cb-icon" @click="$emit('hide', item.id)" v-if="!item.userDefined">visibility_off</span>
                <span class="cb-icon" @click="deleteTask" v-else>delete</span>

                <!--todo-->
<!--                <span class="cb-icon" v-if="!item.userDefined">edit_note</span>-->
                <span class="cb-icon" v-if="item.userDefined" @click="$emit('edit', item)">edit</span>

                <span class="cb-icon" @click="$emit('remind', item.id, item.name)">
                    {{item.reminderExists ? 'notifications_active' : 'notification_add'}}
                </span>
            </template>
        </div>
    </div>
</li>
</template>

<style scoped>
.reminder-buttons {
    top: 5px;
    width: 20px;
    right: 7px;
    @apply absolute aspect-square cursor-pointer text-gray-500 text-xl flex flex-col;
}

.hiderem {
    @apply max-h-3 !bg-accent transition-[max-height] overflow-hidden;

    > h3 {
        @apply mt-5 transition-[margin];
    }
    &:hover {
        @apply max-h-24 pt-2;
        > h3 {
            @apply mt-0;
        }
    }
}
</style>