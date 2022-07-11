<template>
	<span mjx-container><slot></slot></span>
</template>

<style lang="scss" scoped>
[mjx-container] {
	display: inline-block;
	overflow-x: scroll;
	max-width: 100%;
	vertical-align: middle;
}
</style>