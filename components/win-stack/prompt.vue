<template>
	<div prompt>{{ content }}</div>
</template>

<script>
import Btn from '@CC/Button.vue'
import { createFactory, guardFactory, RETURN } from '@CL/factory'
import { defineComponent } from 'vue'
const options = defineComponent({
	emits: ['return'],
	components: { Btn }
})
export default guardFactory(options)
export const createPrompt = createFactory(options, content => ({ content }))
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