<script setup lang="ts">
defineProps<{
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
    }
}>();
</script>

<template>
    <div class="text-themeText p-2" :class="{'bg-accent': item.sticky}">
        <div class="flex">
            <div>
                <a :href="item._links.self.href" :class="{bold: !item.viewedAt}">{{item.title}}</a>
                <p class="blurb">{{item.blurb}}</p>
                <div class="flex justify-between">
                    <span class="text-gray-500 italic text-sm">
                        <img :src="item.author._links.avatar.href" :alt="item.author.fullname" class="rounded-full h-6 mr-2">
                        <a :href="item.author._links.profile.href">{{item.author.fullname}}</a>
                        {{item.publishAt.relativeTime}}
                    </span>
                    <div class="text-gray-500 italic text-sm" v-if="item.sticky">
                        <span class="material-symbols-outlined">push_pin</span>
                        Pinned
                    </div>
                </div>
            </div>
            <div v-if="item.featureImage" class="w-full">
                <img :src="item.featureImage._links.image.href" alt="Feature Image">
            </div>
        </div>
        <hr class="m-0 mt-4">
    </div>
</template>

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