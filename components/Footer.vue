<script setup>
import Container from "./Container.vue";
</script>


<template>
	<Container class="footer">
		<div>京公网安备XXXXXXXXXXXXXXX号</div>
		<div>京ICP备XXXXXXXX号</div>
		<div>版权所有: 一生一芯团队</div>
		<div>Web Platform Contributor(s): Yuxuan Zhang</div>
		<div>Operations Feedback: <a href="mailto:xiebiwei@ict.ac.cn">Email</a></div>
		<div>Technical Feedback: <a href="mailto:yuxuan@yuxuanzhang.net">Email</a></div>
	</Container>
</template>

<style>
:root {
	--footer-height: 6rem;
}
</style>

<style scoped>
.footer {
	position: relative;
	top: 0;
	left: 0;
	/* Layout */
	min-height: var(--footer-height);
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	padding: 1em 10vw;
	/* Appearance */
	background-color: var(--cf-gray) !important;
	color: var(--ct-gray);
	font-size: 0.9em;
	/* Interaction */
	user-select: none;
}
.footer > * {
	margin: 0.2em 0.5em;
	opacity: 0.3;
}

a {
	display: inline;
	color: unset;
	padding: 0;
	margin: 0;
}
</style>
