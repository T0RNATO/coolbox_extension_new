<template>
    <div>
        <div class="bg-primary rounded-md flex p-2 flex-wrap text-themeText" :class="{mt: !widgInfo['edit']}">
            <div class="shadow rounded-md flex items-center flex-col border-solid border-gray-500 m-1 w-[calc(33%-8px)] justify-between"
                 v-for="(day, i) in daily_data" :key="i">
                <span class="font-semibold">
                    {{day.time}}
                </span>
                <div class="flex min-w-[80%] max-w-[95%] justify-center">
                    <div class="flex flex-col items-center mr-4 max-w-[60%]">
                        <span class="material-symbols-outlined text-5xl text-blue-400">{{day['weathercode']?.icon}}</span>
                        <span class="text-xs text-center px-1" :class="{fontL: widgInfo['col'] === 'leftCol'}">
                            {{day['weathercode']?.message || "Loading..."}}
                        </span>
                    </div>
                    <div class="flex flex-col justify-center">
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
import {apiGet, cookieFetched} from "~/utils/apiUtils";

let daily_data = ref([{}, {}, {}]);

cookieFetched.then(() => {
    apiGet("weather", (data) => {
        daily_data.value = data['forecast'];
    })
})

defineProps({
    widgInfo: Object
})
</script>

<style scoped>
.fontL {
    @apply text-sm
}
</style>