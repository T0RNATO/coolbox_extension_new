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
        <img style="transform: translate(550px, -120px) scaleX(-1)" width="120" src="https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F88d26018-fa1a-4b92-a8b9-d8ed3f9e178e_3840x2160.png">
    </div>
    
</template>

<script setup>
import EditingContextMenu from "~/components/other/EditingContextMenu.vue";
import {ref} from "vue";
import FeedbackPopup from "~/components/popups/FeedbackPopup.vue";

const popup = ref();
</script>