<script setup lang="ts">
import EditingContextMenu from "~/components/other/EditingContextMenu.vue";
import type {widgInfo} from "~/utils/types.js";
import {cookieFetched, getCachedTodoLists} from "~/utils/apiUtils.js";
import type {TodoListType} from "~/entries/pages/todo/types.js";
import {ref, type Ref} from "vue";
import TodoList from "~/entries/pages/todo/TodoList.shadow.vue"

const todoLists: Ref<TodoListType[]> = ref([]);
const loaded: Ref<boolean> = ref(false);

cookieFetched.then(() => {
    getCachedTodoLists().then((data: TodoListType[]) => {
        todoLists.value = data;
        loaded.value = true;
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

defineProps<{
    widgInfo: widgInfo
}>();
</script>

<template>
<div>
    <div v-if="loaded" class="flex flex-col items-stretch w-full todo-container">
        <Transition mode="in-out">
            <TodoList :list="todoLists[displayedListIndex]" :key="displayedListIndex" :widget="true"/>
        </Transition>
        <div class="w-full flex justify-center pb-2 bg-primary rounded-b-md">
            <span class="cb-icon text-2xl" @click="inc">chevron_left</span>
            <span class="cb-icon text-md"
                  v-for="(_, i) in todoLists"
                  :class="{'icon-fill': i == displayedListIndex}"
                  @click="displayedListIndex = i"
            >circle</span>
            <span class="cb-icon text-2xl" @click="dec">chevron_right</span>
        </div>
    </div>
    <div v-else class="bg-primary p-2 rounded-md">
        <span class="text-themeText">Loading Todo List..</span>
        <br/>
        <div class="dui-loading dui-loading-spinner"/>
    </div>
    <EditingContextMenu @delete="$emit('delete')"/>
</div>
</template>

<!--suppress CssUnusedSymbol -->
<style scoped>
.cb-icon {
    @apply cursor-pointer text-themeText my-auto select-none;
}
.todo-container {
    transition: height 0.3s ease;
}

.v-enter-active, .v-leave-active {
    transition: transform 0.2s ease, opacity 0.6s;
}
.v-enter-from {
    transform: translateX(-100%);
    opacity: 0;
}
.v-enter-to {
    opacity: 1;
}
</style>