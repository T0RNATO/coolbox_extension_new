<template>
  <ul id="tileList" class="tileList">
    <li v-for="(tile, index) in tiles"
        :class="tile.className"
        :style="'--rotate: ' + getHueRotation(index)"
        :id="tile.id"
        v-html="tile.innerHTML">
    </li>
  </ul>
</template>

<script setup>
import {ref} from "vue";
import browser from "webextension-polyfill";

let tiles = document.querySelector('#tileList-2248').getElementsByClassName('tile');

function getHueRotation(index) {
  if (rgb_speed.value === 1) {
      if (index > 4 && index < 10) {
          // reverse the order of the tiles for row 2
          return (14 - index) * 24;
      }
      return index * 24;
  } else {
      return 0;
  }
}

const rgb_speed = ref(1)

browser.storage.local.get("feedback").then((result) => {
    rgb_speed.value = Number(result.rgb_speed);
});
browser.storage.local.onChanged.addListener((changes) => {
    if (changes.rgb_speed) {
        rgb_speed.value = Number(changes.rgb_speed.newValue);
    }
})
</script>

<style scoped>
#tileList.tileList .tile {
    --rotate: 0;
    width: 17%;
    margin: 1.5%;
    padding-bottom: 17%;
    filter: hue-rotate(calc(var(--rotate) * 1deg)) brightness(1.5) contrast(1.3);
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
