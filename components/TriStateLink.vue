<script setup>
defineProps({
	href: String,
	to: String,
});
</script>
<template>
	<router-link v-if="to" :to="to"><slot /></router-link>
	<a :href="href" v-else-if="href"><slot /></a>
	<div v-else><slot /></div>
</template>

<style scoped>
* {
	text-decoration: none;
}
</style>