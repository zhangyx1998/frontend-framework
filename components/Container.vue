<script setup>
const props = defineProps({
    title: {
        type: String,
        default: '',
    },
    nextLevel: Boolean,
    pad: {
        default: true,
        type: Boolean,
    },
    frame: {
        default: false,
        type: Boolean,
    },
    type: {
        default: 'plain',
        type: String,
    },
    responsive: {
        type: Boolean,
        default: false
    }
});
</script>

<template>
    <responsive
        v-if="responsive"
        container
        :type="type"
        :pad="pad"
        :frame="frame"
        :class="[nextLevel ? 'next-level' : '']"
    >
        <div
            v-if="title"
            class="title"
        >
            {{ title }}
        </div>
        <slot></slot>
    </responsive>
    <div
        v-else
        container
        :type="type"
        :pad="pad"
        :frame="frame"
        :class="[nextLevel ? 'next-level' : '']"
    >
        <div
            v-if="title"
            class="title"
        >
            {{ title }}
        </div>
        <slot></slot>
    </div>
</template>

<style lang="scss" scoped>
[container] {
  .title {
    font-size: 1.2em;
    color: var(--ct-gray);
    text-align: center;
    padding: 1em;
  }
  &.next-level {
    background-color: var(--cf-next-level);
  }
  &[pad="true"] {
    padding: 1rem 2rem;
  }
  &[frame="true"] {
    padding: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  /* Colorful container boxes */
  &:not([type="plain"]) {
    margin: 0.8rem 0;
    border-left: 8px solid var(--cb);
    border-radius: 6px;
    background-color: var(--cf);
    color: var(--ct);
    &[pad="true"] {
      padding: 1rem;
    }
  }
  &[type="message"] {
    --cb: var(--cb-gray);
    --cf: var(--cf-gray-light);
    --ct: var(--ct-gray);
  }
  &[type="info"] {
    --cb: var(--cb-blue);
    --cf: var(--cf-blue);
    --ct: var(--ct-blue);
  }
  &[type="info"].green {
    --cb: var(--cb-green);
    --cf: var(--cf-green);
    --ct: var(--ct-green);
  }
  &[type="warn"] {
    --cb: var(--cb-yellow);
    --cf: var(--cf-yellow);
    --ct: var(--ct-yellow);
  }
  &[type="alert"] {
    --cb: var(--cb-red);
    --cf: var(--cf-red);
    --ct: var(--ct-red);
  }
  /* Attribute syntactic sugar */
  &[w1280] {
    @media (min-width: 1280px) {
      --space-h: calc((100vw - 1280px) / 2);
      padding-left: var(--space-h);
      padding-right: var(--space-h);
    }
  }
  &[w1024] {
    @media (min-width: 1024px) {
      --space-h: calc((100vw - 1024px) / 2);
      padding-left: var(--space-h);
      padding-right: var(--space-h);
    }
  }
  &[flex-wrap] {
    flex-wrap: wrap;
  }
  &[flex-row] {
    display: flex;
    flex-direction: row;
  }
  &[flex-column] {
    display: flex;
    flex-direction: column;
  }
  &[flex-row-reverse] {
    display: flex;
    flex-direction: row-reverse;
  }
  &[flex-column-reverse] {
    display: flex;
    flex-direction: column-reverse;
  }
  &[flex-center] {
    justify-content: center;
  }
  &[flex-start] {
    justify-content: flex-start;
  }
  &[flex-end] {
    justify-content: flex-end;
  }
  &[flex-space-between] {
    justify-content: space-between;
  }
  &[flex-space-evenly] {
    justify-content: space-evenly;
  }
  &[flex-space-around] {
    justify-content: space-around;
  }
  &[flex-grow] {
    flex-grow: 1;
  }
  &[flex-shrink] {
    flex-shrink: 1;
  }
  &[margin] {
    margin: 10px;
  }
  &[margin-h] {
    margin-left: 10px;
    margin-right: 10px;
  }
  &[margin-v] {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  &[round] {
    overflow: hidden;
    border-radius: 10px;
  }
  &[round-2] {
    overflow: hidden;
    border-radius: 20px;
  }
  &[round-3] {
    overflow: hidden;
    border-radius: 30px;
  }
  &[content-block] > * {
    display: block;
  }
  &[content-h-fill] > * {
    display: block;
    width: 100%;
  }
  &[content-v-fill] > * {
    display: block;
    height: 100%;
  }
  &[content-left] {
    align-items: flex-start;
  }
  &[content-left] > * {
    text-align: left;
  }
  &[content-center] {
    align-items: center;
  }
  &[content-stretch] {
    align-items: stretch;
  }
  &[content-center] > * {
    text-align: center;
  }
  &[align-right] {
    align-items: flex-end;
  }
  &[content-right] > * {
    text-align: right;
  }
}
</style>
