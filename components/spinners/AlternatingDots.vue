<script setup>
defineProps({
    scale: {
        type: Number,
        default: 1,
    },
});
</script>

<template>
    <div
        dots
        :style="{ 'font-size': `${scale}em` }"
    >
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
</template>
<style lang="scss" scoped>
[dots] {
  display: inline-block;
  position: relative;
  width: 2em;
  height: 1em;
  line-height: 1em;
  div {
    position: absolute;
    top: 0.3em;
    left: 0;
    width: 0.4em;
    height: 0.4em;
    border-radius: 50%;
    background-color: var(--ct);
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }
  div:nth-child(1) {
    animation: dot-enter 0.5s infinite;
  }
  div:nth-child(2) {
    animation: dot-move-0-1 0.5s infinite;
  }
  div:nth-child(3) {
    animation: dot-move-1-2 0.5s infinite;
  }
  div:nth-child(4) {
    animation: dot-leave 0.5s infinite;
    transform-origin: 1.8em 0.2em;
  }
}
@keyframes dot-enter {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 0.8;
    transform: scale(1);
  }
}
@keyframes dot-move-0-1 {
  0% {
    opacity: 0.8;
    transform: translateX(0em);
  }
  100% {
    opacity: 1;
    transform: translateX(0.8em);
  }
}
@keyframes dot-move-1-2 {
  0% {
    opacity: 1;
    transform: translateX(0.8em);
  }
  100% {
    opacity: 0.8;
    transform: translateX(1.6em);
  }
}
@keyframes dot-leave {
  0% {
    opacity: 0.8;
    transform: scale(1) translateX(1.6em);
  }
  100% {
    opacity: 0;
    transform: scale(0) translateX(1.6em);
  }
}
</style>
