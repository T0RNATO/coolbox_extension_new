<template>
  <ul id="tileList" class="tileList">
    <li v-for="(tile, index) in tiles"
        :class="tile.className" :style="getStyle(index)"
        :id="tile.id"
        v-html="tile.innerHTML">
    </li>
  </ul>
</template>

<script setup>
let tiles = document.querySelector('#tileList-2248').getElementsByClassName('tile');

function getStyle(index) {
  if (index > 4 && index < 10) {
    // reverse the order of the tiles for row 2
    return 'filter: hue-rotate(' + (14 - index) * 24 + 'deg) brightness(1.5) contrast(1.3)';
  }
  return 'filter: hue-rotate(' + index * 24 + 'deg) brightness(1.5) contrast(1.3)';
}
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
