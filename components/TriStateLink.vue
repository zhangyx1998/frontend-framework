<script setup>
defineProps({
    href: {
        type: String,
        default: ''
    },
    to: {
        type: String,
        default: ''
    },
});
</script>
<template>
    <router-link
        v-if="to"
        :to="to"
    >
        <slot></slot>
    </router-link>
    <a
        v-else-if="href"
        :href="href"
    ><slot></slot></a>
    <div v-else>
        <slot></slot>
    </div>
</template>

<style scoped>
* {
  text-decoration: none;
}
</style>
