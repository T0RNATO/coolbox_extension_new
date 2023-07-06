<template>
    <!-- Edit Mode -->
    <div class="grid-layout" @click="clearSelectedComponent" v-if="editMode">
        <div class="fixed left-0 bottom-0 z-10 bg-white rounded-tr-md p-2">
            <shadow-root :adopted-style-sheets="defaultSheets">
                <span>Theme:</span>
                <div>
                    <div class="dui-tooltip" :data-tip="theme.display" v-for="theme in possibleThemes">
                        <input type="radio" name="theme"
                               class="mx-1 border-solid dui-radio"
                               v-model="themeStore"
                               :value="theme.value"
                               :style="{backgroundColor: theme.hex}"
                        >
                    </div>
                    <div class="dui-tooltip" data-tip="Custom Theme">
                        <input type="radio" name="theme" id="custom_theme" class="hidden mx-1" v-model="themeStore">
                        <label for="custom_theme">
                            <span class="material-symbols-outlined">palette</span>
                        </label>
                    </div>
                </div>
                <!--language=CSS-->
                <shadow-style>
                    input#custom_theme:checked + label > span {
                        border-radius: 50%;
                        outline: 1px solid black;
                    }
                </shadow-style>
            </shadow-root>
        </div>
        <Container v-for="[column, components] in Object.entries(currentPageLayout)"
                   group-name="homepage"
                   :data-col="column"
                   @drop="(ev) => dropComponent(column, ev)"
                   :get-child-payload="(ev) => getPayload(column, ev)">
            <Draggable v-for="[i, el] in Object.entries(components)"
                       @click="selectComponent"
                       :data-i="i" :key="'d' + i">
                <component :is="el" :key="i" :widg-info="{edit: true, col: column, add: false}" @delete="deleteSelectedWidget"/>
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
        <div v-for="[column, components] in Object.entries(currentPageLayout)">
            <component v-for="[i, el] in Object.entries(components)"
                       :is="el" :key="i" class="slide-in px-2"
                       :widg-info="{edit: false, col: column, add: false}"
            />
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
                <component :is="el" :key="i" :widg-info="{edit: true, col: null, add: true}"/>
            </Draggable>
        </Container>
    </div>
</template>

<script setup>
import GreetingText from "~/components/widgets/GreetingText.vue";
import UpcomingDueWork from "~/components/widgets/UpcomingDueWork.vue";
import Tiles from "~/components/widgets/Tiles.vue";
import CoolBoxMessage from "~/components/widgets/CoolBoxMessage.vue";
import Timetable from "~/components/widgets/Timetable.vue";
import TimeLeft from "~/components/widgets/TimeLeft.vue";
import NewsItems from "~/components/widgets/NewsItems.vue";
import Popup from "~/components/Popup.vue";
import {markRaw, ref} from "vue";
import browser from "webextension-polyfill";

import { Container, Draggable } from "vue3-smooth-dnd";
import AnalogClock from "~/components/widgets/AnalogClock.vue";
import WeatherWidget from "~/components/widgets/WeatherWidget.vue";
import {defaultSheets, useExtensionStorage} from "~/utils/utils";
import {ShadowRoot, ShadowStyle} from "vue-shadow-dom";

const possibleThemes = [
    {display: "Light", value: "light", hex: "#ddd"},
    {display: "Dark", value: "dark", hex: "#302f33"},
    {display: "Purple", value: "purple", hex: "#5438b3"},
    {display: "Dark Blue", value: "dark_blue", hex: "#080e3b"}
]
const themeStore = useExtensionStorage("theme", "light");

// Get the homepage layout from storage, and if it exists, restore it (or default)
browser.storage.local.get("homepageLayout").then(layout => {
    if (layout.homepageLayout) {
        currentPageLayout.value = {
            leftCol: layout.homepageLayout.leftCol.map(
                component => allWidgets.find(
                    widget => widget.__name === component
                )
            ),
            rightCol: layout.homepageLayout.rightCol.map(
                component => allWidgets.find(
                    widget => widget.__name === component
                )
            )
        }
    } else {
        currentPageLayout.value = {
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
        }
    }
})

const currentPageLayout = ref({
    leftCol: [],
    rightCol: []
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

function saveLayout() {
    const layout = {
        leftCol: currentPageLayout.value.leftCol.map(el => el.__name),
        rightCol: currentPageLayout.value.rightCol.map(el => el.__name),
    }
    browser.storage.local.set({
        "homepageLayout": layout
    });
}

function dropComponent(column, dropInfo) {
    // If there was an element removed, delete it from the page.
    if (dropInfo["removedIndex"] !== null) {
        currentPageLayout.value[column].splice(dropInfo["removedIndex"], 1);
    }
    // If there was an element added, add it to the page.
    if (dropInfo["addedIndex"] !== null) {
        currentPageLayout.value[column].splice(dropInfo["addedIndex"], 0, dropInfo["payload"]);
    }
    saveLayout();
}

function deleteSelectedWidget() {
    const column = selectedElement.parentElement.dataset.col;
    const i = selectedElement.dataset.i;

    currentPageLayout.value[column].splice(i, 1);
    clearSelectedComponent();
    saveLayout();
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
    @apply grid grid-cols-[65%,35%] gap-2 relative;
}

.smooth-dnd-draggable-wrapper {
    @apply bg-white drop-shadow rounded-md mb-2 p-2 cursor-move animate-[slide-down_400ms_ease-out];
}

.slide-in {
    @apply animate-[slide-up_300ms_ease-out];
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
    @apply absolute h-full w-1/3 bg-gray-200 left-0 top-0 shadow-2xl z-[1002] p-6 overflow-y-scroll -translate-x-full;
}
.drawerOpen {
    animation: slide-x 500ms forwards;
}
.drawerClosed {
    animation: slide-x 500ms reverse;
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