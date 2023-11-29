<template>
    <div>
        <h2 class="subheader">News</h2>
        <div class="overflow-y-auto h-96 rounded-lg bg-primary" v-if="newsItems.length">
            <NewsItem :item="item" v-for="item in pinnedNewsItems"/>
            <NewsItem :item="item" v-for="item in newsItems"/>
        </div>
        <div class="dui-loading dui-loading-spinner" v-else/>
        <EditingContextMenu @delete="$emit('delete')"/>
    </div>
</template>

<script setup>
import EditingContextMenu from "~/components/other/EditingContextMenu.vue";
import {cookieFetched} from "~/utils/apiUtils";
import {ref} from "vue";
import NewsItem from "~/components/other/NewsItem.vue";

const pinnedNewsItems = ref([]);
const newsItems = ref([]);

// https://schoolbox.donvale.vic.edu.au/news/saved as well

cookieFetched.then(cookie => {
    fetch("https://schoolbox.donvale.vic.edu.au/news/lists/feed", {
        "headers": {
            "cookie": `PHPSESSID=${cookie}`
        },
        "method": "GET"
    }).then(data => data.json().then(json => {
        for (const item of json) {
            if (item.sticky) {
                pinnedNewsItems.value.push(item);
            } else {
                newsItems.value.push(item);
            }
        }
    }))
})

defineProps({
    widgInfo: Object
})
</script>

<style scoped>

</style>