<template>
    <div>
        <div class="bg-primary rounded-md flex p-2 flex-wrap text-themeText flex-col lg:flex-row" :class="{mt: !widgInfo['edit']}">
            <div class="day-item"
                 v-for="(day, i) in weather" :key="i">
                <span class="day-title">
                    {{day.time}}
                </span>
                <div class="day-weather">
                    <span class="material-symbols-outlined cursor-default select-none text-5xl text-blue-400">
                        {{day.weathercode?.icon}}
                    </span>
                    <span class="text-xs text-center px-1" :class="{fontL: widgInfo['col'] === 'leftCol'}">
                        {{day.weathercode?.message || "Loading..."}}
                    </span>
                </div>
                <div class="day-temp">
                    <div class="dui-tooltip" data-tip="Maximum Temperature">
                        <span class="text-xl text-red-600">
                            {{Math.round(day.temperature_2m_max)}}°
                        </span>
                    </div>
                    <div class="dui-tooltip" data-tip="Minimum Temperature">
                        <span class="text-xl text-blue-500">
                            {{Math.round(day.temperature_2m_min)}}°
                        </span>
                    </div>
                </div>
                <div class="day-details">
                    <div class="dui-tooltip" data-tip="Rain Chance">
                        <span class="material-symbols-outlined text-xl mr-1">rainy</span>
                        <span class="text-xl mr-2">
                            {{day.precipitation_probability_mean}}%
                        </span>
                    </div>
                    <div class="dui-tooltip" data-tip="UV Index">
                        <span class="material-symbols-outlined text-xl mr-1 text-yellow-500">sunny</span>
                        <span class="text-xl text-yellow-500">
                            {{Math.round(day.uv_index_max)}}
                        </span>
                    </div>
                </div>
            </div>
            <div v-if="!weather.length">
                <span class="text-themeText">Loading Weather..</span>
                <br/>
                <div class="dui-loading dui-loading-spinner"/>
            </div>
        </div>
        <EditingContextMenu @delete="$emit('delete')"/>
    </div>
</template>

<script setup>
import EditingContextMenu from "~/components/other/EditingContextMenu.vue";
import {weather} from "~/utils/apiUtils";

defineProps({
    widgInfo: Object
})
</script>

<style scoped>
.fontL {
    @apply text-sm
}
.day-item {
    @apply shadow rounded-md border-solid border-gray-500 m-1 w-full p-1 lg:w-[calc(33%-8px)] grid;
    grid-template-columns: 65% 30%;
    grid-template-rows: 15% 70% 15%;
}
.day-title {
    @apply font-semibold w-full text-center;
    grid-column: 1 / span 2;
    grid-row: 1;
}
.day-weather {
    @apply flex flex-col items-center;
    grid-column: 1;
    grid-row: 2;
}
.day-temp {
    @apply flex flex-col justify-center;
    grid-column: 2;
    grid-row: 2;
}
.day-details {
    @apply flex mb-1 justify-center;
    grid-column: 1 / span 2;
    grid-row: 3;
}
.dui-tooltip {
    @apply flex items-center;
}
</style>