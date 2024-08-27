<script setup lang="ts">
import type {Colour, TodoItem, TodoListType} from "~/entries/pages/todo/types.js";
import {apiSend} from "~/utils/apiUtils.js";
import {Directive} from "vue";
// noinspection TypeScriptCheckImport
import {Container, Draggable} from "vue3-smooth-dnd";

const colours: Colour[] = ["green", "red", "blue", "yellow", "purple", "pink", "orange", "cyan"];

function updateItemsOfList(list: TodoListType) {
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
    updateItemsOfList(list);
}

function colourItem(item: TodoItem, colour: Colour, list: TodoListType) {
    item.colour = colour;
    updateItemsOfList(list)
}

function deleteItem(item: TodoItem, list: TodoListType) {
    list.items.splice(list.items.indexOf(item), 1);
    updateItemsOfList(list);
}

function renameList(list: TodoListType, el: HTMLInputElement) {
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

function dropItem({ removedIndex, addedIndex, payload: item }, list: TodoListType) {
    if (removedIndex !== null) {
        list.items.splice(removedIndex, 1);
    }
    if (addedIndex !== null) {
        list.items.splice(addedIndex, 0, item);
    }
    if (!(removedIndex === null && addedIndex === null)) {
        updateItemsOfList(list);
    }
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

defineEmits(["delete", "left", "right"]);
</script>

<template>
    <div class="todo-list" :class="{widget, scrolling: list.items.length >= 9}">
        <div class="flex justify-between">
            <input class="editable-name title"
                   :value="list.title"
                   @focusout.stop="renameList(list, $event.target)"
                   @keydown.enter="$event.target.blur()"
            />
            <div v-if="!widget" class="text-themeText text-lg">
<!--                <span class="cb-icon cb-button" @click="$emit('left')">chevron_left</span>-->
<!--                <span class="cb-icon cb-button" @click="$emit('right')">chevron_right</span>-->
                <span class="cb-icon hover:text-red-500 cb-button" @click="$emit('delete')">delete</span>
            </div>
        </div>
        <Container
            group-name="todo-list"
            @drop="result => dropItem(result, list)"
            :get-child-payload="index => list.items[index]"
            :drop-placeholder="{className: 'irrelevant'}"
            drag-handle-selector=".drag-handle"
        >
            <Draggable v-for="item in list.items">
                <div class="todo-item" :class="[item.colour ?? '']">
                    <input class="editable-name"
                           :class="{strike: item.completed}"
                           v-model="item.content"
                           v-focus
                           @keydown.enter="$event.target.blur()"
                           @focusout.stop="updateItemsOfList(list)"
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
                        <span class="cb-icon drag-handle !cursor-move">menu</span>
                    </div>
                </div>
            </Draggable>
        </Container>
        <div class="new-item" @click="newItem(list)">
            <span class="cb-icon">add</span>
            <span>New Item</span>
        </div>
    </div>
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
    @apply inline-flex h-full items-center my-auto gap-x-2 pr-2 relative;
    span {
        @apply text-xl cursor-pointer select-none;
        transition: color 100ms;
    }
}
.todo-item {
    @apply bg-accent text-themeText rounded-md flex justify-between;
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
    @apply min-w-[22vw] bg-primary rounded-md p-2;
    &.widget {
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
    @apply !bg-transparent border-none text-themeText font-sans !m-0 !py-0 !outline-0
    outline-none rounded-md focus:pl-2 w-[80%];
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
.smooth-dnd-draggable-wrapper {
    @apply !m-0 !p-0 !cursor-auto !overflow-visible !mb-2 !filter-none;
}
.smooth-dnd-container {
    @apply !min-h-2;
}
</style>