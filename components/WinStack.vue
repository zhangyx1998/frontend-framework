<script setup>
import { ref, onMounted, markRaw, computed, watch } from 'vue'
import Responsive from './Responsive.vue'
const stack = ref([]), depth = ref(0), display = ref(false), direction = ref(1),
	displayEl = computed(() => {
		return stack.value[depth.value - 1]?.ref || stack.value[0]?.ref
	}),
	size = computed(() => {
		const el = stack.value[depth.value - 1]?.ref || stack.value[0]?.ref
		if (el) {
			return {
				w: displayEl.value.offsetWidth,
				h: displayEl.value.offsetHeight,
			}
		} else {
			return { w: 0, h: 0 }
		}
	}),
	showBackButton = computed(() => !!(depth.value > 1 && stack.value[depth.value].abortable)),
	showCloseButton = computed(() => !!(
		stack.value
			.filter(({ abortable }, i) => abortable || i >= depth.value)
			.reduce((a, b) => a && b, true)
	))
// Watch the depth and set a small delay before updating display
watch(depth, (d, e) => {
	direction.value = d - e
	if (d) {
		display.value = true
	} else {
		setTimeout(() => {
			display.value = !!depth.value
		}, 100);
	}
})
// Initialize exposed enqueue function
$ = function(title, component, abortable = true) {
	markRaw(component)
	return new Promise(resolve => {
		stack.value[depth.value++] = { title, component, abortable, resolve }
	})
}
// Resolve the returned value to the caller
function onReturn(...args) {
	if (depth.value) {
		const { resolve } = stack.value[--depth.value]
		resolve(...args)
	} else {
		console.error('WinStack already drained')
	}
}
// Handle abort event
function onAbort(all = false) {
	if (!depth.value) return
	const { abortable } = stack.value[depth.value - 1]
	if (abortable) {
		onReturn()
	}
	// Recursively abort all abortable frames
	if (all) onAbort(all)
}
</script>

<template>
	<div frame-wrapper>
		<div frame-background :display="display" @click="onAbort(true)"></div>
		<transition name="frame">
			<div frame-window v-if="display">
				<div frame-header>
					<responsive
						button
						back-button
						:display="showBackButton"
						@click="onAbort"
					>
						<svg viewBox="0 0 20 20">
							<g style="fill: var(--ct-gray-dark)">
								<path
									d="M12,19.5a1.51,1.51,0,0,1-1.06-.44l-8-8a1.49,1.49,0,0,1,0-2.12l8-8a1.5,1.5,0,0,1,2.12,2.12L6.47,9.65a.5.5,0,0,0,0,.7L13,16.86A1.59,1.59,0,0,1,13.15,19,1.54,1.54,0,0,1,12,19.5Z"
								/>
							</g>
						</svg>
					</responsive>
					<div
						title-text
						:style="{
							left: `${showBackButton ? 3.6 : 0}rem`,
							right: `${showCloseButton ? 3.6 : 0}rem`,
						}"
					>
						{{ stack[stack.length - 1]?.title || "Untitled frame" }}
					</div>
					<responsive
						button
						close-button
						:display="showCloseButton"
						@click="onAbort(true)"
					>
						<svg viewBox="0 0 20 20">
							<g style="fill: var(--ct-gray-dark)">
								<path
									d="M12.12,10l4.94-4.94a1.5,1.5,0,1,0-2.12-2.12L10,7.88,5.06,2.94A1.5,1.5,0,0,0,2.94,5.06L7.88,10,2.94,14.94a1.49,1.49,0,0,0,0,2.12,1.5,1.5,0,0,0,2.12,0L10,12.12l4.94,4.94a1.5,1.5,0,0,0,2.12,0,1.49,1.49,0,0,0,0-2.12Z"
								/>
							</g>
						</svg>
					</responsive>
				</div>
				<div
					frame-container
					:style="{
						height: size.h + 'px',
						width: size.w + 'px',
					}"
				>
					<transition-group
						:name="direction > 0 ? 'push-left' : 'push-right'"
					>
						<div
							frame-content
							v-for="(el, i) in stack"
							:key="[i, el.title].join('::')"
							:ref="(_) => stack[i] && (stack[i].ref = _)"
						>
							<component
								:is="el.component"
								@return="onReturn"
								v-if="i + 1 == depth || (!i && !depth)"
							/>
						</div>
					</transition-group>
				</div>
			</div>
		</transition>
	</div>
</template>


<script>
import { createConfirm } from './win-stack/confirm.vue'
import { createPrompt } from './win-stack/prompt.vue'
/**
 * @param {Object} component the vue template to render into stack
 * @param {Boolean} abortable whether the window can be closed
 * @returns {Promise<Object | Boolean | Number | String>}
 * The execution result of current component
 */
export let $ = function(title, component, abortable = true, standalone = false) {}
// Default stack function export
export const confirm = (question, abortable) => $(question, createConfirm(), abortable)
export const prompt = (title, content) => $(title, createPrompt(content))

window.v = { confirm, prompt }
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
}

[frame-background] {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	-webkit-backdrop-filter: blur(2px) saturate(0.8);
	backdrop-filter: blur(2px) saturate(0.8);
	&[display="false"] {
		opacity: 0;
		pointer-events: none;
	}
}

[frame-window] {
	position: absolute;
	overflow: hidden;
	padding: 0;
	background-color: var(--cf);
	@media (max-width: 719px) {
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		border-radius: 12px 12px 0 0;
	}
	@media (min-width: 720px) {
		left: 50%;
		top: 50%;
		border-radius: 12px;
		transform: translate(-50%, -50%);
	}
	box-shadow: 0 0 20px 0 var(--c-box-shadow);
	[frame-header] {
		height: 3.6rem;
		margin: 0;
		padding: 0;
		position: relative;
		background-color: var(--cf-next-level);
		// ICON normalization
		svg {
			width: 1.2rem;
			height: 1.2rem;
			margin: 1.2rem;
		}
		[button] {
			position: absolute !important;
			top: 0;
			opacity: 0;
			cursor: pointer;
			pointer-events: none;
			&[back-button] {
				left: 0;
				transform: translateX(-100%);
			}
			&[close-button] {
				right: 0;
				transform: translateX(100%);
			}
			&[display="true"] {
				opacity: 1;
				transform: translateX(0);
			}
		}
		[title-text] {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			padding: 1.2rem;
			height: 100%;
			line-height: 100%;
			color: var(--ct-gray);
			font-size: 1.2rem;
			font-weight: 500;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
	}
	[frame-container] {
		position: relative;
		overflow: hidden;
		@media (max-width: 719px) {
			width: 100vw !important;
		}
		[frame-content] {
			position: absolute;
			top: 0;
			left: 0;
			overflow-x: hidden;
			overflow-y: scroll;
			@media (max-width: 719px) {
				max-height: 80vh;
				width: 100vw;
			}
			@media (min-width: 720px) {
				max-height: 60vh;
				max-width: 80vw;
				min-width: 360px;
			}
		}
	}
}
// Frame container animation
.frame {
	&-enter-active,
	&-leave-active {
		transition-duration: 0.5s;
	}
	&-enter-from,
	&-leave-to {
		@media (max-width: 719px) {
			transform: translateY(105%);
		}
		@media (min-width: 720px) {
			transform: scale(0.9) translate(-50%, -50%);
			opacity: 0;
		}
	}
}
// Frame content animation
.push {
	&-left-enter-from,
	&-right-leave-to {
		transform: translateX(30%);
		opacity: 0;
	}
	&-right-enter-from,
	&-left-leave-to {
		transform: translateX(-30%);
		opacity: 0;
	}
}
</style>