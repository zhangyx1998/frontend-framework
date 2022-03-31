<script setup>
import { ref, computed } from "vue";
const props = defineProps({
		type: {
			type: String,
			default: "",
		},
		// Used for vue-router
		to: {
			type: String,
			default: "",
		},
		// Used for page navigation
		href: {
			type: String,
			default: "",
		},
	}),
	touch = ref(false),
	pseudo = ref(null),
	disabled = computed(
		() =>
			(Array.isArray(props.type)
				? props.type
				: props.type.split(" ")
			).indexOf("disabled") >= 0
	);
let _focus_by_mouse_ = false;
function focus() {
	if (_focus_by_mouse_) {
		pseudo.value.focus();
	}
	_focus_by_mouse_ = false;
}
function mouseDown() {
	_focus_by_mouse_ = true;
	pseudo.value.focus();
}
function touchDown() {
	_focus_by_mouse_ = true;
	pseudo.value.focus();
}
function keyDown() {
	_focus_by_mouse_ = true;
	pseudo.value.focus();
}
</script>

<template>
	<tri
		button
		:class="[type, touch ? 'active' : '']"
		:to="to"
		:href="href"
		@keydown.enter="pseudo.blur()"
		@mousedown="mouseDown"
		@focus="focus"
		@blur="touch = false"
		@click="touch = false"
		@touchstart="
			touch = true;
			mouseDown();
		"
		@touchcancel="touch = false"
		@touchend="touch = false"
		@touchleave="touch = false"
		:tabindex="!disabled ? '0' : ''"
	>
		<span><slot /></span>
		<span
			style="display: hidden"
			tabindex="-1"
			:ref="(_) => (pseudo = _)"
			@blur="touch = false"
		></span>
	</tri>
</template>

<style scoped lang="scss">
[button] {
	/* Appearance */
	display: flex;
	cursor: pointer;
	align-items: center;
	justify-content: center;
	border-radius: 0.66em;
	font-weight: bold;
	font-size: 0.9em;
	margin: 0.4em;
	padding: 0.6em 0.8em;
	line-height: 1em;
	border: 2px solid var(--cb);
	transition-duration: 0.5s;
	user-select: none;
	/* Default theme */
	--cf: var(--cf-next-level);
	--ct: var(--ct-gray);
	--cb: transparent;
	--wb: 2px;
	--cf-hover: var(--cf);
	--ct-hover: var(--ct);
	--cb-hover: var(--cb);
	--filter-hover: brightness(110%);
	--cf-active: var(--cf-hover);
	--ct-active: var(--ct-hover);
	--cb-active: var(--cb-hover);
	--filter-active: brightness(120%);
	color: var(--ct);
	background-color: var(--cf);
	border: var(--wb) solid var(--cb);
	filter: brightness(100%);
	// Transition override
	&,
	* {
		transition-duration: 0.5s !important;
		transition-delay: 0 !important;
	}
	/* Default interaction */
	&:not(.disabled) {
		box-shadow: 0 0 3px 0 transparent;
		&:hover,
		&:focus {
			color: var(--ct-hover);
			border: var(--wb) solid var(--cb-hover);
			background-color: var(--cf-hover);
			filter: var(--filter-hover);
			box-shadow: 0 0 3px 0 var(--cf-gray-dark);
		}
		&:active,
		&.active {
			color: var(--ct-active);
			border: var(--wb) solid var(--cb-active);
			background-color: var(--cf-active);
			filter: var(--filter-active);
		}
	}
	& > * {
		display: inline-flex;
		flex-wrap: nowrap;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	/* type: seamless */
	&.seamless {
		background-color: transparent;
		--cf: transparent;
		--filter-hover: brightness(110%);
		--filter-active: brightness(120%);
		&.brand {
			--ct: var(--c-brand);
		}
		&.green {
			--ct: var(--ct-green);
		}
		&.blue {
			--ct: var(--ct-blue);
		}
		&.red {
			--ct: var(--ct-red);
		}
		&.gray {
			--ct: var(--ct-gray);
		}
		&.gray-brand {
			--ct: var(--c-brand);
		}
	}
	/* type: solid */
	&.solid {
		--ct: var(--c-brand-contrast);
		/* solid brand */
		&.brand {
			--cf: var(--c-brand);
			--filter-hover: brightness(110%);
			--filter-active: brightness(120%);
		}
		/* solid green */
		html.light &.green {
			--cf: hsl(132, 48%, 36%);
			--cf-hover: hsl(132, 44%, 40%);
			--cf-active: hsl(132, 42%, 44%);
		}
		html.dark &.green {
			--cf: hsl(132, 48%, 36%);
		}
		/* solid blue */
		&.blue {
			--cf: hsl(217, 48%, 36%);
			--cf-hover: hsl(217, 44%, 40%);
			--cf-active: hsl(217, 42%, 44%);
		}
		/* solid red */
		&.red {
			--cf: hsl(0, 48%, 36%);
			--cf-hover: hsl(0, 44%, 40%);
			--cf-active: hsl(0, 42%, 44%);
		}
		/* solid gray */
		&.gray {
			--ct: var(--ct-gray);
			--cf: var(--cf-next-level);
			--ct-hover: var(--ct-gray-dark);
			--filter-hover: brightness(96%);
			--filter-active: brightness(92%);
		}
		/* solid gray-brand */
		&.gray-brand {
			--ct: var(--c-brand);
			--cf: var(--cf-next-level);
			--ct-hover: var(--c-brand-dark);
			--filter-hover: brightness(96%);
			--filter-active: brightness(92%);
		}
	}
	&.outlined {
		--cb: var(--ct);
		--cf: transparent;
		--cf-hover: var(--cf-next-level);
		--cf-active: var(--cf-next-next-level);
		border-width: 1px !important;
		&.red {
			--ct: var(--ct-red);
		}
		&.green {
			--ct: var(--ct-green);
		}
		&.blue {
			--ct: var(--ct-blue);
		}
		&.red {
			--ct: var(--ct-red);
		}
		&.brand {
			--ct: var(--c-brand-light);
		}
		&.gray {
			--ct: var(--ct-gray);
		}
	}
	/* link */
	&.link {
		padding-left: 0;
		padding-right: 0;
		text-decoration: underline;
		color: var(--ct-gray);
		font-weight: unset;
		font-size: unset;
		color: unset !important;
		display: inline-block;
		margin: 0;
		background: none;
		&:hover {
			color: var(--ct-gray-dark);
		}
		&:active,
		&.active {
			color: var(--ct-gray);
		}
	}
	/* disabled */
	&.disabled {
		cursor: not-allowed !important;
		filter: saturate(0);
	}
}
</style>