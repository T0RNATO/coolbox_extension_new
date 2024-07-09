<script setup lang="ts">
import {ref, type Ref, type Directive, nextTick, computed} from "vue";
import {dayIndexToMonthDay, getDayOfYear, toMondayBased} from "~/entries/pages/calendar/timeUtils";
import {vInfiniteScroll, vIntersectionObserver} from "@vueuse/components";

// todo: add sidebar to jump to months
// todo: fix duplicated month headings if page loads with one week of prev month visible
// todo: highlight the currently scrolled to month

type Day = {
    number: number;
    id: string;
    weekNo: number;
    month: number;
}

type Week = {
    days: Day[];
    month: number;
    showMonthTitle?: boolean;
    number: number;
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
            weekNo: dayOfWeek,
            // add one if the month changes midweek
            month: month + isFirstWeekOfMonth
        });
    }
    return {
        days,
        month: start.getMonth(),
        showMonthTitle: isFirstWeekOfMonth,
        number: weekNumber + year * 52,
    };
}

const now = new Date();
const daysThroughWeek: number = toMondayBased(now.getDay());
const daysThroughMonth: number = now.getDate();
const month = now.getMonth() + 1;

let currentScrollDayIndex = ref(getDayOfYear(now));
let currentDisplayedMonth = computed(() => {
    return dayIndexToMonthDay(currentScrollDayIndex.value - 14)[0] + 1;
})

const calendarWeeks: Ref<Week[]> = ref([
    generateDaysForWeek(currentScrollDayIndex.value - 7),
    generateDaysForWeek(currentScrollDayIndex.value),
    generateDaysForWeek(currentScrollDayIndex.value + 7),
    generateDaysForWeek(currentScrollDayIndex.value + 14),
]);

console.log(calendarWeeks.value);

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const scrollContainer: Ref<HTMLDivElement> = ref(null);

let justLoadedMore = false;

function scrollDown() {
    currentScrollDayIndex.value += 7;
    calendarWeeks.value = [
        ...calendarWeeks.value,
        generateDaysForWeek(currentScrollDayIndex.value - 7),
    ];
    justLoadedMore = true;
}

async function scrollUp([{ isIntersecting }]: IntersectionObserverEntry[]) {
    if (isIntersecting) {
        currentScrollDayIndex.value -= 7;
        calendarWeeks.value = [
            generateDaysForWeek(currentScrollDayIndex.value - 28),
            ...calendarWeeks.value,
        ];
        justLoadedMore = true;
        await nextTick()
        scrollContainer.value.scrollTop = 320;
    }
}

let oldWeekNumber = Math.floor((currentScrollDayIndex.value - 7) / 7) * 7 + now.getFullYear() * 52;
function scrollChange(weekNumber: number, [{ isIntersecting }]: IntersectionObserverEntry[]) {
    if (isIntersecting) {
        if (justLoadedMore) {
            justLoadedMore = false;
            return;
        }
        console.log("scrollChange");
        if (weekNumber > oldWeekNumber) {
            currentScrollDayIndex.value += 7;
        } else if (weekNumber < oldWeekNumber) {
            currentScrollDayIndex.value -= 7;
        }
    }
}

const vStartScrolled: Directive<HTMLDivElement> = {
    mounted(el) {
        el.scrollTo(0, 160);
    }
}

// Fix infinite scrolling breaking after a hot reload in dev environment
if (import.meta.hot) {
    import.meta.hot.on('vite:beforeUpdate', () => {
        import.meta.hot.data.scroll = currentScrollDayIndex.value;
    });

    import.meta.hot.on('vite:afterUpdate', () => {
        console.log("hot reloaded");
        if (scrollContainer.value.scrollTop !== 160) {
            currentScrollDayIndex.value = import.meta.hot.data.scroll;
        }
    });
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
         v-start-scrolled
         ref="scrollContainer"
    >
        <div class="scroll-padding" v-intersection-observer="scrollUp"></div>
        <div class="cl-row" v-for="week in calendarWeeks"
             v-intersection-observer="scrollChange.bind(null, [week.number])">
            <div class="month-heading subheader" v-if="week.showMonthTitle">
                {{months[week.month]}}
            </div>
            <div class="cl-day" v-for="day in week.days" :key="day.id"
                 :class="{isToday:      daysThroughMonth === day.number,
                          greyed:       day.month + 1 !== currentDisplayedMonth,
                          firstOfMonth: day.number === 1,
                          weekend:      day.weekNo > 4
                 }"
            >
                {{day.number}}
                <span v-if="daysThroughMonth === day.number && day.month + 1 == currentDisplayedMonth"
                      class="subheader absolute right-2 my-0">Today</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.cl-day {
    @apply bg-primary rounded-md w-full h-40 text-themeText p-2 relative;
    transition: background-color 300ms, opacity 300ms;
    &.greyed {
        @apply opacity-40;
    }
    &.firstOfMonth {
        border-left: 5px solid rgb(255 255 255 / 0.2);
    }
    &.weekend {
        @apply bg-accent/70;
    }
    &:hover {
        @apply bg-accent/80;
    }
    &.isToday:not(.greyed) {
        @apply bg-accent shadow-themeText/10 shadow-lg;
        border-left: 5px solid theme(colors.sky.600);
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