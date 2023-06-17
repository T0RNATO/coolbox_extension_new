<template>
    <!-- Edit Mode -->
    <div class="grid-layout" @click="clearSelectedComponent" v-if="editMode">
        <!-- Left Column-->
        <Container group-name="homepage" data-col="leftCol"
                   @drop="(ev) => dropComponent('leftCol', ev)"
                   :get-child-payload="(ev) => getPayload('leftCol', ev)">
            <Draggable v-for="[i, el] in Object.entries(pageLayout['leftCol'])" @click="selectComponent" :data-i="i">
                <component :is="el" :key="i" :editMode="true"/>
            </Draggable>
        </Container>
        <!-- Right Column -->
        <Container group-name="homepage" data-col="rightCol"
                   @drop="(ev) => dropComponent('rightCol', ev)"
                   :get-child-payload="(ev) => getPayload('rightCol', ev)">
            <Draggable v-for="[i, el] in Object.entries(pageLayout['rightCol'])" @click="selectComponent" :data-i="i">
                <component :is="el" :key="i" :editMode="true"/>
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
            <component v-for="[i, el] in Object.entries(pageLayout['leftCol'])" :is="el" :key="i" @click="selectComponent" class="slide-in"/>
        </div>
        <!-- Right Column -->
        <div>
            <component v-for="[i, el] in Object.entries(pageLayout['rightCol'])" :is="el" :key="i" @click="selectComponent" class="slide-in"/>
        </div>
    </div>

    <Popup title="Ohio" />

    <!-- Page Editing Context Menu -->
    <div class="dui-card dui-card-compact absolute shadow-xl bg-white p-0" :style="contextMenuStyles">
        <div class="dui-tooltip bg-transparent [position:unset] p-0" data-tip="Customise Widget">
            <button class="cb-icon-button material-symbols-outlined">settings</button>
        </div>

        <div class="dui-tooltip bg-transparent [position:unset] p-0" data-tip="Delete Widget" @click="deleteSelectedWidget">
            <button class="cb-icon-button material-symbols-outlined">delete</button>
        </div>
    </div>

    <!-- Page Editing Toast -->
    <div class="dui-toast" v-if="editMode">
        <div class="dui-alert p-2 shadow-2xl shadow-black">
            <span class="material-symbols-outlined">edit</span>

            <span>You are in edit mode! Click a widget to<br>select it and edit it, or drag them around.</span>

            <button class="dui-btn bg-gray-300">
                <span class="material-symbols-outlined">add</span>
                Add Widgets
            </button>

            <button class="dui-btn dui-btn-primary" @click="() => {
                editMode = false; clearSelectedComponent();
            }">
                <span class="material-symbols-outlined">done</span>
                Done
            </button>
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
import Popup from "~/components/Popup.vue";
import {markRaw, ref} from "vue";

import { Container, Draggable } from "vue3-smooth-dnd";

const pageLayout = ref({
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

function dropComponent(column, dropInfo) {
    // If there was an element removed, delete it from the page.
    if (dropInfo["removedIndex"] !== null) {
        pageLayout.value[column].splice(dropInfo["removedIndex"], 1);
    }
    // If there was an element added, add it to the page.
    if (dropInfo["addedIndex"] !== null) {
        pageLayout.value[column].splice(dropInfo["addedIndex"], 0, dropInfo["payload"]);
    }
}

function deleteSelectedWidget() {
    const column = selectedElement.parentElement.dataset.col;
    const i = Number(selectedElement.dataset.i);

    pageLayout.value[column].splice(i, 1);
    clearSelectedComponent();
}

function getPayload(col, index) {
    return pageLayout.value[col][index];
}

const contextMenuStyles = ref({
    left: "0px",
    top: "0px",
    display: "none"
})

let selectedElement;
let editMode = ref(false);

function selectComponent(event) {
    if (editMode.value) {
        event.preventDefault();
        event.stopPropagation();

        const component = event.currentTarget;

        selectedElement?.classList.remove("selected");
        selectedElement = component;

        component.classList.add("selected");
        const boundingRect = component.getClientRects()[0];

        contextMenuStyles.value["left"] = boundingRect.right - 80 + "px";
        contextMenuStyles.value["top"] = boundingRect.top + window.scrollY + "px";
        contextMenuStyles.value["display"] = "block";
    }
}

function clearSelectedComponent() {
    selectedElement?.classList.remove("selected");
    selectedElement = null;
    contextMenuStyles.value["display"] = "none";
}
</script>

<style>
.cb-icon-button {
    @apply bg-transparent border-0 text-2xl text-gray-800 hover:bg-gray-200 hover:text-gray-600 aspect-square rounded-md leading-6 m-0 z-[1];
}
/* The selector is applied dynamically */
/*noinspection CssUnusedSymbol*/
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
</style>