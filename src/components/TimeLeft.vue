<template>
    <div v-if="minutesRemaining !== null">
        <div v-if="minutesRemaining[0]">
            <span v-if="isPlural(minutesRemaining[1])">
                There are <strong>{{ minutesRemaining[1] }}</strong> minutes until your next period.
            </span>

            <span v-else>
                There is <strong>1</strong> minute until your next period.
            </span>
        </div>
        <div v-else>
            <span v-if="isPlural(minutesRemaining[1])">
                There are <strong>{{ minutesRemaining[1] }}</strong> minutes left in the period.
            </span>

            <span v-else>
                There is <strong>1</strong> minute left in the period.
            </span>
        </div>
    </div>
    <span class="italic text-gray-500" v-else-if="editMode">(Period Time Left Widget)</span>
</template>

<script setup>
import {computed} from "vue";

defineProps({
    "editMode": Boolean
})

// Create a list of the periods that are on the timetable
const periods = [];

// Extract the times from the HTML
for (const periodElement of document.querySelectorAll(".timetable th")) {
    const range = periodElement.querySelector("time").textContent;

    const keys = ["from", "to"]
    const period = {}

    // Convert those times into epochs
    for (let [i, time] of Object.entries(range.split("–"))) {
        // Split something like 8:30am into an array of ["8", "30", "am"]
        const times = time.replace("am", ":am").replace("pm", ":pm").split(":");

        let hours = Number(times[0]);
        if (times[2] === "pm" && hours !== 12) {
            hours += 12;
        }

        // Get the current date, and then set its time
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(Number(times[1]));

        period[keys[i]] = date.getTime();
    }
    periods.push(period);
}

function isPlural(number) {
    return number !== 1;
}

const minutesRemaining = computed(() => {
    // Get the period that you are either in, or is next
    const now = Date.now();
    const targetPeriod = periods.filter((per) => {
        return per.from > now | per.to > now
    })[0];

    // If nonexistent, school is over
    if (targetPeriod === undefined) {
        return null;
    }

    if (periods.some((per) => {
        return now >= per.from && now < per.to;
    })) {
        // If the user is inside a period
        const timeDifference = targetPeriod.to - now;
        // Boolean represents currently in a period, and converts epoch to minutes
        return [false, Math.ceil(timeDifference / 1000 / 60)];
    } else {
        // Or if the user is in between periods
        const timeDifference = targetPeriod.from - now;
        return [true, Math.ceil(timeDifference / 1000 / 60)];
    }
})
</script>
