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
        <EditingContextMenu @delete="$emit('delete')" settings="true">
            <span>Colour:</span><br>
            <input type="radio" name="colour" value="solid" class="dui-radio" v-model="ts_type"><label for="solid">Solid Colour</label>
            <input type="radio" name="colour" value="gradient" class="dui-radio" v-model="ts_type"><label for="gradient">Gradient</label>
            <input type="radio" name="colour" value="default" class="dui-radio" v-model="ts_type"><label for="gradient">Default Colour</label>
            <input type="color" v-model="ts_hex1" v-if="ts_type !== 'default'">
        </EditingContextMenu>
    </div>
</template>

<script setup>
import EditingContextMenu from "~/components/EditingContextMenu.vue";
import {useExtensionStorage} from "~/utils/utils.js"

let tiles = document.querySelector('#tileList-2248').getElementsByClassName('tile');

const ts_type = useExtensionStorage("tiles.type", "solid");
const ts_hex1 = useExtensionStorage("tiles.hex1", "#3ae8d4");

// Readable code stolen from https://stackoverflow.com/a/54070620/13102310
function hexToHSV(hex) {
    let r = parseInt(hex.substring(1,3),16)/255;
    let g = parseInt(hex.substring(3,5),16)/255;
    let b = parseInt(hex.substring(5,7),16)/255;
    let v=Math.max(r,g,b), c=v-Math.min(r,g,b);
    let h= c && ((v===r) ? (g-b)/c : ((v===g) ? 2+(b-r)/c : 4+(r-g)/c));
    return [60*(h<0?h+6:h), v&&c/v, v];
}

function getFilter() {
    if (ts_type.value === "solid") {
        const hsv = hexToHSV(ts_hex1.value);

        return {filter: `hue-rotate(${hsv[0] + 180}deg) saturate(${hsv[1] * 200}%) brightness(${hsv[2] * 1.5})`};
    } else if (ts_type.value === "default") {
        return {};
    }
}

// function getHueRotation(index) {
//   if (tiles_settings.value === 1) {
//       if (index > 4 && index < 10) {
//           // reverse the order of the tiles for row 2
//           return (14 - index) * 24;
//       }
//       return index * 24;
//   } else {
//       return 0;
//   }
// }

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
