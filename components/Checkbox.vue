<script setup>
import Responsive from "/components/Responsive.vue";
defineProps({
	selected: Boolean,
});
</script>

<template>
	<div>
		<Responsive
			style="
				display: flex;
				align-items: center;
				padding: 0.4em;
				margin: 0.4em -0.2em;
				border-radius: 0.2em;
			"
		>
			<i
				:class="selected ? 'fas fa-check-square' : 'far fa-square'"
				:style="{
					color: `var(${
						selected ? '--accent-selected' : '--gray-dark'
					})`,
				}"
				style="margin-right: 0.5em"
			></i>
			<span style="font-size: 0.8em"><slot></slot></span>
		</Responsive>
	</div>
</template>