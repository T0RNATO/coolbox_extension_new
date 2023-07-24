<template>
    <div>
        <ul id="tileList" class="tileList">
            <li v-for="(tile, index) in tiles"
                :class="tile.className"
                :style="getFilter(index)"
                :id="tile.id"
                v-html="tile.innerHTML"
                @dragstart.prevent
            >
            </li>
        </ul>

        <span class="text-themeText">{{infoMessage}}</span>

        <EditingContextMenu @delete="$emit('delete')" settings="true">
            <shadow-root :adopted-style-sheets="defaultSheets">
                <div class="flex items-center mb-1">
                    <input type="radio" name="ts_type" id="solid" value="solid" v-model="ts_type" class="dui-radio">
                    <label for="solid" class="ml-1">Solid Colour</label>
                </div>
                <div class="flex items-center mb-1">
                    <input type="radio" name="ts_type" id="gradient" value="gradient" v-model="ts_type" class="dui-radio">
                    <label for="gradient" class="ml-1">Gradient</label>
                </div>
                <div class="flex items-center mb-1">
                    <input type="radio" name="ts_type" id="default" value="default" v-model="ts_type" class="dui-radio">
                    <label for="default" class="ml-1">Default Colour</label>
                </div>
                <div class="flex items-center mb-1">
                    <input type="radio" name="ts_type" id="legacy" value="legacy" v-model="ts_type" class="dui-radio">
                    <label for="legacy" class="ml-1">Legacy Gradient</label>
                </div>
                <div class="flex items-center mb-1">
                    <input type="radio" name="ts_type" id="legacy_anim" value="legacy_anim" v-model="ts_type" class="dui-radio">
                    <label for="legacy_anim" class="ml-1">Legacy Animated Gradient</label>
                </div>
                <input type="color" v-model="ts_hex1" v-if="ts_type === 'solid' || ts_type === 'gradient'">
                <input type="color" v-model="ts_hex2" v-if="ts_type === 'gradient'">
            </shadow-root>
        </EditingContextMenu>
    </div>
</template>

<script setup>
import EditingContextMenu from "~/components/EditingContextMenu.vue";
import {defaultSheets, useExtensionStorage} from "~/utils/componentUtils";
import {infoMessage} from "~/utils/apiUtils";
import {onBeforeUnmount} from "vue";

let tiles = document.querySelector('#tileList-2248').getElementsByClassName('tile');

const ts_type = useExtensionStorage("tiles.type", "legacy");
const ts_hex1 = useExtensionStorage("tiles.hex1", "#3ae8d4");
const ts_hex2 = useExtensionStorage("tiles.hex2", "#10739a");

// Readable code stolen from https://stackoverflow.com/a/54070620/13102310
function hexToHSV(hex) {
    let r = parseInt(hex.substring(1,3),16)/255;
    let g = parseInt(hex.substring(3,5),16)/255;
    let b = parseInt(hex.substring(5,7),16)/255;
    let v = Math.max(r,g,b), c=v-Math.min(r,g,b);
    let h = c && ((v===r)?(g-b)/c:((v===g)?2+(b-r)/c:4+(r-g)/c));
    return [60*(h<0?h+6:h), v&&c/v, v];
}

function getFilter(i) {
    if (ts_type.value === "solid") {
        const hsv = hexToHSV(ts_hex1.value);
        return {filter: `hue-rotate(${hsv[0] + 180}deg) saturate(${hsv[1] * 300}%) brightness(${hsv[2] * 1.5})`};
    } else if (ts_type.value === "default") {
        return {};
    } else if (ts_type.value === "legacy") {
        return {filter: `hue-rotate(${getHueRotation(i)}deg) brightness(1.5) contrast(1.3)`};
    } else if (ts_type.value === "legacy_anim") {
        // TODO
        // if (!rgbInterval) {
        //     setInterval(() => {
        //
        //     })
        // }
        //
        // return {filter: `hue-rotate(${}deg) brightness(1.5) contrast(1.3)`};
    }
}

function getHueRotation(index) {
  if (index > 4 && index < 10) {
      // reverse the order of the tiles for row 2
      return (14 - index) * 24;
  }
  return index * 24;
}

let rgbInterval;

onBeforeUnmount(() => {
    clearInterval(rgbInterval);
})

defineProps({
    widgInfo: Object
})
</script>

<style scoped>
#tileList.tileList .tile {
    width: 17%;
    margin: 1.5%;
    padding-bottom: 17%;
}
li.tile {
    border-radius: 5px;
    width: 19% !important;
    margin: 0.5% !important;
    padding-bottom: 18% !important;
}
li.tile:hover {
    transform: scale(1.05);
    transition: all 0.05s ease-in-out;
}
</style>
