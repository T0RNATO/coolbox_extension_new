<template>
    <!-- Edit Mode -->
    <div class="grid-layout" @click="clearSelectedComponent" v-if="editMode">
        <!-- Left Column-->
        <Container v-for="[column, components] in Object.entries(currentPageLayout)"
                   group-name="homepage"
                   :data-col="column"
                   @drop="(ev) => dropComponent(column, ev)"
                   :get-child-payload="(ev) => getPayload(column, ev)">
            <Draggable v-for="[i, el] in Object.entries(components)"
                       @click="selectComponent"
                       :data-i="i" :key="'d' + i">
                <component :is="el" :key="i" :editMode="true" @delete="deleteSelectedWidget"/>
            </Draggable>
        </Container>
    </div>
    <!-- Normal Mode -->
    <div class="grid-layout relative" v-else>
        <div class="absolute right-0 -top-2">
            <div class="dui-tooltip bg-transparent z-[1003] before:-translate-x-32" data-tip="Customise Homepage">
                <button class="cb-icon-button material-symbols-outlined" @click="editMode = !editMode">edit</button>
            </div>
        </div>
        <!-- Left Column-->
        <div>
            <component v-for="[i, el] in Object.entries(currentPageLayout['leftCol'])" :is="el" :key="i" @click="selectComponent" class="slide-in px-2"/>
        </div>
        <!-- Right Column -->
        <div>
            <component v-for="[i, el] in Object.entries(currentPageLayout['rightCol'])" :is="el" :key="i" @click="selectComponent" class="slide-in px-2"/>
        </div>
    </div>

    <Popup title="Ohio" />

    <!-- Page Editing Toast -->
    <div class="dui-toast" v-if="editMode">
        <div class="dui-alert p-2 shadow-2xl shadow-black">
            <span class="material-symbols-outlined">edit</span>

            <span>You are in edit mode! Click a widget to<br>select it and edit it, or drag them around.</span>

            <button class="dui-btn bg-gray-300" @click="drawerOpen = !drawerOpen">
                <span class="material-symbols-outlined">add</span>Add Widgets
            </button>

            <button class="dui-btn dui-btn-primary" @click="() => {
                editMode = false; clearSelectedComponent();
            }">
                <span class="material-symbols-outlined">done</span>Done
            </button>
        </div>
    </div>

    <!-- Widget Add Sidebar -->
    <div :class="{'widget-sidebar': true, 'drawerOpen': drawerOpen}" v-if="editMode">
        <h1>Add Widgets</h1>
        <Container group-name="homepage" behaviour="copy" @drag-start="drawerOpen = false" :get-child-payload="(ev) => allWidgets[ev]">
            <Draggable v-for="[i, el] in Object.entries(allWidgets)" :key="'d' + i">
                <component :is="el" :key="i" :editMode="true"/>
            </Draggable>
        </Container>
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
import Popup from "~/components/Popup.vue";
import {markRaw, ref} from "vue";

import { Container, Draggable } from "vue3-smooth-dnd";
import AnalogClock from "~/components/AnalogClock.vue";
import WeatherWidget from "~/components/WeatherWidget.vue";

const currentPageLayout = ref({
    leftCol: [
        markRaw(GreetingText),
        markRaw(Timetable),
        markRaw(TimeLeft),
        markRaw(Tiles),
        markRaw(CoolBoxMessage),
    ],
    rightCol: [
        markRaw(UpcomingDueWork),
        markRaw(NewsItems),
    ]
})

const allWidgets = [
    markRaw(GreetingText),
    markRaw(Timetable),
    markRaw(TimeLeft),
    markRaw(Tiles),
    markRaw(CoolBoxMessage),
    markRaw(UpcomingDueWork),
    markRaw(NewsItems),
    markRaw(AnalogClock),
    markRaw(WeatherWidget),
]

const drawerOpen = ref(false);

function dropComponent(column, dropInfo) {
    // If there was an element removed, delete it from the page.
    if (dropInfo["removedIndex"] !== null) {
        currentPageLayout.value[column].splice(dropInfo["removedIndex"], 1);
    }
    // If there was an element added, add it to the page.
    if (dropInfo["addedIndex"] !== null) {
        currentPageLayout.value[column].splice(dropInfo["addedIndex"], 0, dropInfo["payload"]);
    }
}

function deleteSelectedWidget() {
    const column = selectedElement.parentElement.dataset.col;
    const i = selectedElement.dataset.i;

    currentPageLayout.value[column].splice(i, 1);
    clearSelectedComponent();
}

function getPayload(col, index) {
    return currentPageLayout.value[col][index];
}

let selectedElement;
let editMode = ref(false);

function selectComponent(event) {
    if (editMode.value) {
        if (!event.target.matches(".widget-settings *")) {
            event.preventDefault();
            event.stopPropagation();

            const component = event.currentTarget;

            selectedElement?.classList.remove("selected");
            selectedElement = component;

            component.classList.add("selected");
        } else {
            event.stopPropagation();
        }
    }
}

function clearSelectedComponent() {
    selectedElement?.classList.remove("selected");
    selectedElement = null;
    drawerOpen.value = false;
}
</script>

<!--suppress CssUnusedSymbol -->
<style>
.cb-icon-button {
    @apply bg-transparent border-0 text-2xl text-gray-800 hover:bg-gray-200 hover:text-gray-600 aspect-square rounded-md leading-6 m-0 z-[1];
}
.selected {
    @apply outline-blue-500 outline-2 outline outline-offset-2 rounded-sm;
}

.grid-layout {
    @apply grid grid-cols-[65%,35%] gap-2;
}

.smooth-dnd-draggable-wrapper {
    @apply bg-white drop-shadow rounded-md mb-2 p-2 cursor-move animate-[slide-down_400ms_ease-out];
}

.slide-in {
    @apply animate-[slide-up_200ms_ease-out];
}

.mt {
    @apply mt-3
}

@keyframes slide-down {
    from {
        transform: translateY(-20%);
    }
    to {
        transform: translateY(0%);
    }
}

@keyframes slide-up {
    from {
        transform: translateY(20%);
    }
    to {
        transform: translateY(0%);
    }
}

@keyframes slide-x {
    from {
        transform: translateX(-100%);
    }
    to {
        transform: translateX(0);
    }
}

.widget-sidebar {
    @apply absolute h-full w-96 bg-gray-200 left-0 top-0 shadow-2xl z-[1002] p-6 overflow-y-scroll -translate-x-full;
}
.drawerOpen {
    animation: slide-x 500ms forwards;
}
.drawerClosed {
    animation: slide-x 500ms reverse;
}

.dui-radio {
    @apply !dui-radio;
}
.dui-toggle {
    @apply !dui-toggle;
}
.dui-radio, .dui-toggle {
    @apply !static !opacity-100 border-solid border-gray-500 !m-0
}

.right-off-canvas-menu {
    z-index: 1004;
}
</style>