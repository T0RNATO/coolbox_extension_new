<template>
    <div>
        <div class="bg-white rounded-md flex p-2 flex-wrap" :class="{mt: !editMode}">
            <div class="shadow rounded-md flex items-center flex-col border-solid border-gray-500 m-1 w-[calc(33%-8px)]"
                 v-for="(day, i) in daily_data" :key="day.time">
                <span class="font-semibold">
                    {{
                        Number(i) === 0 ? `Today (${new Date(day.time * 1000).toLocaleDateString("en-US", {weekday: "short"})})` :
                        Number(i) === 1 ? "Tomorrow":
                        new Date(day.time * 1000).toLocaleDateString("en-US", {weekday: "long"})
                    }}
                </span>
                <div class="flex">
                    <div class="flex flex-col items-center mr-4 max-w-[60%]">
                        <span class="material-symbols-outlined text-5xl text-blue-400">{{wmoCodes[day["weathercode"]]?.icon}}</span>
                        <span class="text-xs">{{wmoCodes[day["weathercode"]]?.message || "Loading..."}}</span>
                    </div>
                    <div class="flex flex-col items-center">
                        <div class="dui-tooltip" data-tip="Minimum Temperature">
                            <span class="text-xl text-blue-500">{{day["temperature_2m_min"]}}°</span>
                        </div>
                        <div class="dui-tooltip" data-tip="Maximum Temperature">
                            <span class="text-xl text-red-600">{{day["temperature_2m_max"]}}°</span>
                        </div>
                    </div>
                </div>
                <div class="flex mb-1">
                    <div class="dui-tooltip" data-tip="Rain Chance">
                        <span class="material-symbols-outlined text-xl mr-1">rainy</span>
                        <span class="text-xl mr-2">{{day["precipitation_probability_mean"]}}%</span>
                    </div>
                    <div class="dui-tooltip" data-tip="UV Index">
                        <span class="material-symbols-outlined text-xl mr-1 text-yellow-500">sunny</span>
                        <span class="text-xl text-yellow-500">{{Math.round(day["uv_index_max"])}}</span>
                    </div>
                </div>
            </div>
            <span class="material-symbols-outlined text-gray-500">location_on</span> <span class="italic text-gray-500">Donvale</span>
        </div>
        <EditingContextMenu @delete="$emit('delete')"/>
    </div>
</template>

<script setup>
import EditingContextMenu from "~/components/EditingContextMenu.vue";
import {ref} from "vue";
import browser from "webextension-polyfill";

defineProps({
    editMode: Boolean
})

let daily_data = ref([{}, {}, {}]);

browser.storage.local.get("weatherCache").then(data => {
    // Check if there is any data cached, and if it's from today
    if (data.weatherCache && new Date(data.weatherCache.time).getDate() === new Date().getDate()) {
        daily_data.value = data.weatherCache.data;
    } else {
        fetch("https://api.open-meteo.com/v1/forecast?latitude=-37.79&longitude=145.17&daily=weathercode,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_probability_mean&forecast_days=3&timezone=Australia/Melbourne&timeformat=unixtime").then(response => response.json().then(data => {
            for (const [key, value] of Object.entries(data["daily"])) {
                daily_data.value[0][key] = value[0];
                daily_data.value[1][key] = value[1];
                daily_data.value[2][key] = value[2];
            }
            browser.storage.local.set({
                weatherCache: {
                    data: daily_data.value,
                    time: Date.now()
                }
            })
        }))
    }
})

const wmoCodes = {
    0: {"message": "Clear sky", "icon": "clear_day"},
    1: {"message": "Mainly clear sky", "icon": "clear_day"},
    2: {"message": "Partly cloudy", "icon": "partly_cloudy_day"},
    3: {"message": "Overcast", "icon": "cloudy"},
    45: {"message": "Fog", "icon": "foggy"},
    48: {"message": "Fog", "icon": "foggy"},
    51: {"message": "Light drizzle", "icon": "rainy_snow"},
    53: {"message": "Moderate drizzle", "icon": "rainy_light"},
    55: {"message": "Heavy drizzle", "icon": "rain_heavy"},
    56: {"message": "Light freezing drizzle", "icon": "rainy_snow"},
    57: {"message": "Heavy freezing drizzle", "icon": "rain_heavy"},
    61: {"message": "Light rain", "icon": "rainy_snow"},
    63: {"message": "Moderate rain", "icon": "rainy_light"},
    65: {"message": "Heavy rain", "icon": "rain_heavy"},
    66: {"message": "Light freezing rain", "icon": "rainy_snow"},
    67: {"message": "Heavy freezing rain", "icon": "rain_heavy"},
    80: {"message": "Light showers", "icon": "rainy_snow"},
    81: {"message": "Moderate showers", "icon": "rainy_light"},
    82: {"message": "Heavy showers", "icon": "rain_heavy"},
    95: {"message": "Thundering", "icon": "thunderstorm"},
    97: {"message": "Heavily thundering", "icon": "thunderstorm"},
    96: {"message": "Thundering with light hail", "icon": "thunderstorm"},
    99: {"message": "Thundering with heavy hail", "icon": "thunderstorm"},
    // We ain't gonna need these, but its documented
    71: {"message": "Slight snow", "icon": ""},
    73: {"message": "Moderate snow", "icon": ""},
    75: {"message": "Heavy snow", "icon": ""},
    85: {"message": "Light snow showers", "icon": ""},
    86: {"message": "Heavy snow showers", "icon": ""},
}
</script>

<style scoped>

</style>