<template>
  <svg :viewBox="`0 0 ${computedWidth} ${computedHeight}`" xmlns="http://www.w3.org/2000/svg">
    <clipPath :id="id">
      <path :d="path" />
    </clipPath>
    <path v-if="svg" :d="path" />
  </svg>
</template>

<script lang="ts" setup>
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  PropType,
  ref
} from "vue";

type Coordinate = {
  x: number,
  y: number,
  r: number,
  p1: number[],
  p2: number[],
  pc: number[],
}

const props = defineProps({
  svg: {
    type: Boolean,
  },
  id: {
    type: String,
    default: "mypath",
  },
  el: {
    type: Object as PropType<Element>,
  },
  corners: {
    type: Array as PropType<Array<number | number[]>>,
    default: () => [7, [7, 10], 7, [10, 5]],
  },
  width: {
    type: Number,
  },
  height: {
    type: Number,
  }
});

let resizeObserver: null | ResizeObserver = null;

const localWidth = ref(100); // Default values
const localHeight = ref(50); // Default values

const computedWidth = computed(() => props.width || localWidth.value);
const computedHeight = computed(() => props.height || localHeight.value);

const circles = computed(() => {
  const coordinates: Coordinate[] = [];

  props.corners.forEach((corner, i) => {
    if (Array.isArray(corner)) {
      const [r, delta] = corner;

      switch (i) {
        case 0:
          coordinates.push({
            x: r,
            y: r + delta,
            r,
            p1: [0, r + delta],
            p2: [r - getCathetus(r, true), r + delta - getCathetus(r)],
            pc: [0, r + delta - getCathetus(r) / 2],
          });
          coordinates.push({
            x: r + delta,
            y: r,
            r,
            p1: [r + delta - getCathetus(r, true), r - getCathetus(r)],
            p2: [r + delta, 0],
            pc: [r + delta - getCathetus(r, true) / 2, 0],
          });
          break;
        case 1:
          coordinates.push({
            x: computedWidth.value - r - delta,
            y: r,
            r,
            p1: [computedWidth.value - r - delta, 0],
            p2: [
              computedWidth.value - r - delta + getCathetus(r, true),
              r - getCathetus(r),
            ],
            pc: [computedWidth.value - r - delta + getCathetus(r, true) / 2, 0]
          });
          coordinates.push({
            x: computedWidth.value - r,
            y: r + delta,
            r,
            p1: [
              computedWidth.value - r + getCathetus(r, true),
              r + delta - getCathetus(r),
            ],
            p2: [computedWidth.value, r + delta],
            pc: [computedWidth.value, r + delta - getCathetus(r) / 2],
          });
          break;
        case 2:
          coordinates.push({
            x: computedWidth.value - r,
            y: computedHeight.value - r - delta,
            r,
            p1: [computedWidth.value, computedHeight.value - r - delta],
            p2: [
              computedWidth.value - r + getCathetus(r, true),
              computedHeight.value - r - delta + getCathetus(r),
            ],
            pc: [computedWidth.value, computedHeight.value - r - delta + getCathetus(r) / 2],
          });
          coordinates.push({
            x: computedWidth.value - r - delta,
            y: computedHeight.value - r,
            r,
            p1: [
              computedWidth.value - r - delta + getCathetus(r, true),
              computedHeight.value - r + getCathetus(r),
            ],
            p2: [computedWidth.value - r - delta, computedHeight.value],
            pc: [computedWidth.value - r - delta + getCathetus(r, true) / 2, computedHeight.value],
          });
          break;
        case 3:
        default:
          coordinates.push({
            x: r + delta,
            y: computedHeight.value - r,
            r,
            p1: [r + delta, computedHeight.value],
            p2: [
              r + delta - getCathetus(r, true),
              computedHeight.value - r + getCathetus(r),
            ],
            pc: [r + delta - getCathetus(r, true) / 2, computedHeight.value],
          });
          coordinates.push({
            x: r,
            y: computedHeight.value - r - delta,
            r,
            p1: [
              r - getCathetus(r, true),
              computedHeight.value - r - delta + getCathetus(r),
            ],
            p2: [0, computedHeight.value - r - delta],
            pc: [0, computedHeight.value - r - delta + getCathetus(r) / 2],
          });
          break;
      }

      return;
    }

    const r = corner;

    switch (i) {
      case 0:
        coordinates.push({
          x: r,
          y: r,
          r,
          p1: [0, r],
          p2: [r, 0],
          pc: [0, 0],
        });
        break;
      case 1:
        coordinates.push({
          x: computedWidth.value - r,
          y: r,
          r,
          p1: [computedWidth.value - r, 0],
          p2: [computedWidth.value, r],
          pc: [computedWidth.value, 0]
        });
        break;
      case 2:
        coordinates.push({
          x: computedWidth.value - r,
          y: computedHeight.value - r,
          r,
          p1: [computedWidth.value, computedHeight.value - r],
          p2: [computedWidth.value - r, computedHeight.value],
          pc: [computedWidth.value, computedHeight.value],
        });
        break;
      case 3:
      default:
        coordinates.push({
          x: r,
          y: computedHeight.value - r,
          r,
          p1: [r, computedHeight.value],
          p2: [0, computedHeight.value - r],
          pc: [0, computedHeight.value],
        });
        break;
    }
  });

  return coordinates;
});

const path = computed(() => circles.value.map((circle, i) => {
  let pointsPaths = [circle.p1.join(" "), "Q " + circle.pc.join(" "), circle.p2.join(" ")].join(" ");

  switch(i) {
    case 0:
      return "M " + pointsPaths;
    case circles.value.length - 1:
      return "L " + pointsPaths + " Z";
    default:
      return "L " + pointsPaths;
  }
}).join(" "));

const degreesToRadians = (degrees: number) => degrees * (Math.PI / 180);

const getCathetus = (radius: number, cos = false) => {
  const angle = degreesToRadians(45);
  return radius * (cos ? Math.cos(angle) : Math.sin(angle));
};

onMounted(() => {
  nextTick(() => {
    if (props.el) {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentBoxSize) {
            const {inlineSize, blockSize} = entry.borderBoxSize[0];

            localWidth.value = inlineSize;
            localHeight.value = blockSize;
          }
        }
      });

      resizeObserver.observe(props.el);
    }
  });
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});
</script>
