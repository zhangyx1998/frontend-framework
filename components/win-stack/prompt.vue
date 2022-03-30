<template>
	<div prompt>{{ content }}</div>
</template>

<script>
import Btn from '@CC/Button.vue'
import { defineComponent } from 'vue'
export default defineComponent({
	components: { Btn },
	setup(...args) {
		const [content] = args
		console.log(args)
		return { content }
	}
})
</script>

<style lang="scss" scoped>
[prompt] {
	text-align: left;
	justify-content: center;
	font-size: 1.2rem;
	color: var(--ct-gray);
	font-weight: normal;
	padding: 2rem 1.2rem;
}
</style>