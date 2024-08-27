<script setup lang="ts">
import EditingContextMenu from "~/components/other/EditingContextMenu.vue";
import type {widgInfo} from "~/utils/types.js";
import {cookieFetched, getCachedTodoLists} from "~/utils/apiUtils.js";
import type {TodoListType} from "~/entries/pages/todo/types.js";
import {ref, type Ref} from "vue";
import TodoList from "~/entries/pages/todo/TodoList.vue"

const todoLists: Ref<TodoListType[]> = ref([]);
// noinspection TypeScriptValidateTypes
const state: Ref<"loaded" | "loading" | "no_lists"> = ref("loading");

cookieFetched.then(() => {
    getCachedTodoLists().then((data: TodoListType[]) => {
        todoLists.value = data;
        if (data.length === 0) {
            state.value = "no_lists";
            return;
        }
        state.value = "loaded";
    })
})

const displayedListIndex = ref(0);

function dec() {
    if ((displayedListIndex.value -= 1) < 0) {
        displayedListIndex.value += todoLists.value.length;
    }
}
function inc() {
    displayedListIndex.value += 1;
    displayedListIndex.value %= todoLists.value.length;
}

const props = defineProps<{
    widgInfo: widgInfo
}>();

console.log(props.widgInfo);
</script>

<template>
<div>
    <div v-if="state === 'loaded'" class="flex flex-col items-stretch w-full todo-container bg-primary rounded-md">
        <Transition mode="out-in" v-if="widgInfo.col == 'rightCol'">
            <TodoList :list="todoLists[displayedListIndex]" :widget="true" :key="displayedListIndex"/>
        </Transition>
        <Transition mode="out-in" v-else>
            <div :key="displayedListIndex" class="flex">
                <TodoList :list="todoLists[displayedListIndex]" :widget="true" style="width: 100%;"/>
                <TodoList v-if="todoLists.length > 1" :list="todoLists[(displayedListIndex + 1) % todoLists.length]" :widget="true" style="width: 100%;"/>
            </div>
        </Transition>
        <div class="w-full flex justify-center pb-2 bg-primary rounded-b-md">
            <span class="cb-icon text-2xl" @click="dec">chevron_left</span>
            <span class="cb-icon text-md"
                  v-for="(_, i) in todoLists"
                  :class="{'icon-fill':
                      i == displayedListIndex || (widgInfo.col == 'leftCol' && i == (displayedListIndex + 1) % todoLists.length)
                  }"
                  @click="displayedListIndex = i"
            >circle</span>
            <span class="cb-icon text-2xl" @click="inc">chevron_right</span>
        </div>
    </div>
    <div v-else-if="state === 'loading'" class="bg-primary p-2 rounded-md">
        <span class="text-themeText">Loading Todo List..</span>
        <br/>
        <div class="dui-loading dui-loading-spinner"/>
    </div>
    <div v-else-if="state === 'no_lists'" class="bg-primary p-2 rounded-md text-themeText">
        You have no to-do lists. Create one <a href="/coolbox-todo">on the to-do page</a>.
    </div>
    <EditingContextMenu @delete="$emit('delete')"/>
</div>
</template>

<!--suppress CssUnusedSymbol -->
<style scoped>
.cb-icon {
    @apply cursor-pointer text-themeText my-auto select-none;
}

.v-enter-active, .v-leave-active {
    transition: transform 0.2s ease, opacity 0.2s;
}
.v-enter-from {
    transform: translateX(-10%);
    opacity: 0;
}
.v-enter-to {
    opacity: 1;
}
.v-leave-to {
    transform: translateX(10%);
    opacity: 0;
}
</style>