<template>
    <div>
        <PopupBase title="Submit Feedback" ref="popup">
            Submit your feedback, comments, suggestions, or bug reports here.
            <textarea class="resize-none h-40 mt-2" ref="body"></textarea>
            <shadow-root :adopted-style-sheets="defaultSheets">
                <label for="anon" class="align-top">Anonymous:</label>
                <input type="checkbox" class="dui-checkbox dui-checkbox-sm" id="anon" ref="anon">
            </shadow-root>
            <span class="text-gray-500 italic text-xs mb-2 block">
            This feedback is publicly visible, with your name, unless you tick the anonymous box.<br>
            (Do not tick it if you expect a response!)<br>
            Abuse will result in a non-appealable ban.
        </span>
            <form method="dialog">
                <button class="w-[calc(50%-0.5rem)] mr-2">Cancel</button>
                <button class="!w-[calc(50%-0.5rem)] ml-2 submit" @click="sendFeedback">Send Feedback</button>
            </form>
        </PopupBase>
        <div class="pl-2 text-sm">
            <h1 class="mt-2">CoolBox</h1>
            <span id="cb-settings">
            Customise your homepage and enable themes by hitting the pencil in the top right, or view a full list of features at <a href="https://coolbox.lol">coolbox.lol</a>.<br>
            Got questions, comments, suggestions? Send us feedback!
        </span>
            <button id="cb-feedback" class="block my-4" @click="popup.$el.showModal">Submit Feedback</button>
            <span class="italic text-gray-400">
            CoolBox is not endorsed by or affiliated with Donvale Christian College or Schoolbox Pty Ltd.<br>
        </span>
            <EditingContextMenu @delete="$emit('delete')"/>
        </div>
    </div>
</template>

<script setup>
import EditingContextMenu from "~/components/EditingContextMenu.vue";
import PopupBase from "~/components/popups/PopupBase.vue";
import {ref} from "vue";
import {apiSend} from "~/utils/apiUtils";
import {defaultSheets} from "~/utils/componentUtils";

const popup = ref();
const body = ref();
const anon = ref();

function sendFeedback() {
    apiSend("POST", "feedback", {
        content: body.value.value,
        origin: "schoolbox",
        // origin: "test",
        anonymous: anon.value.checked
    }, "Feedback Sent!", "Failed to send feedback - you may be banned.")
}
</script>