<script setup lang="ts">
import {roomChanges} from "~/utils/apiUtils";
import {useExtensionStorage} from "~/utils/componentUtils";
import {reactive} from "vue";

const darkenSubjects = useExtensionStorage("timetable.dark", false);
const outlineCurrent = useExtensionStorage("timetable.outline", false);

const props = defineProps<{
    subject: HTMLElement,
    pretty: Array<{
        name: string,
        pretty: string
    }>,
    period: number
}>();

const roomChange = roomChanges.value?.find(
    change => change.assigned_room === props.subject.children[2]?.textContent &&
              change.period === props.period
);

const classes = reactive({
    'darken': darkenSubjects,
    'outline': outlineCurrent && props.subject.parentElement.classList.contains('timetable-subject-active'),
    'cb-subject': true,
});
</script>

<template>
    <div :style="{backgroundColor: subject['style'].getPropertyValue('background-color')}" :class="classes">
        <div v-if="subject.tagName === 'DIV'">
            <!--The title of the subject-->
            <a :href="subject.firstElementChild?.href" class="cb-link">
                {{
                    pretty?.find(
                        s => s['name']?.toLowerCase() === subject.children[1]?.textContent.slice(1,-1)?.toLowerCase()
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