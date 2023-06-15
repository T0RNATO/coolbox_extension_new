<template>
    <div>
        <div class="grid grid-cols-[65%,35%]">
            <!-- Left Column -->
            <div class="px-4">
                <GreetingText />
                <hr>
                <Timetable />
                <TimeLeft />
                <hr>
                <Tiles />
                <CoolBoxMessage/>
            </div>
            <!-- Right Column -->
            <div class="px-4">
                <UpcomingDueWork />
                <NewsItems />
            </div>
        </div>
    </div>
</template>

<script setup>
import GreetingText from "~/components/GreetingText.vue";
import UpcomingDueWork from "~/components/UpcomingDueWork.vue";
import Tiles from "~/components/Tiles.vue";
import CoolBoxMessage from "~/components/CoolBoxMessage.vue";
import Timetable from "~/components/Timetable.vue";
import TimeLeft from "~/components/TimeLeft.vue";
import NewsItems from "~/components/NewsItems.vue";
</script>

<style>
</style>
