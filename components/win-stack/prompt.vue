<script setup>
import Btn from '@CC/Button.vue'
const emit = defineEmits(['return']),
	props = defineProps({
		arg: {
			type: String,
			default: ''
		}
	})
function r(val) {
	emit('return', !!val)
}
</script>

<template>
	<div prompt v-if="arg">{{ arg }}</div>
	<div btn-group>
		<btn type="solid green" @click="r(true)">确认</btn>
	</div>
</template>

<style lang="scss" scoped>
[prompt] {
	display: flex;
	justify-content: center;
	* {
		width: calc(100% - 3em);
		max-width: 10em;
		margin: 1em;
		padding: 1em;
	}
}
[btn-group] {
	display: flex;
	justify-content: center;
	* {
		width: calc(100% - 3em);
		max-width: 10em;
		margin: 1em;
		padding: 1em;
	}
}
</style>