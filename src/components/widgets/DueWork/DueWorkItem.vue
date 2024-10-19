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

defineEmits(['hide', 'show', 'remind']);

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
            <span :class="colourTimeDiff(item.due)">
                Due {{ time }} ({{ relativeTime }})
            </span>
        </p>

        <div class="reminder-buttons">
            <span class="cb-icon show-more h-[80px]" v-if="!item.reminderExists">more_horiz</span>
            <span class="cb-icon show-more h-[80px]" v-else>more_horiz<br>notifications_active</span>
            <div class="hover-menu">
                <span class="cb-icon" @click="$emit('show', item.id)" v-if="hidden">visibility</span>
                <template v-else>
                    <span class="cb-icon" @click="$emit('hide', item.id)" v-if="!item.userDefined">visibility_off</span>
                    <span class="cb-icon" @click="deleteTask" v-else>delete</span>

                    <span class="cb-icon" @click="$emit('remind', item.id, item.name)" v-if="!item.reminderExists">notification_add</span>
                    <span class="cb-icon" @click="$emit('remind', item.id, item.name)" v-else>notifications_active</span>

                    <!--todo-->
                    <span class="cb-icon">edit_note</span>
                </template>
            </div>
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
.hover-menu {
    @apply flex-col gap-y-1;
    &:not(:hover) {
        animation: persist 500ms forwards;
    }

    .cb-icon {
        @apply transition-colors;
        &:hover {
            @apply text-gray-400;
        }
    }
}
.show-more:not(:is(:hover, :has(+.hover-menu:hover))) {
    animation: persist-hidden 500ms forwards;
}
.hover-menu, .show-more:where(:hover, :has(+.hover-menu:hover)) {
    display: none;
}
.show-more:hover + .hover-menu, .hover-menu:hover {
    display: flex;
}

@keyframes persist {
    from { display: flex; }
    to { display: none; }
}
@keyframes persist-hidden {
    from { display: none; }
    99.9% { display: none; }
    to { display: block; }
}

.hiderem {
    @apply max-h-3 !bg-accent transition-[max-height] overflow-hidden;

    .show-more {
        display: none;
    }
    .hover-menu {
        animation: none;
    }

    > h3 {
        @apply mt-5 transition-[margin];
    }
    &:hover {
        @apply max-h-24 pt-2;
        > h3 {
            @apply mt-0;
        }
        .hover-menu {
            display: flex;
            .cb-icon {
                @apply text-green-400;
            }
        }
    }
}
</style>