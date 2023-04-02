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
	<router-link :to="to" v-if="to"><slot></slot></router-link>
	<a :href="href" v-else-if="href"><slot></slot></a>
	<div v-else><slot></slot></div>
</template>

<style scoped>
* {
	text-decoration: none;
}
</style>