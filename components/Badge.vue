<script setup>
defineProps({
    type: {
        type: String,
        default: 'solid gray'
    }
});
</script>

<template>
    <div
        badge
        :class="type"
    >
        <slot></slot>
    </div>
</template>

<style scoped lang="scss">
/* Variable Mounting */
[badge] {
  font-size: 0.8em;
  font-weight: bold;
  /* Positioning */
  display: inline-block;
  padding: 0.2em 0.4em;
  /* Content Layout */
  line-height: 100%;
  align-items: center;
  margin: 0 0.5em;
  /* Appearance */
  border-radius: 0.3em;
  border: 1px solid var(--cb);
  background-color: var(--cf);
  // types
  &.solid {
    background-color: var(--cf);
    border-color: var(--cf);
    color: var(--ct);
    // Colors
    &.red {
      --ct: var(--ct-red);
      --cf: var(--cf-red)
    }
    &.green {
      --ct: var(--ct-green);
      --cf: var(--cf-green)
    }
    &.blue {
      --ct: var(--ct-blue);
      --cf: var(--cf-blue)
    }
    &.yellow {
      --ct: var(--ct-yellow);
      --cf: var(--cf-yellow)
    }
    &.brand {
      --ct: var(--c-brand-contrast);
      --cf: var(--c-brand)
    }
    &.gray {
      --ct: var(--ct-gray-dark);
      --cf: var(--cf-next-next-level)
    }
  }
}
</style>
