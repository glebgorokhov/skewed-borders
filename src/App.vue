<template>
  <div class="content" ref="content">
    <span class="inner">Content</span>
    <shape :el="content" class="shape" svg :corners="[7, [7, 10], 7, [10, 5]]" />
  </div>
</template>

<script setup lang="ts">
import Shape from "./components/Shape.vue";
import {ref} from "vue";

const content = ref();
</script>


<style lang="scss" scoped>
.content {
  padding: 18px 24px;
  color: white;
  font-weight: 700;
  clip-path: url(#mypath);
  box-sizing: border-box;
  position: relative;
}

.inner {
  position: relative;
  z-index: 1;
}

.shape {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  stroke-width: 2px;
  stroke: rgba(#FFD76F, .5);
  fill: rgba(#261F13, .24);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
}
</style>
