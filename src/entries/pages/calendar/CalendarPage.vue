<script setup lang="ts">
import {ref, type Ref, type Directive, nextTick, computed, onMounted} from "vue";
import {dateToDayId, dayIndexToMonthDay, getDayOfYear, toMondayBased} from "~/entries/pages/calendar/timeUtils";
import type {Day, Event, SchoolboxApiEvent, Week} from "./types.ts"
import CalendarDay from "~/components/calendar/CalendarDay.vue";
import TaskPopup from "~/components/popups/TaskPopup.vue";

document.title = "Coolbox Calendar"

// todo: add sidebar to jump to months
// todo: fix duplicated month headings if page loads with one week of prev month visible

function generateWeek(dayOfYear: number, overrideShowTitle = false, year = now.getFullYear()): Week {
    const days: Day[] = [];
    const [month, day] = dayIndexToMonthDay(dayOfYear);
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
            id: `${year}-${dayOfYear + dayOfWeek}`,
            weekNo: dayOfWeek,
            // add one if the month changes midweek
            month: (month + isFirstWeekOfMonth) % 12 + 1
        });
    }
    return {
        days,
        month: start.getMonth(),
        showMonthTitle: isFirstWeekOfMonth,
        id: dayOfYear + year * 52,
    };
}

const now = new Date();
const daysThroughWeek: number = toMondayBased(now.getDay());
const month = now.getMonth() + 1;

// Rounded down to nearest 7 days
let currentScrollDayIndex = ref(Math.floor(getDayOfYear(now) / 7) * 7);
let currentDisplayedMonth = computed(() => {
    return dayIndexToMonthDay(currentScrollDayIndex.value - 21)[0] + 1;
})

console.log(currentScrollDayIndex.value);

// Generates the initial seven visible weeks
const calendarWeeks: Ref<Week[]> = ref([...Array(7)].map(
    (_, i) => generateWeek(currentScrollDayIndex.value + (i - 2) * 7))
);

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const scrollContainer: Ref<HTMLDivElement> = ref(null);

const threshold = 0.3;
const observer = new IntersectionObserver(scrollChange, {threshold});
const calendarRowElements: Record<number, HTMLDivElement> = {};

const events: Ref<Record<string, Event[]>> = ref({});

const userId = Number((document.querySelector("a.icon-staff-students") as HTMLAnchorElement).href.split("/").at(-1));

let eventFetchStart = now.getTime() / 1000 - 60 * 60 * 24 * 7;
const fourWeeksInSeconds = 60 * 60 * 24 * 7 * 4;

function fetchSchoolboxEvents() {
    fetch("https://schoolbox.donvale.vic.edu.au/calendar/ajax/full" +
        `?start=${eventFetchStart}&end=${eventFetchStart + fourWeeksInSeconds}&userId=${userId}`)
        .then(response => {response.json().then(processSchoolboxEvents)});
}
fetchSchoolboxEvents();

function processSchoolboxEvents(sbEvents: SchoolboxApiEvent[]) {
    for (const event of sbEvents) {
        const time = new Date(event.start);
        let colour;

        // Exclude subjects
        if (event.data.meta.level.includes("source5")) continue;

        // Remove long subject names from assessments/tasks
        // todo: replace with pretty name, and maybe colour differently
        if (event.data.meta.eventType === "type6") {
            event.title = event.title.replace(/^.* \(.*\)\s/, "");
            colour = "rgb(220 143 143)".slice(4, -1); // support IDE colour picker
        }

        (events.value[dateToDayId(time)] ??= ([] as Event[])).push({
            due: time,
            coolbox: false,
            title: event.title,
            all_day: event.allDay,
            ...(colour && { colour }),
        })
    }
}

function smallestKey(obj: Record<number, any>): number {
    return Math.min(...Object.keys(obj) as unknown as number[]) // Automatically converted from string to number
}
function largestKey(obj: Record<number, any>): number {
    return Math.max(...Object.keys(obj) as unknown as number[]) // Automatically converted from string to number
}

