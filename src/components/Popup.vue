<template>
    <dialog class="modal">
        <div class="modal-box p-0">
            <h1 class="bg-[#325985] w-full !text-white p-4 mb-0">{{title}}</h1>
            <div class="p-4">
                woo content
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button class="all-unset">close</button>
        </form>
    </dialog>
</template>

<script setup>
defineProps({
    title: String
})
</script>