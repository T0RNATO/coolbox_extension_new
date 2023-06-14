<template>
    <span v-html="message"></span>
    <hr v-if="message !== null">
</template>

<script setup>
import {computed} from "vue";

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
        date.setHours(hours)
        date.setMinutes(Number(times[1]));

        period[keys[i]] = date.getTime();
    }
    periods.push(period);
}

const message = computed(() => {
    // Get the period that you are either in, or is next
    const now = Date.now();
    const targetPeriod = periods.filter((per) => {
        return per.from > now | per.to > now
    })[0];

    // If nonexistent, school is over
    if (targetPeriod === undefined) {
        return null
    }

    // If the user is inside a period
    else if (periods.some((per) => {return now >= per.from && now < per.to})) {
        const timeDifference = targetPeriod.to - now;
        const minutesLeft = Math.ceil(timeDifference / 1000 / 60);

        const plural = minutesLeft > 1;

        return `There ${plural ? "are" : "is"}<strong>${minutesLeft} minute${plural ? "s" : ""}</strong>left in the period.`
    }

    // If the user is in between periods
    else {
        const timeDifference = targetPeriod.from - now;
        const minutesUntilNextPeriod = Math.ceil(timeDifference / 1000 / 60);

        const plural = minutesUntilNextPeriod > 1;

        return `There ${plural > 1 ? "are" : "is"} <strong>${minutesUntilNextPeriod} minute${plural ? "s" : ""}</strong> until your next period.`
    }
})
</script>