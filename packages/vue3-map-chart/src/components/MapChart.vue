<script setup lang="ts">
  import WorldMap from '../assets/maps/world.svg?raw'
</script>

<template>
  <div class="v3mc-container">
    <div class="v3mc-map" v-html="WorldMap"></div>
  </div>
</template>

<style>
  body {
    padding: 0;
    margin: 0;
  }
</style>

<style scoped>
  .v3mc-container {
    display: flex;
    width: 100vw;
    height: 100vh;
    align-items: center;
    justify-content: center;
  }

  :deep(svg) {
    width: 80vw;
    height: 80vh;
  }
</style>
