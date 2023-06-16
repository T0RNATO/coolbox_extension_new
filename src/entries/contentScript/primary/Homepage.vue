<template>
    <div class="grid grid-cols-[65%,35%]" @click="clearSelectedComponent">
        <!-- Left Column -->
        <div class="px-4 relative">
            <div class="absolute right-6 -top-2">
                <div class="dui-tooltip bg-transparent" data-tip="Customise Homepage">
                    <button class="cb-icon-button cb-icon" @click="editMode = !editMode">edit</button>
                </div>
            </div>
            <GreetingText @click="selectComponent"/>
            <hr>
            <Timetable @click="selectComponent"/>
            <TimeLeft @click="selectComponent"/>
            <hr>
            <Tiles @click="selectComponent"/>
            <CoolBoxMessage @click="selectComponent"/>
        </div>
        <!-- Right Column -->
        <div class="px-4">
            <UpcomingDueWork @click="selectComponent"/>
            <NewsItems @click="selectComponent"/>
        </div>
    </div>
    <Popup title="Ohio" />

    <!-- Page Editing Context Menu -->
    <div class="dui-card dui-card-compact absolute shadow-xl bg-white p-0" :style="contextMenuStyles">
        <div class="dui-tooltip bg-transparent [position:unset] p-0" data-tip="Customise Widget">
            <button class="cb-icon-button cb-icon">settings</button>
        </div>

        <div class="dui-tooltip bg-transparent [position:unset] p-0" data-tip="Delete Widget">
            <button class="cb-icon-button cb-icon">delete</button>
        </div>
    </div>

    <!-- Page Editing Toast -->
    <div class="dui-toast" v-if="editMode">
        <div class="dui-alert bg-gray-400 p-2">
            <span class="cb-icon">edit</span>

            <span>You are in edit mode!<br>Click a widget to select it and edit it.</span>

            <button class="dui-btn bg-gray-300">
                <span class="cb-icon">add</span>
                Add Widgets
            </button>

            <button class="dui-btn bg-gray-300" @click="editMode = false">
                <span class="cb-icon">close</span>
                Exit
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
import {ref} from "vue";

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
        contextMenuStyles.value["top"] = boundingRect.top + "px";
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
    @apply bg-transparent border-0 text-2xl text-gray-800 hover:bg-gray-200 hover:text-gray-600 aspect-square rounded-md leading-6 m-0;
}
/* The selector is applied dynamically */
/*noinspection CssUnusedSymbol*/
.selected {
    @apply outline-blue-500 outline-2 outline outline-offset-2 rounded-sm;
}
</style>