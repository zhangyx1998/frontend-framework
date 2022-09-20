<script setup>
import { computed } from 'vue'
const
	props = defineProps({
		bgColor: String,
		direction: String,
	}),
	imgMargin = computed(() => {
		return props.direction === 'column' ? '0 auto' : 'auto 0'
	})

</script>

<template>
	<div class="card-wrapper">
		<slot></slot>
	</div>
</template>

<style scoped lang="scss">
.card-wrapper {
	position: relative;
	display: flex;
	background-color: v-bind('props.bgColor||"var(--cf-next-level)"');
	border-radius: 0.5em;
	flex-direction: v-bind('props.direction');

	:deep(img) {
		border-radius: 6px;
		margin: v-bind(imgMargin);
	}

	&:hover {
		:deep(img) {

			transform: scale(1.25);
			transition: all 0.5s ease 0.1s;
		}
	}

	:deep(a) {
		color: var(--cb-blue);
		text-decoration: none;
	}

}
</style>
