<script setup>
defineProps({
	scale: {
		type: Number,
		default: 1
	}
})
</script>

<template>
	<div chasing-circle spinner :style="{'font-size': `${scale}em`}">
		<div></div>
		<div></div>
		<div></div>
		<div></div>
	</div>
</template>
<style lang="scss" scoped>
[chasing-circle] {
	display: inline-block;
	position: relative;
	width: 1em;
	height: 1em;
	line-height: 1em;
	div {
		box-sizing: border-box;
		display: block;
		position: absolute;
		width: 1em;
		height: 1em;
		border: 0.1em solid var(--ct);
		border-radius: 50%;
		animation: chasing-circle 1.2s cubic-bezier(0.4, 0, 0.3, 1) infinite;
		border-color: var(--ct) transparent transparent transparent;
	}
	div:nth-child(1) {
		animation-delay: -0.3s;
	}
	div:nth-child(2) {
		animation-delay: -0.2s;
	}
	div:nth-child(3) {
		animation-delay: -0.1s;
	}
}
@keyframes chasing-circle {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>