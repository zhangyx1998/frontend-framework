<script setup>
defineProps({
	state: String,
	type: String,
	icon: String,
	name: String,
});
</script>

<template>
	<div
		badge
		:class="[type, state, interactive ? 'interactive' : '']"
		@keydown.enter="$emit('click')"
		@mousedown="mouseDown"
		@focus="focus"
		:tabindex="interactive ? '0' : ''"
		ref="el"
	>
		<i
			v-if="icon"
			:class="icon"
			style="font-size: 1.1em; margin-right: 0.2em"
		></i>
		<span
			style="
				display: inline-flex;
				font-size: 0.9em;
				padding: 0;
				margin: 0;
			"
			>{{ name }}</span
		>
	</div>
</template>

<script>
let _focus_by_mouse_ = false;
export default {
	methods: {
		focus() {
			if (_focus_by_mouse_) {
				this.$refs.el.blur();
			}
			_focus_by_mouse_ = false;
		},
		mouseDown() {
			_focus_by_mouse_ = true;
			this.$refs.el.blur();
		},
	},
	computed: {
		interactive() {
			const interactive =
				(Array.isArray(this.type)
					? this.type
					: this.type.split(" ")
				).indexOf("interactive") >= 0;
			return interactive && this.state !== "disabled";
		},
	},
};
</script>

<style>
:root {
	/* Default values */
	--badge-margin: 0;
	--badge-padding: 0.3em 0.4em;
}
</style>

<style scoped>
/* Variable Monting */
[badge] {
	/* Positioning */
	display: flex;
	padding: var(--badge-padding);
	/* Content Layout */
	height: min-content;
	align-items: center;
	margin: var(--badge-margin);
	/* Border Appearance */
	border-radius: 6px;
	border: 0.1em solid var(--border-color);
	background-color: var(--color-bkg);
}

[badge].interactive:not(.disabled) {
	cursor: pointer;
}

[badge] > * {
	display: flex;
}
/* Interactive properties */
[badge] {
	font-weight: 500;
	line-height: 1em;
}
[badge].interactive {
	transition: 80ms;
}
[badge].interactive:hover {
	filter: brightness(1.2);
}

[badge].interactive:active {
	filter: brightness(1.1);
}

[badge]:focus {
	transform: scale(1.06);
	outline: 2px solid var(--accent-bright);
	box-shadow: 2px 2px 6px 0px rgba(0, 0, 0, 0.3);
}
/* Theme 'accent' */
[badge].accent,
[badge].accent.selected {
	color: white;
	--color-bkg: var(--accent-dark);
	--border-color: var(--accent-dark);
}
[badge].accent.unselected {
	opacity: 0.6;
	color: var(--accent);
	--color-bkg: var(--accent-background);
	--border-color: transparent;
}
[badge].accent.disabled {
	opacity: 0.6;
	color: var(--accent-dark);
	--color-bkg: var(--accent-background);
	--border-color: var(--accent-dark);
}
/* colored blue */
[badge].gray {
	color: var(--gray);
	--color-bkg: rgba(0, 0, 0, 0.1);
	--border-color: var(--gray);
}
/* disabled */
[badge].disabled {
	cursor: default;
	pointer-events: none;
}
</style>