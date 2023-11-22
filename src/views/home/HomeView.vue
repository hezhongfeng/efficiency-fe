<template>
  <div class="home-view">{{ str }}</div>
</template>

<script setup>
import { ref } from 'vue';

const str = ref('home-view');
</script>

<style lang="scss">
.home-view {
}
</style>
