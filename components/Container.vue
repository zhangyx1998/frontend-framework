<script setup>
const props = defineProps({
	title: String,
	nextLevel: Boolean,
	pad: {
		default: true,
		type: Boolean,
	},
	frame: {
		default: false,
		type: Boolean,
	},
	type: {
		default: "plain",
		type: String,
	},
});
</script>

<template>
	<div
		container
		:type="type"
		:pad="pad"
		:frame="frame"
		:class="[nextLevel ? 'next-level' : '']"
	>
		<div class="title" v-if="title">{{ title }}</div>
		<slot></slot>
	</div>
</template>

<style lang="scss" scoped>
[container] {
	.title {
		font-size: 1.2em;
		color: var(--ct-gray);
		text-align: center;
		padding: 1em;
	}
	&.next-level {
		background-color: var(--cf-next-level);
	}
	&[pad=true] {
		padding: 1rem 2rem;
	}
	&[frame=true] {
		padding: 0;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	@media (min-width: 1280px) {
		&[type=plain] {
			--space-h: calc((100vw - 1280px) / 2);
			padding-left: var(--space-h);
			padding-right: var(--space-h);
		}
	}
	/* Colorful container boxes */
	&:not([type=plain]) {
		margin: 0.8rem 0;
		border-left: 8px solid var(--cb);
		border-radius: 6px;
		background-color: var(--cf);
		color: var(--ct);
		&[pad=true] {
			padding: 1rem;
		}
	}
	&[type=message] {
		--cb: var(--cb-gray);
		--cf: var(--cf-gray-light);
		--ct: var(--ct-gray);
	}
	&[type=info] {
		--cb: var(--cb-blue);
		--cf: var(--cf-blue);
		--ct: var(--ct-blue);
	}
	&[type=info].green {
		--cb: var(--cb-green);
		--cf: var(--cf-green);
		--ct: var(--ct-green);
	}
	&[type=warn] {
		--cb: var(--cb-yellow);
		--cf: var(--cf-yellow);
		--ct: var(--ct-yellow);
	}
	&[type=alert] {
		--cb: var(--cb-red);
		--cf: var(--cf-red);
		--ct: var(--ct-red);
	}
	/* Attribute syntactic sugar */
	&[flex] {
		display: flex;
		align-items: center;
	}
	&[flex-row] {
		flex-direction: row;
	}
	&[flex-column] {
		flex-direction: column;
	}
	&[flex-center] {
		justify-content: center;
	}
	&[flex-start] {
		justify-content: flex-start;
	}
	&[flex-end] {
		justify-content: flex-end;
	}
	&[flex-space-between] {
		justify-content: space-between;
	}
	&[flex-space-evenly] {
		justify-content: space-evenly;
	}
	&[flex-space-around] {
		justify-content: space-around;
	}
	&[flex-grow] {
		flex-grow: 1;
	}
}
</style>