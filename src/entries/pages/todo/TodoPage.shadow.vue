<script setup lang="ts">
import {Directive, ref, Ref} from "vue";
import Shadow from "~/components/other/Shadow.vue";
import PopupBase from "~/components/popups/PopupBase.vue";

document.title = "Coolbox Todo";

const todoLists: Ref<TodoList[]> = ref([
    {
        title: "stuff 2 do 2day",
        items: [
            {title: "my todo item!", completed: false, colour: "green"},
            {title: "my todo item!", completed: false, colour: "red"},
            {title: "my todo item!", completed: false, colour: "blue"},
            {title: "my todo item!", completed: false, colour: "yellow"},
            {title: "my todo item!", completed: false, colour: "purple"},
            {title: "my todo item!", completed: false, colour: "pink"},
            {title: "my todo item!", completed: false, colour: "orange"},
            {title: "my todo item!", completed: false, colour: "cyan"},
        ]
    },
    {
        title: "stuff 2 do later",
        items: [
            {title: "my todo item!", completed: false},
        ]
    },
]);

const colours: Colour[] = ["green", "red", "blue", "yellow", "purple", "pink", "orange", "cyan"];
type Colour = "green" | "red" | "blue" | "yellow" | "purple" | "pink" | "orange" | "cyan";

type TodoList = {
    items: TodoItem[]
    title: string
}
type TodoItem = {
    title: string,
    completed: boolean,
    colour?: Colour
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
    list.items.push({completed: false, title: ''});
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
                <input class="editable-name title" v-model="list.title"/>
                <span class="cb-icon text-themeText hover:text-red-500 cb-button text-lg"
                      @click="confirmDeletion(() => {todoLists.splice(todoLists.indexOf(list), 1)})"
                >delete</span>
            </div>
            <div class="todo-item" :class="[item.colour ?? '']" v-for="item in list.items">
                <input class="editable-name" :class="{strike: item.completed}" v-model="item.title" v-focus @keydown.enter="$event.target.blur()"/>
                <div class="buttons">
                    <span class="cb-icon hover:text-green-400"
                          @click="item.completed = true"
                    >style</span>
                    <div class="style-picker">
                        <div @click="item.completed = !item.completed">
                            <span class="cb-icon">format_strikethrough</span>
                        </div>
                        <div :class="colour" v-for="colour of colours" @click="item.colour = colour"></div>
                    </div>
                    <span class="cb-icon hover:text-red-500"
                          @click="list.items.splice(list.items.indexOf(item), 1)"
                    >delete</span>
                </div>
            </div>
            <div class="new-item" @click="newItem(list)">
                <span class="cb-icon">add</span>
                <span>New Item</span>
            </div>
        </div>
        <div class="new-item new-list" @click="todoLists.push({title:'My todo list', items:[]})">
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