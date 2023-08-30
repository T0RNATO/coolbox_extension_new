<template>
    <div>
        <h1>
            {{greeting.firstChild.textContent}}
            <strong>{{customName || greeting.firstElementChild.textContent}}</strong>
        </h1>
        <EditingContextMenu @delete="$emit('delete')" settings="true">
        <div class="option">
            <label for="customName">Custom Name: </label>
            <input type="text" id="customName" v-model="customName" class="ml-2">
        </div>
        </EditingContextMenu>
    </div>
</template>

<script setup>
import EditingContextMenu from "~/components/EditingContextMenu.vue";
import {useExtensionStorage} from "~/utils/componentUtils";

const customName = useExtensionStorage('customName', '');

const greeting = document.querySelector('#component9 > div:nth-child(1) > div:nth-child(1) > h1:nth-child(1)');
</script>