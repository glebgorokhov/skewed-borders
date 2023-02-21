<template>
  <div class="content" ref="content">Content</div>
  <shape :el="content" class="shape" />
</template>

<script setup lang="ts">
import Shape from "./components/Shape.vue";
import {ref} from "vue";

const content = ref();
</script>


<style lang="scss" scoped>
.content {
  padding: 18px 24px;
  background: rgba(white, .7);
  color: black;
  font-weight: 700;
  clip-path: url(#mypath);
  box-sizing: border-box;
  backdrop-filter: blur(15px);
}

.shape {
  position: fixed;
  right: 100vw;
  bottom: 100vh;
}
</style>
