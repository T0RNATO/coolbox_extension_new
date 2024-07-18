<template>
    <div>
        <!--I have very little idea how this works but it removes all colours except those where r,g,b are equal-->
        <svg width="0" height="0">
            <filter id="keep-white" color-interpolation-filters="sRGB" width="100%" height="100%" x="0%" y="0%">
                <feColorMatrix type="matrix" values="
                  1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  -1 -1 -1 3.0001 0" />
                <feComponentTransfer>
                    <feFuncA type="linear" slope="-10" intercept="10"/>
                </feComponentTransfer>
            </filter>
        </svg>

        <div id="tileList" class="tileList grid grid-cols-6 gap-2" :style="animation_styles">
            <div class="cb-tile w-full aspect-square rounded-md"
                 v-for="(tile, index) in tiles"
                 :style="ts_type == 'default' ? {} : tileStyle(index)">
                <a :href="tile.querySelector('a').href" target="_blank">
                    <div class="!w-full !h-full tile bg-center bg-contain !m-0 !p-0"
                        :style="ts_type == 'default' ? {} : {filter: 'url(#keep-white)'}"
                        :id="tile.id"
                        @dragstart.prevent
                    />
                </a>
            </div>
        </div>

        <span class="text-themeText whitespace-pre-line">{{statusMessages.info}}</span>

        <EditingContextMenu @delete="$emit('delete')" settings="true">
            <div class="option">
                <input type="radio" name="ts_type" id="solid" value="solid" v-model="ts_type" class="dui-radio">
                <label for="solid" class="ml-1">Solid Colour</label>
            </div>
            <div class="option">
                <input type="radio" name="ts_type" id="gradient" value="gradient" v-model="ts_type" class="dui-radio">
                <label for="gradient" class="ml-1">Gradient</label>
            </div>
            <div class="option">
                <input type="radio" name="ts_type" id="default" value="default" v-model="ts_type" class="dui-radio">
                <label for="default" class="ml-1">Default Colour</label>
            </div>
            <div class="option">
                <input type="radio" name="ts_type" id="legacy" value="legacy" v-model="ts_type" class="dui-radio">
                <label for="legacy" class="ml-1">Legacy Gradient</label>
            </div>
            <div class="option">
                <input type="radio" name="ts_type" id="legacy_anim" value="legacy_anim" v-model="ts_type" class="dui-radio">
                <label for="legacy_anim" class="ml-1">RGB</label>
            </div>
            <input type="color" v-model="ts_hex1" v-if="ts_type === 'solid' || ts_type === 'gradient'">
            <input type="color" v-model="ts_hex2" v-if="ts_type === 'gradient'">
            <div v-if="ts_type === 'gradient'" class="flex items-center">
                <input type="checkbox" id="anim" class="inline-block dui-checkbox" v-model="ts_animate">
                <label for="anim">Animate gradient</label>
            </div>
        </EditingContextMenu>
    </div>
</template>

<script setup lang="ts">
import EditingContextMenu from "~/components/other/EditingContextMenu.vue";
import {useExtensionStorage} from "~/utils/componentUtils";
import {statusMessages} from "~/utils/apiUtils";
import {hexGradient} from "~/utils/utilFunctions";
import {ref, type WritableComputedRef} from "vue";
import type {widgInfo} from "~/utils/types.ts";

const tiles = document.querySelector('#tileList-2248').getElementsByClassName('tile');
const numberOfTiles = tiles.length;

type TileType = "legacy" | "solid" | "gradient" | "default" | "legacy_anim";

const ts_type: WritableComputedRef<TileType> = useExtensionStorage("tiles.type", "legacy" as TileType);
const ts_hex1 = useExtensionStorage("tiles.hex1", "#3ae8d4");
const ts_hex2 = useExtensionStorage("tiles.hex2", "#10739a");

const ts_animate = useExtensionStorage("tiles.animate", false);

const animation_styles = ref({});

function tileStyle(i): {backgroundColor?: string, animation?: string} {
    const distanceFromTopLeft = i%6+Math.floor(i/6);
    const distanceFromBottomRight = distanceFromTopLeft * -1 + 7;

    switch (ts_type.value) {
        case "solid": {
            return {backgroundColor: ts_hex1.value};
        }
        case "legacy": {
            if (i >= 6 && i < 12) {
                i = 11 - (i - 6);
            }
            return {
                backgroundColor: `hsl(${360 / numberOfTiles * i} 45% 55%)`
            }
        }
        case "legacy_anim": {
            return {
                animation: `rgb 4s linear reverse infinite -${distanceFromBottomRight * 150}ms`,
                backgroundColor: `rgb(255, 0, 0)`
            }
        }
        case "gradient": {
            if (ts_animate.value) {
                animation_styles.value["--start"] = ts_hex1.value;
                animation_styles.value["--end"] = ts_hex2.value;
                return {
                    animation: `custom_animation 3s linear alternate-reverse infinite -${distanceFromBottomRight*300}ms`,
                }
            }
            const gradientSteps = hexGradient(ts_hex1.value, ts_hex2.value, 7);
            return {
                backgroundColor: gradientSteps[distanceFromTopLeft],
            }
        }
    }
    return {}
}

defineProps<{
    widgInfo: widgInfo
}>();
</script>

<style>
.cb-tile:hover {
    transform: scale(1.05);
    transition: all 0.05s ease-in-out;
}
@keyframes rgb {
    from {
        filter: hue-rotate(0deg);
    }
    to {
        filter: hue-rotate(360deg);
    }
}
@keyframes custom_animation {
    from {
        background-color: var(--start);
    }
    to {
        background-color: var(--end);
    }
}
</style>
