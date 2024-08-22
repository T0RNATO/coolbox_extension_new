<script setup lang="ts">
import {ref, type Ref} from "vue";
import PopupBase from "~/components/popups/PopupBase.vue";
import {apiGet, apiSend, cookieFetched} from "~/utils/apiUtils.ts";
import type {TodoListType} from "~/entries/pages/todo/types.js";
import TodoList from "~/entries/pages/todo/TodoList.shadow.vue";

document.title = "Coolbox Todo";

defineProps<{
    subjects: {name: string, pretty: string}[];
}>();

cookieFetched.then(() => {
    apiGet("todos", (data: TodoListType[]) => {
        todoLists.value = data;
        loaded.value = true;
    })
})

const todoLists: Ref<TodoListType[]> = ref([]);
const loaded: Ref<boolean> = ref(false);

const confirmation_popup = ref();
const confirmation_button = ref();

let confirm: Function;

function confirmDeletion(f: () => void) {
    confirmation_popup.value.openPopup();
    confirmation_button.value.focus();
    confirm = f;
}

function newList() {
    apiSend("POST", "todos", {title: "New To-Do List"}, "", "Failed to create list", (data: TodoListType) => {
        todoLists.value.push(data);
    })
}

function deleteList(list: TodoListType) {
    confirmDeletion(() => {
        apiSend("DELETE", "todos", {id: list.id}, "", "Failed to delete list", () => {
            // todo: should probably refactor to use `list.order` when thats added
            todoLists.value.splice(todoLists.value.indexOf(list), 1);
        })
    })
}
</script>

<template>
    <teleport to="body">
        <PopupBase title="Confirm Deletion?" ref="confirmation_popup" no-pad>
            <template #buttons>
                <div class="mt-4">
                    <button class="button-l">No</button>
                    <button class="button-r submit" @click="confirm" ref="confirmation_button">Yes</button>
                </div>
            </template>
        </PopupBase>
    </teleport>
    <h2 class="subheader">To-do Lists</h2>
    <div class="todo-list-container" v-if="loaded">
        <TodoList v-for="list in todoLists"
                  :list="list"
                  @delete="deleteList"
        />
        <div class="new-list" @click="newList">
            <div class="text-center">
                <span class="cb-icon">add</span>
                <br>
                <span>New List</span>
            </div>
        </div>
    </div>
    <div v-else>
        <div class="dui-loading dui-loading-spinner"></div>
        <h2 class="inline mx-4">Loading</h2>
    </div>
</template>

<style scoped>
.new-list {
    height: calc(50vh + 1rem);
    @apply min-w-[7vw] justify-center bg-accent/60 text-themeText p-2 rounded-md flex
    items-center hover:bg-accent transition-colors cursor-pointer;
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