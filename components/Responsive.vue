<script setup>
import { ref } from 'vue';
const touch = ref(false)
</script>

<template>
	<div
		responsive
		style="position: relative; overflow: hidden"
		@click="touch = false"
		@touchstart="touch = true"
		@mousedown="touch = true"
		@touchcancel="touch = false"
		@touchend="touch = false"
		@touchleave="touch = false"
		:class="[touch ? 'touch-down' : 'touch-up']"
	>
		<slot @blur="touch = false"></slot>
	</div>
</template>

<style scoped lang="scss">
[responsive] {
	position: relative;
	&::before {
		pointer-events: none;
		display: block;
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}
	&.touch-up::before {
		transition: .3s;
		transition-delay: .1s;
		-webkit-backdrop-filter: brightness(1);
		backdrop-filter: brightness(1);
	}

	&.touch-down::before {
		transition: .05s;
		html.light & {
			-webkit-backdrop-filter: brightness(0.9);
			backdrop-filter: brightness(0.9);
		}
		html.dark & {
			-webkit-backdrop-filter: brightness(1.1);
			backdrop-filter: brightness(1.1);
		}
	}
}
</style>
