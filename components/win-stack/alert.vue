<template>
	<div frame-prompt>{{ content }}</div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
	setup(...args) {
		const [content] = args
		console.log(args)
		return { content }
	}
})
</script>