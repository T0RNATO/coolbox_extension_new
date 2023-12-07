<template>
    <div class="text-themeText p-2 relative" :class="{'bg-accent': item.sticky}">
        <div class="flex">
            <div class="w-full">
                <a :href="item._links.self.href" :class="{bold: !item.viewedAt}">{{item.title}}</a>

                <p class="blurb" v-html="item.blurb"></p>

                <div class="flex justify-between">
                    <span class="text-gray-500 italic text-sm">
                        <img :src="item.author._links.avatar.href" :alt="item.author.fullname"
                             class="rounded-full h-6 mr-2">
                        <a :href="item.author._links.profile.href">{{item.author.fullname}}</a>
                        {{item.publishAt.relativeTime}}
                    </span>
                    <div class="text-gray-500 italic text-sm" v-if="item.sticky">
                        <span class="material-symbols-outlined">push_pin</span>
                        Pinned
                    </div>
                </div>
            </div>
            <div v-if="item.featureImage">
                <img :src="item.featureImage._links.image.href" alt="Feature Image"
                    class="max-h-32 max-w-[160px]">
            </div>
        </div>
        <hr class="m-0 mt-4">

        <span class="absolute top-0 right-0 material-symbols-outlined pr-2 text-lg cursor-pointer bg-primary rounded-bl-md"
              :class="{'icon-fill': saved}"
              @click="save(item.id)"
        >
            star
        </span>
    </div>
</template>

<!--suppress TypeScriptUnresolvedReference (this is how to fix bugs as a good developer) -->
<script setup lang="ts">
import {cookieFetched} from "~/utils/apiUtils";

const props = defineProps<{
    item: {
        id: number;
        title: string;
        blurb: string;
        sticky: boolean;
        featureImage: {
            hash: string;
            size: number;
            mime: string;
            _links: {
                fetch: {
                    href: string;
                    auth: null;
                };
                image: {
                    href: string;
                    auth: null;
                };
            };
        };
        author: {
            fullname: string;
            _links: {
                profile: {
                    href: string;
                    auth: null;
                };
                avatar: {
                    href: string;
                    auth: null;
                };
            };
        };
        publishAt: {
            long: string;
            relativeTime: string;
            json: string;
        };
        topics: Array<{
            name: string;
            slug: string;
            sequence: number;
        }>;
        _links: {
            self: {
                href: string;
                auth: null;
            };
            update: {
                href: string;
                auth: boolean;
            };
            saveForLater: {
                href: string;
                auth: boolean;
            };
            unsaveForLater: {
                href: string;
                auth: boolean;
            };
        };
        readMore: {
            string: string;
            available: boolean;
        };
        metadata: {
            commentCount: number;
        };
        attachments: number;
        viewedAt: null;
    },
    saved: Boolean
}>();
const emit = defineEmits(["save", "unsave"]);

function post(url: string, cookie: string) {
    return fetch("https://schoolbox.donvale.vic.edu.au/news/saved/" + url, {
        "headers": {
            "cookie": `PHPSESSID=${cookie}`
        },
        "method": "POST"
    });
}

function save(id: number) {
    cookieFetched.then(cookie => {
        if (!props.saved) {
            post(`${id}/add`, cookie).then(() => {
                emit("save");
            })
        } else {
            post(`${id}/remove`, cookie).then(() => {
                emit("unsave");
            })
        }
    })
}
</script>

<style scoped>
.blurb {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.bold {
    @apply font-bold;
}
</style>