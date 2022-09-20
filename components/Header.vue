<script setup>
import Nav from "./header/Nav.vue";
import { computed, ref, watch } from "vue";
// Loading animation
const
	props = defineProps({
		loading: {
			type: Boolean,
			default: false,
		},
		bgColor: {
			type: String,
			default: 'var(--cf)'
		},
		bgColorLight: {
			type: String,
			default: ''
		},
		bgColorDark: {
			type: String,
			default: ''
		},
	}),
	style = computed(() => ({
		bgColorLight: props.bgColorLight || props.bgColor,
		bgColorDark: props.bgColorDark || props.bgColor,
	})),
	progress = ref(false);
let timeout = undefined;
watch(
	() => props.loading,
	(now, old) => {
		if (timeout !== undefined) {
			try {
				clearTimeout(timeout);
			} catch (e) { }
			timeout = undefined;
		}
		if (now) {
			if (!progress.value) progress.value = true;
		} else {
			// Loading ends
			timeout = setTimeout(() => {
				progress.value = false;
				timeout = undefined;
			}, 200);
		}
	}
);
</script>

<template>
	<div class="header-placeholder"></div>
	<div class="header">
		<slot name="title"></slot>
		<Nav>
			<template #nav>
				<slot name="nav"></slot>
			</template>
		</Nav>
		<transition name="prog">
			<div class="progress" v-if="progress"></div>
		</transition>
	</div>
</template>

<style>
:root {
	--header-height: 3.6rem;
}
</style>

<style scoped lang="scss">
.header,
.header-placeholder {
	width: 100%;
	height: var(--header-height);
}

.header {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 1000;
	/* Layout */
	padding: 0 1.5rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
	/* Appearance */
	html.light & {
		background-color: v-bind("style.bgColorLight");
	}
	html.dark & {
		background-color: v-bind("style.bgColorDark");
	}
	/* background-color: var(--cf); */
	border-bottom: 1px solid var(--cb-gray-light);
	box-shadow: 0 0 5px 0 hsla(0, 0%, 0%, 0.1);
}

.header-placeholder {
	position: relative;
}

/* Loading progress-bar */
.progress {
	position: fixed;
	z-index: 999;
	box-shadow: 0 3px 10px 0 hsla(217, 100%, 30%, 0.5);
	left: 0;
	top: var(--header-height);
	height: 3px;
	margin: 0;
	padding: 0;
	background-color: var(--c-brand-light);
	width: 90%;
	opacity: 1;
}

.prog-enter-from {
	width: 0%;
	opacity: 1;
}

.prog-enter-active {
	transition: 2s ease-in-out;
}

.prog-leave-active {
	transition: 0.3s ease-in-out;
}

.prog-leave-to {
	width: 100%;
	opacity: 0;
}
</style>
