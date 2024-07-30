<script setup lang="ts">
import type {Day, Event} from "~/entries/pages/calendar/types.ts";

const now = new Date();
const daysThroughMonth: number = now.getDate();
const month = now.getMonth() + 1;

const props = defineProps<{
    day: Day;
    events: Event[];
    currentDisplayedMonth: number;
}>();

const isToday = daysThroughMonth === props.day.number && props.day.month === month;

const timeFormat = new Intl.DateTimeFormat('en-AU', {
    hour: "numeric",
    minute: "2-digit",
})
</script>

<template>
    <div class="cb-day"
         :class="{
            isToday,
            greyed:       day.month !== currentDisplayedMonth + 1,
            firstOfMonth: day.number === 1,
            weekend:      day.weekNo > 4
         }"
    >
        {{day.number}}
        <span v-if="isToday"
              class="subheader absolute right-2 my-0">Today</span>
        <!--todo: fix transparency when hovered-->
        <div v-for="event in events" class="cb-event"
             :style="{backgroundColor: event.colour && `rgb(${event.colour} / 0.25)`}"
             :class="isToday ? 'bg-primary/50' : 'bg-accent/70'"
        >
            <span class="cb-time" v-if="!event.all_day">{{timeFormat.format(event.due)}}</span>
            <div class="cb-title">{{event.title}}</div>
        </div>
    </div>
</template>

<style scoped>
.cb-day {
    @apply bg-primary rounded-md w-full h-40 text-themeText p-2 relative;
    transition: background-color 300ms, opacity 300ms;
    &.greyed {
        @apply opacity-40;
    }
    &.firstOfMonth {
        border-left: 5px solid theme(colors.themeText/0.2);
    }
    &.weekend {
        @apply bg-accent/70;
    }
    &:hover {
        @apply bg-accent/80;
    }
    &.isToday {
        @apply bg-accent shadow-themeText/10 shadow-lg;
        border-left: 5px solid theme(colors.sky.600);
    }
}
.cb-event {
    @apply px-1 rounded-md relative mb-1 overflow-hidden overflow-ellipsis;
    transition: padding 100ms;
    &:hover {
        z-index: 5;
        box-shadow: 0 0 8px rgb(var(--theme-text) / 0.5);
        @apply bg-accent min-w-max p-1 px-2;
        .cb-time {
            display: inline;
        }
    }
}
.cb-title {
    @apply inline-block text-nowrap;
}
.cb-time {
    @apply opacity-60 text-xs hidden mr-1;
}
</style>