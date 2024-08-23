<script setup lang="ts">
import type {Colour, TodoItem, TodoListType} from "~/entries/pages/todo/types.js";
import {apiSend} from "~/utils/apiUtils.js";
import {Directive} from "vue";
import Shadow from "~/components/other/Shadow.vue";

const colours: Colour[] = ["green", "red", "blue", "yellow", "purple", "pink", "orange", "cyan"];

function updateList(list: TodoListType) {
    for (const item of list.items) {
        if (!item.content) {
            list.items.splice(list.items.indexOf(item), 1);
            return;
        }
    }
    apiSend("PUT", "todos", list, "", "Failed to save list");
}

function completeItem(item: TodoItem, list: TodoListType) {
    item.completed = !item.completed;
    updateList(list);
}

function colourItem(item: TodoItem, colour: Colour, list: TodoListType) {
    item.colour = colour;
    updateList(list)
}

function deleteItem(item: TodoItem, list: TodoListType) {
    list.items.splice(list.items.indexOf(item), 1);
    updateList(list);
}

function saveListTitle(list: TodoListType, el: HTMLInputElement) {
    const value = el.value;
    apiSend("PATCH", "todos", {id: list.id, title: value}, "", "Failed to rename list", () => {
        list.title = value;
    });
}

let focusNewItem = false;

function newItem(list: TodoListType) {
    list.items.push({content: "", completed: false});
    focusNewItem = true;
}

const vFocus: Directive<HTMLDivElement> = {
    mounted(el) {
        if (focusNewItem) {
            el.focus();
            focusNewItem = false;
        }
    }
}

defineProps<{
    list: TodoListType
    widget?: boolean
}>();

defineEmits(["delete"]);
</script>

<template>
    <Shadow>
        <div class="todo-list" :class="{widget, scrolling: list.items.length >= 9}">
            <div class="flex justify-between">
                <input class="editable-name title"
                       :value="list.title"
                       @focusout.stop="saveListTitle(list, $event.target)"
                       @keydown.enter="$event.target.blur()"
                />
                <span class="cb-icon text-themeText hover:text-red-500 cb-button text-lg"
                      @click="$emit('delete', list)"
                      v-if="!widget"
                >delete</span>
            </div>
            <div class="todo-item" :class="[item.colour ?? '']" v-for="item in list.items">
                <input class="editable-name"
                       :class="{strike: item.completed}"
                       v-model="item.content"
                       v-focus
                       @keydown.enter="$event.target.blur()"
                       @focusout.stop="updateList(list)"
                />
                <div class="buttons">
                    <span class="cb-icon hover:text-green-400">style</span>
                    <div class="style-picker">
                        <div @click="completeItem(item, list)">
                            <span class="cb-icon">format_strikethrough</span>
                        </div>
                        <div :class="colour" v-for="colour of colours" @click="colourItem(item, colour, list)"></div>
                    </div>
                    <span class="cb-icon hover:text-red-500"
                          @click="deleteItem(item, list)"
                    >delete</span>
                </div>
            </div>
            <div class="new-item" @click="newItem(list)">
                <span class="cb-icon">add</span>
                <span>New Item</span>
            </div>
        </div>
    </Shadow>
</template>

<!--suppress CssUnusedSymbol -->
<style scoped>
.cb-button {
    @apply cursor-pointer transition-colors;
}
.new-item {
    @apply bg-accent/60 text-themeText p-2 rounded-md flex
    items-center hover:bg-accent transition-colors cursor-pointer;
}
.buttons {
    @apply inline-flex h-full items-center my-auto gap-x-2 relative;
    span {
        @apply text-xl cursor-pointer select-none;
        transition: color 100ms;
    }
}
.todo-item {
    @apply bg-accent p-2 text-themeText rounded-md flex justify-between mb-2;
}
.strike {
    @apply line-through;
}
.green  { @apply bg-faded-green; }
.red    { @apply bg-faded-red; }
.blue   { @apply bg-faded-blue; }
.yellow { @apply bg-faded-yellow; }
.purple { @apply bg-faded-purple; }
.pink   { @apply bg-faded-pink; }
.orange { @apply bg-faded-orange; }
.cyan   { @apply bg-faded-cyan; }
.todo-list {
    @apply min-w-[20vw] bg-primary rounded-md p-2;
    &.widget {
        width: calc(100% - 1rem);
        max-height: 60vh;
        @apply rounded-b-none;
    }
    &.scrolling {
        overflow-y: auto;
    }
    &:not(.widget) {
        @apply max-w-[20vw] h-[50vh];
    }
    &::-webkit-scrollbar {
        display: none;
    }
}
.editable-name {
    @apply bg-transparent border-none text-themeText font-sans
    outline-none rounded-md focus:pl-2 w-[90%] focus:bg-primary/30;
    &.title {
        @apply font-semibold underline underline-offset-4 text-xl mb-2 focus:bg-accent
    }
}
.style-picker {
    @apply absolute rounded-3xl bg-accent border-primary/40 border-2 z-20
    border-solid w-6 p-0.5 hidden items-center flex-col gap-1 top-0 -left-1;
    > div {
        cursor: pointer;
        @apply rounded-3xl size-5;
        &:hover {
            @apply outline-primary/60 outline-2 outline;
        }
    }
    :hover + &, &:hover {
        display: flex;
    }
}
</style>