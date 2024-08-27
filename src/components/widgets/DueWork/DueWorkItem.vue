<script setup lang="ts">
const props = defineProps<{
    workItem: Element;
    hiddenIds: number[];
    pretty: {pretty: string, name: string}[];
}>();

defineEmits(['hide', 'show']);

const id = Number((props.workItem.querySelector('h3 a') as HTMLAnchorElement)?.href.split('/').slice(-2, -1)[0]);

const subjectName = props.workItem.children[1].firstElementChild?.textContent;
const subjectCode = subjectName?.split("(")[1]?.slice(0, -1)?.toLowerCase();
const prettyName = props.pretty?.find(subject => subject.name.toLowerCase() === subjectCode)?.pretty || subjectName
</script>

<template>
    <div class="w-full p-2" :class="{hiderem: hiddenIds.includes(id)}">
        <!-- item name -->
        <h3 v-html="workItem.firstElementChild.innerHTML" class="m-0"></h3>
        <!-- subject -->
        <p class="meta inline">
            <a :href="(workItem.children[1].firstElementChild as HTMLAnchorElement)?.href">
                {{prettyName}}
            </a>
            {{subjectName}}
        </p>
        <!-- Time left -->
        <p class="meta" v-html="workItem.lastElementChild.innerHTML"></p>

        <div class="reminder-buttons">
            <span class="cb-icon show-more h-[80px]">more_horiz</span>
            <div class="hover-menu">
                <span class="cb-icon" @click="$emit('show', id)" v-if="hiddenIds.includes(id)">visibility</span>
                <template v-else>
                    <span class="cb-icon" @click="$emit('hide', id)">visibility_off</span>
                    <span class="cb-icon">notification_add</span>
                    <span class="cb-icon">edit_note</span>
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped>
.reminder-buttons {
    top: 5px;
    width: 20px;
    right: 7px;
    @apply absolute aspect-square cursor-pointer text-gray-500 text-xl;
}
.hover-menu {
    @apply flex-col gap-y-1;
    &:not(:hover) {
        animation: persist 500ms forwards;
    }

    .cb-icon {
        @apply transition-colors;
        &:hover {
            @apply text-gray-400;
        }
    }
}
.show-more:not(:is(:hover, :has(+.hover-menu:hover))) {
    animation: persist-hidden 500ms forwards;
}
.hover-menu, .show-more:where(:hover, :has(+.hover-menu:hover)) {
    display: none;
}
.show-more:hover + .hover-menu, .hover-menu:hover {
    display: flex;
}

@keyframes persist {
    from { display: flex; }
    to { display: none; }
}
@keyframes persist-hidden {
    from { display: none; }
    99.9% { display: none; }
    to { display: block; }
}

.hiderem {
    @apply max-h-3 !bg-accent transition-[max-height] overflow-hidden;

    .show-more {
        display: none;
    }
    .hover-menu {
        animation: none;
    }

    > h3 {
        @apply mt-5 transition-[margin];
    }
    &:hover {
        @apply max-h-24 pt-2;
        > h3 {
            @apply mt-0;
        }
        .hover-menu {
            display: flex;
            .cb-icon {
                @apply text-green-400;
            }
        }
    }
}
</style>