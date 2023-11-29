<template>
    <div>
        <teleport to="body">
            <FeedbackPopup ref="popup"/>
        </teleport>
        <div class="pl-2 text-sm">
            <h1 class="mt-2">CoolBox</h1>
            <span id="cb-settings">
            Customise your homepage and enable themes by hitting the pencil in the top right, or view a full list of features at <a href="https://coolbox.lol">coolbox.lol</a>.<br>
            Got questions, comments, suggestions? Send us feedback!
        </span>
            <button id="cb-feedback" class="block my-4" @click="popup.openPopup">Submit Feedback</button>
            <span class="italic text-gray-400">
            CoolBox is not endorsed by or affiliated with Donvale Christian College or Schoolbox Pty Ltd.<br>
        </span>
            <EditingContextMenu @delete="$emit('delete')"/>
        </div>
    </div>
</template>

<script setup>
import EditingContextMenu from "~/components/other/EditingContextMenu.vue";
import {ref} from "vue";
import FeedbackPopup from "~/components/popups/FeedbackPopup.vue";

const popup = ref();
</script>