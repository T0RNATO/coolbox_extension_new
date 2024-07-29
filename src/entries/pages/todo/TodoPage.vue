<script setup lang="ts">
import {ref, Ref} from "vue";
import Shadow from "~/components/other/Shadow.vue";

document.title = "Coolbox Todo";

const todoLists: Ref<TodoList[]> = ref([
    {
        title: "stuff 2 do 2day",
        items: [
            {title: "my todo item!"},
        ]
    },
    {
        title: "stuff 2 do later",
        items: [
            {title: "my todo item!"},
        ]
    },
]);

type TodoList = {
    items: TodoItem[]
    title: string
}
type TodoItem = {
    title: string
}
</script>

<template>
    <h2 class="subheader">To-do Lists</h2>
    <div class="todo-list-container">
        <div class="todo-list" v-for="list in todoLists">
            <div class="flex justify-between">
                <!--Avoid annoying default input styling-->
                <Shadow>
                    <input class="bg-transparent border-none text-themeText underline underline-offset-4 mb-2 font-sans
                                  font-semibold text-xl focus:bg-accent outline-none rounded-md focus:pl-2 w-[90%]"
                           :value="list.title"/>
                </Shadow>
                <span class="material-symbols-outlined text-themeText hover:text-red-500 cb-button text-lg">delete</span>
            </div>
            <div class="todo-item" v-for="item in list.items">
                <div>
                    {{item.title}}
                </div>
                <div class="buttons">
                    <span class="material-symbols-outlined hover:text-themeText/40">edit</span>
                    <span class="material-symbols-outlined hover:text-red-500">delete</span>
                    <span class="material-symbols-outlined hover:text-green-400">check</span>
                </div>
            </div>
            <div class="new-item" @click="list.items.push({title: ''})">
                <span class="material-symbols-outlined">add</span>
                <span>New Item</span>
            </div>
        </div>
        <div class="new-item new-list" @click="todoLists.push({title:'My todo list', items:[]})">
            <div class="text-center">
                <span class="material-symbols-outlined">add</span>
                <br>
                <span>New List</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.cb-button {
    @apply cursor-pointer transition-colors;
}
.new-list {
    @apply h-[50vh] min-w-[7vw] justify-center;
}
.new-item {
    @apply bg-accent/60 text-themeText p-2 rounded-md flex
    items-center hover:bg-accent transition-colors cursor-pointer;
}
.buttons {
    @apply inline-flex h-full items-center my-auto gap-x-2;
    span {
        @apply text-xl cursor-pointer select-none;
        transition: color 100ms;
    }
}
.todo-item {
    @apply bg-accent p-2 text-themeText rounded-md flex justify-between mb-2;
}
.todo-list {
    @apply min-w-[20vw] max-w-[20vw] bg-primary h-[50vh] rounded-md p-2 overflow-y-auto;
    &::-webkit-scrollbar {
        display: none;
    }
}
.todo-list-container {
    @apply overflow-x-auto flex gap-2 py-2;
    &::-webkit-scrollbar {
        @apply bg-primary rounded-md;
    }
    &::-webkit-scrollbar-thumb {
        @apply bg-accent rounded-md;
    }
}
</style>