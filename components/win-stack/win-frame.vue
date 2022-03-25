<script setup>
import Btn from '@CC/Button.vue'
// import { defineEmits } from 'vue';
const props = defineProps({
		abortable: Boolean,
		title: {
			type: String,
			default: 'Untitled window'
		}
	}),
	emit = defineEmits(['return'])
function onReturn(...args) {
	console.log(args)
	emit('return', ...args)
}
</script>

<template>
		<div frame>
			<div frame-title>
				<span title>{{ title }}</span>
				<btn v-show="abortable" type="solid gray" :style="{ 'border-radius': '100%' }"
					>X</btn
				>
			</div>
			<div frame-body>
				<slot />
			</div>
		</div>
</template>

<style lang="scss" scoped>
[frame] {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	max-height: 70vh;
	background-color: var(--cf);
	padding-bottom: 32px;
	border-radius: 20px 20px 0 0;
	box-shadow: 0 0 20px 0 var(--c-box-shadow);
	[frame-title] {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 10px;
		border-bottom: 1px solid var(--cb-gray-light);
		[title] {
			font-size: 1.4em;
			padding: 0.5em 1em;
		}
	}
	[frame-body] {
		padding: 10px;
	}
}
</style>