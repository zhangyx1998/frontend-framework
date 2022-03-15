<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Responsive from '../Responsive.vue'
import tri from '../TriStateLink.vue'
</script>

<template>
	<responsive>
		<tri nav-link :class="active ? 'active' : ''" :to="to" :href="href">
			{{ title || "Untitled" }}{{}}
		</tri>
	</responsive>
</template>

<style scoped lang="scss">
[nav-link] {
	/* Appearance */
	font-size: 0.92em;
	text-decoration: none;
	user-select: none;
	color: var(--ct-gray-dark);
	cursor: pointer;
	font-weight: 500;
	background: none !important;
	display: block;
	[collapse="false"] & {
		height: 100%;
		margin: 0 0.2em !important;
		padding: 2px 0.5em;
		display: block;
		line-height: calc(var(--header-height) - 4px);
		overflow: hidden;
		&::after {
			content: "";
			display: block;
			position: absolute;
			left: 0.3em;
			right: 0.3em;
			bottom: 0;
			height: 3px;
			background-color: transparent;
			transform: translateY(3px) scaleX(0);
			transition: 1s var(--curve);
		}
		&:not(.active):hover::after {
			background-color: var(--cb-gray);
			transform: translateY(0) scaleX(1);
		}
		&.active::after {
			background-color: var(--c-brand);
			transform: translateY(0) scaleX(1);
		}
	}
	[collapse="true"] & {
		margin: 0 !important;
		font-weight: bold;
		font-size: 16px;
		padding: 0.4em 1em;
		display: block;
		text-align: left;
		border-left: 8px solid transparent;
		line-height: calc(var(--header-height) - 4px);
		&.active {
			border-left: 8px solid var(--c-brand);
			background-color: var(--cf-next-level) !important;
		}
	}
}
</style>
