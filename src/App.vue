<script setup lang="ts">
import Shape from "./components/Shape.vue";

const width = 208;
</script>

<template>
  <shape>
    <div class="content">Content</div>
  </shape>
</template>

<style lang="scss" scoped>
.content {
  padding: 18px 25px;
}
</style>
