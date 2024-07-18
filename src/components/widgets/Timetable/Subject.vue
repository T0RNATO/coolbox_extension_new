<script setup lang="ts">
import {apiResponded, roomChanges} from "~/utils/apiUtils";
import {useExtensionStorage} from "~/utils/componentUtils";
import {type RoomChange} from "~/utils/types";
import {ref, type Ref} from "vue";

const darkenSubjects = useExtensionStorage("timetable.dark", false);
const outlineCurrent = useExtensionStorage("timetable.outline", false);

type PrettySub = {
    name: string,
    pretty: string
}

const props = defineProps<{
    subject: HTMLElement,
    pretty: PrettySub[],
    period: number,
    small_text: boolean
}>();

const subjectID = props.subject.children[1]?.textContent.slice(1,-1)?.toLowerCase();

const roomChange: Ref<RoomChange | undefined> = ref(undefined);

apiResponded.then(() => {
    roomChange.value = roomChanges.value?.find(
        change => change.timetabled_room === props.subject.children[2]?.textContent &&
            change.class_name.toLowerCase() === subjectID
    );
})
</script>

<template>
    <div :style="{backgroundColor: subject['style'].getPropertyValue('background-color')}"
         :class="{
            darken: darkenSubjects,
            small: small_text,
            outline: outlineCurrent && subject.parentElement.classList.contains('timetable-subject-active')
        }"
         class="cb-subject">
        <div v-if="subject.tagName === 'DIV'">
            <!--The title of the subject-->
            <a :href="(subject.firstElementChild as HTMLAnchorElement)?.href" class="cb-link">
                {{
                    pretty?.find(
                        s => s.name?.toLowerCase() === subjectID
                    )?.pretty || subject.firstElementChild?.textContent
                }}
            </a>
            <br>
            <!--The id of the subject-->
            <span>{{subject.children[1]?.textContent}}</span><br>
            <!--The room of the subject-->
            <div>
                <!--The normal room, struck through if a roomchange exists-->
                <span :class="{strike: roomChange}">{{subject.children[2]?.textContent}}</span>
                <!--The room change, if applicable-->
                <div class="dui-tooltip ml-1" data-tip='Room Change' v-if="roomChange">
                    <span class="font-semibold">
                        → {{roomChange['assigned_room']}}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.cb-subject a {
    color: #085ba5;
}
.cb-subject {
    @apply p-4 lg:w-1/5 lg:h-auto text-sm sm:w-full sm:h-1/5 lg:first:rounded-bl-lg lg:last:rounded-br-lg sm:max-lg:first:rounded-tr-lg sm:last:rounded-br-lg;
}
.small {
    font-size: 10px;
    line-height: 12px;
    @apply p-3;
}
.cb-subject.darken {
    filter: brightness(0.8);
}
.cb-subject.outline {
    outline: 2px solid #355983;
    outline-offset: -2px;
    position: relative;
}
.cb-subject.outline::after {
    border-top: 10px solid #355983;
    border-right: 10px solid #355983;
    border-bottom: 10px solid transparent;
    border-left: 10px solid transparent;
    height: 20px;
    aspect-ratio: 1/1;
    position: absolute;
    top: 0;
    right: 0;
    content: "";
}
.strike {
    @apply line-through text-red-500;
}
</style>