<template>
    <div>
        <div class="bg-primary rounded-md flex flex-col items-center xl:flex-row p-4" :class="{mt: !editMode}">
            <div class="clockface">
                <div class="line" v-for="i in [0,1,2,3,4,5]" :key="i" :style="`transform:rotate(${i*30}deg)`"/>
                <div class="z-10 h-12 w-1 bg-black absolute left-1/2 origin-bottom top-8"
                     :style="`transform:rotate(${(hours+minutes/60)*30}deg) translateX(-25%)`"></div>
                <div class="z-10 h-16 w-0.5 bg-black absolute left-1/2 origin-bottom top-4"
                     :style="`transform:rotate(${minutes*6}deg) translateX(-25%)`"></div>
                <div class="z-10 h-16 w-[1px] bg-black absolute left-1/2 origin-bottom top-4"
                     :style="`transform:rotate(${seconds*6}deg) translateX(-25%)`"></div>
            </div>
            <div class="digital m-auto text-4xl font-semibold font-mono text-themeText">
                <span class="dui-countdown">
                    <span :style="{'--value': hours}"></span>
                </span>:<span class="dui-countdown">
                    <span :style="{'--value': minutes}"></span>
                </span>:<span class="dui-countdown">
                    <span :style="{'--value': seconds}"></span>
                </span>
                <span class="dui-countdown am"></span>
            </div>
        </div>
        <EditingContextMenu @delete="$emit('delete')" :settings="true">
            <shadow-root :adopted-style-sheets="defaultSheets">
                <div class="flex items-center p-1">
                    <span>24-Hour Mode:</span>
                    <input type="checkbox" class="ml-2 dui-checkbox border-solid border-gray-500 dui-checkbox-sm" v-model="is24Hour"/>
                </div>
            </shadow-root>
        </EditingContextMenu>
    </div>
</template>

<script setup>
import EditingContextMenu from "~/components/EditingContextMenu.vue";
import {defaultSheets, useExtensionStorage} from "~/utils/componentUtils";
import {useDateFormat, useNow, useToNumber} from "@vueuse/core";

const is24Hour = useExtensionStorage("clock.24", false);

const now = useNow({interval: 200});
const hours = useToNumber(useDateFormat(now, is24Hour.value ? "HH" : "hh"));
const minutes = useDateFormat(now, "mm");
const seconds = useDateFormat(now, "ss");
defineProps({
    editMode: Boolean
})
</script>

<style scoped>
.clockface {
    @apply rounded-full bg-gray-200 h-40 w-40 relative
}
.clockface::before {
    @apply rounded-full bg-gray-200 h-36 w-36 absolute content-[''] inline-block z-10 m-2
}
.clockface::after {
    @apply rounded-full bg-black h-2 w-2 absolute content-[''] inline-block z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2;
}
.line {
    @apply bg-black h-40 absolute w-0.5 left-1/2
}
</style>