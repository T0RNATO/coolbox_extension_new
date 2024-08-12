<script setup lang="ts">
import {Directive, ref, Ref} from "vue";
import Shadow from "~/components/other/Shadow.vue";
import PopupBase from "~/components/popups/PopupBase.vue";
import {apiGet, apiSend, cookieFetched} from "~/utils/apiUtils.ts";

document.title = "Coolbox Todo";

defineProps<{
    subjects: {name: string, pretty: string}[];
}>();

cookieFetched.then(() => {
    apiGet("todos", (data: TodoList[]) => {
        todoLists.value = data;
    })
})

const todoLists: Ref<TodoList[]> = ref([]);

const colours: Colour[] = ["green", "red", "blue", "yellow", "purple", "pink", "orange", "cyan"];
type Colour = "green" | "red" | "blue" | "yellow" | "purple" | "pink" | "orange" | "cyan";

type TodoList = {
    items: TodoItem[],
    title: string,
    id: number,
}
type TodoItem = {
    content: string,
    completed: boolean,
    colour?: Colour,
}

const confirmation_popup = ref();
const confirmation_button = ref();

let confirm: Function;

function confirmDeletion(f: () => void) {
    confirmation_popup.value.openPopup();
    confirmation_button.value.focus();
    confirm = f;
}

let focusNewItem = false;

function newItem(list: TodoList) {
    list.items.push({content: "", completed: false});
    focusNewItem = true;
}

function newList() {
    apiSend("POST", "todos", {title: "New To-Do List"}, "", "Failed to create list", (data: TodoList) => {
        todoLists.value.push(data);
    })
}

function updateList(list: TodoList) {
    apiSend("PUT", "todos", list, "", "Failed to save list");
}

function deleteList(list: TodoList) {
    confirmDeletion(() => {
        apiSend("DELETE", "todos", {id: list.id}, "", "Failed to delete list", () => {
            // todo: should probably refactor to use `list.order` when thats added
            todoLists.value.splice(todoLists.value.indexOf(list), 1);
        })
    })
}

function completeItem(item: TodoItem, list: TodoList) {
    item.completed = !item.completed;
    updateList(list);
}

function colourItem(item: TodoItem, colour: Colour, list: TodoList) {
    item.colour = colour;
    updateList(list)
}

function deleteItem(item: TodoItem, list: TodoList) {
    list.items.splice(list.items.indexOf(item), 1);
    updateList(list);
}

function saveListTitle(list: TodoList, evt: FocusEvent) {
    const value = (evt.composedPath()[0] as HTMLInputElement).value;
    apiSend("PATCH", "todos", {id: list.id, title: value}, "", "Failed to rename list", () => {
        list.title = value;
    });
}

const vFocus: Directive<HTMLDivElement> = {
    mounted(el) {
        if (focusNewItem) {
            el.focus();
            focusNewItem = false;
        }
    }
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
    <Shadow>
    <div class="todo-list-container">
        <div class="todo-list" v-for="list in todoLists">
            <div class="flex justify-between">
                <input class="editable-name title" :value="list.title" @focusout.stop="saveListTitle(list, $event)"/>
                <span class="cb-icon text-themeText hover:text-red-500 cb-button text-lg"
                      @click="deleteList(list)"
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
        <div class="new-item new-list" @click="newList">
            <div class="text-center">
                <span class="cb-icon">add</span>
                <br>
                <span>New List</span>
            </div>
        </div>
    </div>
    </Shadow>
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