<script setup>
import {defaultSheets} from "~/utils/componentUtils";
import {ref} from "vue";
import {apiSend} from "~/utils/apiUtils";
import PopupBase from "~/components/popups/PopupBase.vue";

const popup = ref();
const body = ref();
const anon = ref();

function sendFeedback() {
    apiSend("POST", "feedback", {
        content: body.value.value,
        origin: "schoolbox",
        // origin: "test",
        anonymous: anon.value.checked
    }, "Feedback Sent!", "Failed to send feedback - you may be banned or not have internet.")
}

function openPopup() {
    popup.value.$el.showModal();
}

defineExpose({openPopup});
</script>

<template>
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
</template>

<style scoped>

</style>