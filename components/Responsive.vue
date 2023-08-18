<script setup>
import { ref } from 'vue';
const touch = ref(false);
</script>

<template>
    <div
        responsive
        style="position: relative; overflow: hidden"
        :class="[touch ? 'touch-down' : 'touch-up']"
        @click="touch = false"
        @touchstart="touch = true"
        @mousedown="touch = true"
        @touchcancel="touch = false"
        @touchend="touch = false"
        @touchleave="touch = false"
    >
        <slot @blur="touch = false"></slot>
    </div>
</template>

<style scoped lang="scss">
[responsive] {
  position: relative;
  cursor: pointer;
  &::before {
    pointer-events: none;
    display: block;
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  &.touch-up::before {
    transition: .3s;
    transition-delay: .1s;
  }

  &.touch-down::before {
    transition: .1s;
    background-color: var(--cf-next-next-level);
  }
}
</style>
