<script setup lang="ts">
import {ref, type Ref, type Directive, nextTick} from "vue";
import {dayIndexToMonthDay, getDayOfYear, toMondayBased} from "~/entries/pages/calendar/timeUtils";
import {vInfiniteScroll, vIntersectionObserver} from "@vueuse/components";

type Day = {
    number: number;
    id: string;
    weekNo: number;
    firstOfMonth?: boolean
}

type Week = {
    days: Day[];
    month: number;
    showMonthTitle?: boolean;
}

function generateDaysForWeek(dayOfYear: number, overrideShowTitle = false, year = now.getFullYear()): Week {
    const weekNumber = Math.floor(dayOfYear / 7) * 7; // round to nearest whole week
    const days: Day[] = [];
    const [month, day] = dayIndexToMonthDay(weekNumber);
    const start = new Date(year, month, day);

    let isFirstWeekOfMonth = overrideShowTitle || day === 0;

    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        start.setDate(start.getDate() + 1);
        const dayNumber = start.getDate();
        if (dayNumber === 1) {
            isFirstWeekOfMonth = true;
        }
        days.push({
            number: dayNumber,
            id: `${year}-${weekNumber}-${dayOfWeek}`,
            firstOfMonth: dayNumber === 1,
            weekNo: dayOfWeek,
        });
    }
    return {
        days,
        month: start.getMonth(),
        showMonthTitle: isFirstWeekOfMonth
    };
}

const now = new Date();
const daysThroughWeek: number = toMondayBased(now.getDay());
const daysThroughMonth: number = now.getDate();
const month = now.getMonth() + 1;

let currentDisplayedMonth = ref(month);
let currentScrollDayIndex = getDayOfYear(now);

const calendarWeeks: Ref<Week[]> = ref([
    generateDaysForWeek(currentScrollDayIndex - 7, true),
    generateDaysForWeek(currentScrollDayIndex),
    generateDaysForWeek(currentScrollDayIndex + 7),
    generateDaysForWeek(currentScrollDayIndex + 14),
]);

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const scrollContainer: Ref<HTMLDivElement> = ref(null);

function scrollDown() {
    currentScrollDayIndex += 7;
    calendarWeeks.value = [
        ...calendarWeeks.value,
        generateDaysForWeek(currentScrollDayIndex + 14),
    ];
}

async function scrollUp([{ isIntersecting }]: IntersectionObserverEntry[]) {
    if (isIntersecting) {
        currentScrollDayIndex -= 7;
        calendarWeeks.value = [
            generateDaysForWeek(currentScrollDayIndex - 7),
            ...calendarWeeks.value,
        ];
        await nextTick()
        scrollContainer.value.scrollTop = 320;
    }
}

const vStartScrolled: Directive<HTMLDivElement> = {
    mounted(el) {
        el.scrollTo(0, 160);
    }
}
</script>

<template>
    <div class="grid grid-cols-7 pb-2 px-6 gap-4">
        <span v-for="(day, i) in days" class="text-themeText w-full text-center"
              :class="{highlightColumn: daysThroughWeek % 7 === i}">{{day}}</span>
    </div>
    <!-- Apparently tailwind custom values like 85vh don't apply immediately,
         making the element unable to be scrolled, thus the style="" -->
    <div class="px-6 overflow-y-auto no-scrollbar"
         style="max-height: 85vh"
         v-infinite-scroll="scrollDown"
         v-start-scrolled ref="scrollContainer"
    >
        <div class="scroll-padding" v-intersection-observer="scrollUp"></div>
        <div class="cl-row" v-for="week in calendarWeeks">
            <div class="month-heading subheader" v-if="week.showMonthTitle">
                {{months[week.month]}}
            </div>
            <div class="cl-day" v-for="day in week.days" :key="day.id"
                 :class="{highlightCell: daysThroughMonth === day.number,
                          greyed:        week.month + 1 !== currentDisplayedMonth,
                          firstOfMonth:  day.firstOfMonth,
                          weekend:       day.weekNo > 4
                }"
            >
                {{day.number}}
            </div>
        </div>
    </div>
</template>

<style scoped>
.cl-day {
    @apply bg-primary rounded-md w-full h-40 text-themeText p-2;
    transition: background-color 300ms, opacity 300ms;
    &.greyed {
        @apply opacity-40;
    }
    &.firstOfMonth {
        border-left: 5px solid rgb(255 255 255 / 0.2);
    }
    &.weekend {
        @apply bg-red-300;
    }
    &:hover, &.highlightCell:not(.greyed) {
        @apply bg-accent;
    }
}
.cl-row {
    @apply grid grid-cols-7 gap-4 mb-4 relative;
}
.month-heading {
    @apply absolute top-1/2 !m-0;
    transform-origin: center left;
    transform: rotate(270deg) translate(-33%, -75%); /* why is it 33%? who knows? but it looks right */
}
/*todo, unhardcode colour*/
.highlightColumn {
    @apply border-2 border-solid border-transparent border-b-sky-600 rounded-3xl;
}
.scroll-padding {
    @apply w-full h-40;
}
.no-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
}
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>