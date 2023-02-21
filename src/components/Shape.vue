<template>
  <svg :viewBox="`0 0 ${width} ${height}`" xmlns="http://www.w3.org/2000/svg">
    <clipPath :id="id">
      <circle
          v-for="(circle, circleKey) in circles"
          :key="circleKey"
          :cx="circle.x"
          :cy="circle.y"
          :r="circle.r"
      />
      <polygon :points="points"/>
    </clipPath>

    <g v-if="svg">
      <circle
          v-for="(circle, circleKey) in circles"
          :key="circleKey"
          :cx="circle.x"
          :cy="circle.y"
          :r="circle.r"
      />
      <polygon :points="points"/>
    </g>
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
});

let resizeObserver: null | ResizeObserver = null;
const corners = [7, [7, 10], 7, [7, 15]];

const width = ref(100); // Default values
const height = ref(50); // Default values

const degreesToRadians = (degrees: number) => degrees * (Math.PI / 180);

const getCathetus = (radius: number, cos = false) => {
  const angle = degreesToRadians(45);
  return radius * (cos ? Math.cos(angle) : Math.sin(angle));
};

const circles = computed(() => {
  const coordinates: Coordinate[] = [];

  corners.forEach((corner, i) => {
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
          });
          coordinates.push({
            x: r + delta,
            y: r,
            r,
            p1: [r + delta - getCathetus(r, true), r - getCathetus(r)],
            p2: [r + delta, 0],
          });
          break;
        case 1:
          coordinates.push({
            x: width.value - r - delta,
            y: r,
            r,
            p1: [width.value - r - delta, 0],
            p2: [
              width.value - r - delta + getCathetus(r, true),
              r - getCathetus(r),
            ],
          });
          coordinates.push({
            x: width.value - r,
            y: r + delta,
            r,
            p1: [
              width.value - r + getCathetus(r, true),
              r + delta - getCathetus(r),
            ],
            p2: [width.value, r + delta],
          });
          break;
        case 2:
          coordinates.push({
            x: width.value - r,
            y: height.value - r - delta,
            r,
            p1: [width.value, height.value - r - delta],
            p2: [
              width.value - r + getCathetus(r, true),
              height.value - r - delta + getCathetus(r),
            ],
          });
          coordinates.push({
            x: width.value - r - delta,
            y: height.value - r,
            r,
            p1: [
              width.value - r - delta + getCathetus(r, true),
              height.value - r + getCathetus(r),
            ],
            p2: [width.value - r - delta, height.value],
          });
          break;
        case 3:
        default:
          coordinates.push({
            x: r + delta,
            y: height.value - r,
            r,
            p1: [r + delta, height.value],
            p2: [
              r + delta - getCathetus(r, true),
              height.value - r + getCathetus(r),
            ],
          });
          coordinates.push({
            x: r,
            y: height.value - r - delta,
            r,
            p1: [
              r - getCathetus(r, true),
              height.value - r - delta + getCathetus(r),
            ],
            p2: [0, height.value - r - delta],
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
        });
        break;
      case 1:
        coordinates.push({
          x: width.value - r,
          y: r,
          r,
          p1: [width.value - r, 0],
          p2: [width.value, r],
        });
        break;
      case 2:
        coordinates.push({
          x: width.value - r,
          y: height.value - r,
          r,
          p1: [width.value, height.value - r],
          p2: [width.value - r, height.value],
        });
        break;
      case 3:
      default:
        coordinates.push({
          x: r,
          y: height.value - r,
          r,
          p1: [r, height.value],
          p2: [0, height.value - r],
        });
        break;
    }
  });

  return coordinates;
});

const points = computed(() =>
    circles.value.map((circle) => [circle.p1, circle.p2].join(",")).join(" ")
);

onMounted(() => {
  nextTick(() => {
    if (props.el) {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentBoxSize) {
            const {inlineSize, blockSize} = entry.borderBoxSize[0];

            width.value = inlineSize;
            height.value = blockSize;
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
