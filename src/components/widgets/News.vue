<template>
    <div>
        <h2 class="subheader inline">News</h2>
        <span class="text-themeText">
            -
            <a href="/news/saved" class="dui-tooltip" data-tip="View Saved News Items">
                <span class="cb-icon">
                    hotel_class
                </span>
            </a>
        </span>
        <br>
        <div class="overflow-y-auto h-[50vh] rounded-lg bg-primary" v-if="newsItems.length" :class="{noscroll: widgInfo.add}">
            <NewsItem :item="item" v-for="item in pinnedNewsItems" :saved="(savedItems as Array<string>).includes(item.id)"
                      @save="savedItems.push(item.id)"
                      @unsave="savedItems.splice(savedItems.indexOf(item.id), 1)"
            />
            <NewsItem :item="item" v-for="item in newsItems" :saved="(savedItems as Array<string>).includes(item.id)"
                      @save="savedItems.push(item.id)"
                      @unsave="savedItems.splice(savedItems.indexOf(item.id), 1)"
            />
        </div>
        <div class="dui-loading dui-loading-spinner" v-else/>
        <EditingContextMenu @delete="$emit('delete')"/>
    </div>
</template>

<script setup lang="ts">
import EditingContextMenu from "~/components/other/EditingContextMenu.vue";
import {cookieFetched} from "~/utils/apiUtils";
import {ref} from "vue";
import NewsItem from "~/components/other/NewsItem.vue";
import type {widgInfo} from "~/utils/types";

const pinnedNewsItems = ref([]);
const newsItems = ref([]);

const savedItems = ref([]);

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

    fetch("https://schoolbox.donvale.vic.edu.au/news/saved", {
        "headers": {
            "cookie": `PHPSESSID=${cookie}`,

            // Idk why this is needed but it returns html when not included
            "x-requested-with": "XMLHttpRequest",
        },
        "method": "GET"
    }).then(data => data.json().then(json => {
        savedItems.value = json;
    }))
})

defineProps<{
    widgInfo: widgInfo
}>()
</script>

<style scoped>
.noscroll {
    overflow-y: hidden;
}
</style>