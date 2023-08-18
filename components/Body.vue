<template>
    <div>
        <slot></slot>
    </div>
</template>

<style scoped>
div {
  min-height: calc(100vh - var(--header-height));
  width: 100%;
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: space-between;
}
</style>
