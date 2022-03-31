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
	<router-link :to="to" v-if="to"><slot /></router-link>
	<a :href="href" v-else-if="href"><slot /></a>
	<div v-else><slot /></div>
</template>

<style scoped>
* {
	text-decoration: none;
}
</style>