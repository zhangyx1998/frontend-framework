<script setup>
import { ref, onMounted, markRaw, computed, watch, onDeactivated } from 'vue'
const stack = ref([]), depth = ref(0), display = ref(false), direction = ref(1),
	w = ref(0), h = ref(0),
	showBackButton = computed(() => !!(
			depth.value > 1
			&& stack.value[depth.value - 1]?.abortable
		)),
	showCloseButton = computed(() => !!(
		!showBackButton
		&& stack.value
			.map(({ abortable }, i) => i < depth.value ? abortable : true)
			.reduce((a, b) => a && b, true)
	)),
	transition = computed(() => direction.value ? 'push-left' : 'push-right'),
	content = ref(null),
	loading = ref(false)
async function updateSize() {
	const el = content.value
	if (el && w.value !== el.offsetWidth) {
		w.value = el.offsetWidth
	}
	if (el && h.value !== el.offsetHeight) {
		h.value = el.offsetHeight
	}
}
let interval
onMounted(() => setInterval(updateSize, 100))
onDeactivated(() => {
	try {
		clearInterval(interval)
	} catch (e) {}
})
// Watch the depth and set a small delay before updating display
watch(depth, (d, e) => {
	direction.value = d > e
	loading.value = false
	if (d) {
		display.value = true
	} else {
		setTimeout(() => {
			display.value = !!depth.value
		}, 100);
	}
})
watch(content, updateSize)
function onLoading(state) {
	if (depth.value) {
		stack.value[depth.value - 1].loading = !!state
	}
}
// Initialize exposed enqueue function
$ = function pushStack(title, component, { abortable = true } = {}, ...args) {
	return new Promise(resolve => {
		stack.value[depth.value++] = {
			title,
			component: markRaw({
				...component,
				setup() {
					if (typeof component?.setup === 'function')
						return component?.setup(...args)
					else
						return { args }
				},
				emits: ['return', 'loading', ...(component?.emits || [])],
				methods: {
					RETURN(...args) {
						this.$emit('return', ...args)
					},
					...(component?.methods || {})
				},
			}),
			abortable,
			resolve
		}
	})
}
// Resolve the returned value to the caller
function onReturn(...args) {
	if (depth.value) {
		const { resolve } = stack.value[depth.value -= 1]
		resolve(...args)
		setTimeout(() => {
			while(stack.value.length > depth.value) stack.value.pop()
		}, 1000);
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
		// Recursively abort all abortable frames
		if (all) onAbort(all)
	}
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
						@click="onAbort(false)"
					>
						<svg viewBox="0 0 20 20">
							<g style="fill: var(--ct-gray-dark)">
								<path
									d="M12,19.5a1.51,1.51,0,0,1-1.06-.44l-8-8a1.49,1.49,0,0,1,0-2.12l8-8a1.5,1.5,0,0,1,2.12,2.12L6.47,9.65a.5.5,0,0,0,0,.7L13,16.86A1.59,1.59,0,0,1,13.15,19,1.54,1.54,0,0,1,12,19.5Z"
								/>
							</g>
						</svg>
					</responsive>
					<transition-group :name="transition">
						<div
							title-text
							:style="{
								left: `${showBackButton ? 3.6 : 1.2}rem`,
								right: `${showCloseButton ? 3.6 : 1.2}rem`,
							}"
							:key="depth"
						>
							{{
								stack[depth && depth - 1]?.title ||
								"Untitled frame"
							}}
						</div>
					</transition-group>
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
						height: h + 'px',
						width: w + 'px',
					}"
				>
					<transition-group :name="transition">
						<div
							frame-content
							v-for="(el, i) in stack"
							:key="i"
							:ref="
								(_) => {
									if (i + 1 == depth) content = _;
								}
							"
							v-show="i + 1 == depth"
						>
							<keep-alive>
								<component
									:is="stack[i]?.component"
									@return="onReturn"
									@loading="onLoading"
								/>
							</keep-alive>
						</div>
					</transition-group>
				</div>
			</div>
		</transition>
	</div>
</template>


<script>
/**
 * @type {(
 * 	title: String,
 * 	component: import('vue').Component,
 * 	{ [abortable]: Boolean },
 * 	...args
 * ) => Promise<Any>}
 */
export let $
// Default stack function export
import vConfirm from './win-stack/confirm.vue'
export function confirm(title, content, { abortable = false, color, text }) { 
	return $(title, vConfirm, { abortable }, content, { color, text })
}
import vAlert from './win-stack/alert.vue'
export function alert(title, content) {
	return $(title, vAlert, { abortable: true }, content)
}
import vPrompt from './win-stack/prompt.vue'
export function prompt(title, content) {
	return $(title, vPrompt, { abortable: true }, content)
}
import vSelect from './win-stack/select.vue'
export function select(title, options, showKey = true, abortable = true) {
	return $(title, vSelect, { abortable }, options, showKey)
}
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
	-webkit-backdrop-filter: blur(2px);
	backdrop-filter: blur(2px);
	background-color: var(--cf-next-next-level);
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
			padding: 1.2rem 0;
			height: 100%;
			line-height: 100%;
			color: var(--ct-gray);
			font-size: 1.2rem;
			font-weight: 500;
			white-space: nowrap;
			overflow: hidden;
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
			:deep([btn-group]) {
				display: flex;
				flex-direction: row-reverse;
				flex-wrap: wrap;
				justify-content: center;
				padding: 1em 0;
				border-top: 1px solid var(--cb-gray-light);
				& > * {
					margin: 1em;
					flex-grow: 1;
					max-width: 10em;
					padding: 0.8em 2em;
				}
			}
			:deep([frame-prompt]) {
				text-align: left;
				justify-content: center;
				font-size: 1.2rem;
				color: var(--ct-gray);
				font-weight: normal;
				padding: 2rem 1.2rem;
			}
		}
	}
}
// Frame container animation
.frame {
	&-enter-active,
	&-leave-active {
		transition-duration: 0.5s;
		& * {
			transition: 0s none !important;
		}
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
	&-left-enter-active,
	&-right-enter-active {
		transition-delay: 0.2s;
	}
	&-left-enter-from,
	&-right-leave-to {
		transform: translateX(50%);
		opacity: 0;
	}
	&-right-enter-from,
	&-left-leave-to {
		transform: translateX(-50%);
		opacity: 0;
	}
}
</style>