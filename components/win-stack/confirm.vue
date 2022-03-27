<script setup>
import Btn from '@CC/Button.vue'
const emit = defineEmits(['return'])
function r(val) {
	emit('return', !!val)
}
</script>

<template>
	<div btn-group>
		<btn type="solid gray" @click="r(false)">取消</btn>
		<btn type="solid green" @click="r(true)">确定</btn>
	</div>
</template>

<style lang="scss" scoped>
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