<template>
  <div class="corner">
    <div class="square" :style="computedStyle" />
  </div>
</template>

<script lang="ts" setup>
import {computed, PropType} from "vue";

type CornerPosition = "left top" | "right top" | "right bottom" | "left bottom";

const props = defineProps({
  size: {
    type: Number,
    default: 20,
  },
  radius: {
    type: Number,
    default: 5,
  },
  position: {
    type: String as PropType<CornerPosition>,
    default: "left-top",
  }
})

const computedStyle = computed(() => {
  const styles: Record<CornerPosition, Record<string, string | number>> = {
    "left top": {
      right: 0,
      bottom: 0,
      transform: `translate(50%, 50%) rotate(45deg)`,
      borderRadius: `${props.radius}px 0 0 ${props.radius}px`,
    },
    "right top": {
      left: 0,
      bottom: 0,
      transform: `translate(-50%, 50%) rotate(45deg)`,
      borderRadius: `${props.radius}px ${props.radius}px 0 0`,
    },
    "right bottom": {
      left: 0,
      top: 0,
      transform: `translate(-50%, -50%) rotate(45deg)`,
      borderRadius: `0 ${props.radius}px ${props.radius}px 0`,
    },
    "left bottom": {
      right: 0,
      top: 0,
      transform: `translate(50%, -50%) rotate(45deg)`,
      borderRadius: `0 0 ${props.radius}px ${props.radius}px`,
    },
  }

  return styles[props.position];
})

const squareRadius = computed(() => props.size / 2);
const sizeDifference = computed(() => Math.sqrt(squareRadius.value ** 2 * 2))
const smallPart = computed(() => (Math.sqrt(props.radius ** 2 * 2) - props.radius))
</script>

<style lang="scss" scoped>
.corner {
  width: calc(v-bind(sizeDifference) * 1px - v-bind(smallPart) * 1px);
  height: calc(v-bind(sizeDifference) * 1px - v-bind(smallPart) * 1px);
  position: relative;
  overflow: hidden;
}

.square {
  position: absolute;
  content: "";
  display: block;
  width: calc(v-bind(size) * 1px);
  height: calc(v-bind(size) * 1px);
}
</style>
