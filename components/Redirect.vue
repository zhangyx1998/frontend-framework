<script setup>
import { useRoute } from 'vue-router'
import { router } from '@/router'
import { onMounted, ref } from 'vue'
const route = useRoute(),
	link = ref(null)
onMounted(async () => {
	const state = window.history.state || {}
	window.history.replaceState(
		{ position: state?.position },
		'',
		state?.back || '/'
	)
	window.location.href = route.params.pathMatch.replace(/^\/to\//gi, '//')
})
</script>

<template>
	<container
		:frame="true"
		style="
			position: absolute;
			top: calc(50% - 50px);
			left: calc(50% - 50px);
			width: 100px;
			height: 100px;
			font-size: 100px;
		"
	>
		<chasing-circle style="opacity: 0.3" />
	</container>
</template>