const vRowCreated: Directive<HTMLDivElement> = {
    mounted(el, {value}) {
        calendarRowElements[value] = el;
    }
}

let currentlyObservedIndicies: number[] = []

onMounted(() => {
    currentlyObservedIndicies = [smallestKey(calendarRowElements), largestKey(calendarRowElements)]
    observer.observe(calendarRowElements[currentlyObservedIndicies[0]]);
    observer.observe(calendarRowElements[currentlyObservedIndicies[1]]);
})

let oldScrolledId = Math.floor((currentScrollDayIndex.value - 7) / 7) * 7 + now.getFullYear() * 52;
async function scrollChange(entries: IntersectionObserverEntry[]) {
    for (const entry of entries) {
        const { isIntersecting, target } = entry;
        if (!isIntersecting) continue;

        observer.unobserve(calendarRowElements[currentlyObservedIndicies[0]]);
        observer.unobserve(calendarRowElements[currentlyObservedIndicies[1]]);
        const top = smallestKey(calendarRowElements);
        const bottom = largestKey(calendarRowElements);

        const scrolledId = Number((target as HTMLDivElement).dataset.id);

        const scrollDirection = Math.sign(scrolledId - oldScrolledId);
        currentScrollDayIndex.value += 7 * scrollDirection;

        oldScrolledId = scrolledId;
        console.log(scrollDirection == 1 ? "scrolled down" : "scrolled up");

        if (scrolledId === top) {
            console.log("loading more at top")
            calendarWeeks.value = [
                generateWeek(currentScrollDayIndex.value - 14),
                ...calendarWeeks.value,
            ];
            await nextTick();
            scrollContainer.value.scrollTop = 160 * (2 - threshold);
        } else if (scrolledId === bottom) {
            console.log("loading more at bottom")
            calendarWeeks.value = [
                ...calendarWeeks.value,
                generateWeek(currentScrollDayIndex.value + 28),
            ];
            await nextTick();
        }

        currentlyObservedIndicies[0] += scrollDirection * 7;
        currentlyObservedIndicies[1] += scrollDirection * 7;

        observer.observe(calendarRowElements[currentlyObservedIndicies[0]]);
        observer.observe(calendarRowElements[currentlyObservedIndicies[1]]);
    }
}

const vStartScrolled: Directive<HTMLDivElement> = {
    mounted(el) {
        el.scrollTo(0, 160);
    }
}

const popup: Ref<InstanceType<typeof TaskPopup>> = ref(null);

defineProps<{
    subjects: {name: string, pretty: string}[];
}>();

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
    <teleport to="body">
        <TaskPopup ref="popup" :subjects="subjects"/>
    </teleport>
    <div class="grid grid-cols-7 pb-2 px-6 gap-4">
        <span v-for="(day, i) in days" class="text-themeText w-full text-center"
              :class="{highlightColumn: daysThroughWeek % 7 === i}">{{day}}</span>
    </div>
    <!-- Tailwind custom values don't apply immediately, thus the style="" -->
    <div class="px-6 overflow-y-auto no-scrollbar"
         style="max-height: 85vh"
         v-start-scrolled
         ref="scrollContainer"
    >
        <div class="cl-row" v-for="week in calendarWeeks"
             :key="week.id"
             v-row-created="week.id"
             :data-id="week.id"
        >
            <div class="month-heading subheader" v-if="week.showMonthTitle">
                {{months[week.month]}}
            </div>
            <CalendarDay v-for="day in week.days" :key="day.id"
                         :day="day"
                         :current-displayed-month="currentDisplayedMonth"
                         :events="events[day.id] || []"
                         @open-popup="popup.openPopup()"
            />
        </div>
    </div>
</template>

<style scoped>
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
.no-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
}
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>