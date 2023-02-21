<template>
  <div class="shape">
    <div class="background">
      <div class="side">
        <div class="side-stretch left"></div>
        <corner class="side-corner" :size="30" :radius="8" position="left bottom" />
      </div>
      <div class="middle"></div>
      <div class="side">
        <corner class="side-corner" :size="40" :radius="14" position="right top"/>
        <div class="side-stretch right"></div>
      </div>
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Corner from "./Corner.vue";

const radius = 5;
</script>

<style lang="scss" scoped>
.shape {
  position: relative;
  color: black;
  font-weight: bold;
}

.background {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
}

.middle, .side-stretch, :deep(.square) {
  background: white;
}

.middle {
  flex: 1;
}

.content {
  position: relative;
}

.side {
  display: flex;
  flex-direction: column;
}

.side-stretch {
  flex-grow: 1;

  &.left {
    &:first-child {
      border-top-left-radius: calc(v-bind(radius) * 1px);
    }

    &:last-child {
      border-bottom-left-radius: calc(v-bind(radius) * 1px);
    }
  }

  &.right {
    &:first-child {
      border-top-right-radius: calc(v-bind(radius) * 1px);
    }

    &:last-child {
      border-bottom-right-radius: calc(v-bind(radius) * 1px);
    }
  }
}
</style>
