<script setup>
import { ref, onMounted, markRaw, computed, watch, onDeactivated } from 'vue'
const stack = ref([]), depth = ref(0), display = ref(false), direction = ref(1),
	size = ref({ w: 0, h: 0, f: false }),
	sizeStyle = computed(() => ({
		width: size.value.w + 'px',
		height: size.value.h + 'px',
		transition: size.value.f ? 'none' : undefined
	})),
	showBackButton = computed(() => !!(
			depth.value > 1
			&& stack.value[depth.value - 1]?.abortable
		)),
	showCloseButton = computed(() => !stack.value
			.filter(({ abortable }, i) => !abortable && i < depth.value)
			.length
	),
	transition = computed(() => direction.value ? 'push-left' : 'push-right'),
	content = ref(null),
	loading = ref(false)
let sizeUpdateCounter = 0
function updateSize(nextTick = sizeUpdateCounter > 0 ? sizeUpdateCounter - 1 : 0) {
	const 
		el = content.value,
		w = el?.offsetWidth,
		h = el?.offsetHeight
	sizeUpdateCounter = nextTick
	if (!w || !h) return;
	if (size.value.w !== w || size.value.h !== h) {
		if (nextTick) {
			size.value.f = true
		} else {
			size.value.f = false
			size.value = { w, h }
			sizeUpdateCounter = 10
		}
	}
}
watch(content, () => updateSize())
setInterval(updateSize, 100)
// Watch the depth and set a small delay before updating display
watch(depth, (d, e) => {
	direction.value = d > e
	loading.value = false
	if (d) {
		display.value = true
	} else setTimeout(() => display.value = !!depth.value, 100)
})
function onLoading(state) {
	loading.value = state
	if (depth.value) {
		stack.value[depth.value - 1].loading = !!state
	}
	if (state) updateSize()
}
// Initialize exposed enqueue function
let counter = 0
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
					LOAD(...args) {
						loading.value = true
						return new Promise(async (res, rej) => {
							do {
								try {
									args = (await Promise.all(args)).map(
										arg => {
											if (typeof arg === 'function') return arg()
											return arg
										}
									)
								} catch (e) {
									console.error(e)
									rej(e)
								}
							} while (args.filter(p => p instanceof Promise).length)
							loading.value = false
							res(...args)
						})
					},
					...(component?.methods || {})
				},
			}),
			uid: counter = ++counter | 0,
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
		<div frame-background :display="display"></div>
		<transition name="frame">
			<div frame-window v-if="display" @transitionend="updateSize(0)">
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
							frame-animation-element
							:style="{
								left: `${showBackButton ? 3.6 : 1.2}rem`,
								right: `${showCloseButton ? 3.6 : 1.2}rem`,
							}"
							:key="
								stack[depth && depth - 1]?.title +
								(depth && depth - 1)
							"
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
					@transitionend="updateSize(0)"
					:style="sizeStyle"
				>
					<transition-group :name="transition">
						<div
							frame-content
							frame-animation-element
							v-for="(el, i) in stack"
							:key="el.uid"
							:ref="
								(_) => {
									if (i + 1 == depth) content = _;
								}
							"
							v-show="i + 1 == depth || (!depth && !i)"
						>
							<keep-alive>
								<component
									:is="el?.component"
									@return="onReturn"
									@loading="onLoading"
								/>
							</keep-alive>
						</div>
					</transition-group>
					<transition name="fade">
						<div
							frame-animation-element
							frame-loading-cover
							v-if="loading"
						>
							<chasing-circle :scale="5" />
						</div>
					</transition>
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
import Confirm from './frames/confirm.vue'
export function confirm(title, content, { abortable = false, color, text } = {}) { 
	return $(title, Confirm, { abortable }, content, { color, text })
}
import Alert from './frames/alert.vue'
export function alert(title, content) {
	return $(title, Alert, { abortable: true }, content)
}
import Prompt from './frames/prompt.vue'
export function prompt(title, content) {
	return $(title, Prompt, { abortable: true }, content)
}
import Select from './frames/select.vue'
export function select(title, options, showKey = true, abortable = true) {
	return $(title, Select, { abortable }, options, showKey)
}
import LocaleEditor from './locale/Editor.frame.vue'
export function editLocale(title, name = {}) {
	return $(title, LocaleEditor, { abortable: true }, name)
}
import PR_inspect from './frames/progress-report/inspect.vue'
import PR_submit from './frames/progress-report/submit.vue'
import PR_update from './frames/progress-report/update.vue'
export const ProgressReport = {
	inspect: () => $('查看进度报告', PR_inspect),
	submit: () => $('创建进度报告', PR_submit),
	update: () => $('修改进度报告', PR_update),
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
	overscroll-behavior: none;
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
				max-height: 85vh;
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
		[frame-loading-cover] {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: var(--cf);
			-webkit-backdrop-filter: blur(2px);
			backdrop-filter: blur(2px);
			opacity: 0.6;
			& > * {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}
		}
	}
}
// Frame container animation
.frame {
	&-enter-active,
	&-leave-active {
		transition-duration: 0.5s;
		& *:not([frame-loading-cover]) {
			transition: none !important;
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
[frame-animation-element] {
	transition-duration: 0.8s !important;
}
.push {
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
.fade {
	&-enter-from,
	&-leave-to {
		opacity: 0;
	}
	&-leave-active {
		transition-duration: 0.5s;
		transition-delay: 0.1s;
	}
}
</style>