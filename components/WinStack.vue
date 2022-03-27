<script setup>
import Btn from '@CC/Button.vue'
import { ref, onMounted } from '@vue/runtime-core'
import WinFrame from './win-stack/win-frame.vue'
import { markRaw } from 'vue'
const stack = ref([])
_stack = function(title, component, arg, abortable = true) {
	component = markRaw(component)
	return new Promise(resolve => {
		stack.value.push({ title, component, arg, abortable, resolve })
	})
}
function onReturn(...args) {
	console.log(stack.value)
	const { resolve } = stack.value.pop()
	console.log(stack.value)
	resolve(...args)
}
function onAbort() {
	const { abortable } = stack.value[stack.value.length - 1]
	if (abortable) {
		onReturn()
	}
}
function activeFrame() {
	
}
</script>

<template>
	<div frame-wrapper>
		<div frame-background v-if="stack.length" @click="onAbort"></div>
		<transition-group name="pop-up">
			<win-frame
				v-for="(el, i) in stack"
				:key="i"
				:title="el.title"
				:abortable="el.abortable"
				@return="onReturn"
				@abort="onAbort"
				@active="activeFrame"
			>
				<component
					:is="el.component"
					v-if="stack.length - i == 1"
					:arg="el.arg"
					@return="onReturn"
				/>
			</win-frame>
		</transition-group>
	</div>
</template>


<script>
import vConfirm from './win-stack/confirm.vue'
import vPrompt from './win-stack/prompt.vue'
// Stack initialization
let _stack = function() {
	console.error('Failed to push into stack: WinStack has not been mounted')
}
/**
 * @param {Object} component the vue template to render into stack
 * @param {Boolean} abortable whether the window can be closed
 * @returns {Promise<Object | Boolean | Number | String>}
 * The execution result of current component
 */
export function $(title, component, arg, abortable = true) {
	return _stack(title, component, arg, !!abortable)
}
// Default stack function export
export const confirm = (question, abortable) => $(question, vConfirm, undefined, abortable)
export const prompt = (title, content) => $(title, vPrompt, content)
// export const alert = (question, abortable) => $(vConfirm, true)
</script>

<style lang="scss" scoped>
[frame-wrapper] {
	position: fixed;
	z-index: 2000;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	pointer-events: none;
	* {
		pointer-events: all;
	}
	[frame-background] {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		-webkit-backdrop-filter: blur(2px);
		backdrop-filter: blur(2px);
	}
}

.pop-up {
	&-enter-from,
	&-leave-to {
		transform: translateY(105%);
	}
}
</style>