<script setup>
import { ref } from "vue";
import useUserStore from "@CS/user";
import { useNavStore } from "@CS/nav";
import { watch } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";

const collapse = ref(window.innerWidth < 720),
  nav = useNavStore(),
  { title, expand, redirecting } = storeToRefs(nav),
  user = useUserStore(),
  route = useRoute(),
  { host } = location;
window.addEventListener("resize", () => {
  collapse.value = window.innerWidth < 720;
});

watch(
  () => route.path,
  (path) => (redirecting.value = path.startsWith("/redirect/"))
);
</script>

<template>
	<transition name="fade">
		<div
			sidebar-collapse-area
			v-if="collapse && expand"
			@click="expand = false"
		></div>
	</transition>
	<transition name="side-slide">
		<div
			class="nav-link-group"
			:collapse="collapse"
			v-show="!collapse || expand"
		>
			<slot name="nav"></slot>
		</div>
	</transition>
	<div v-if="collapse" class="page-title">{{ title }}</div>
	<div
		v-if="collapse"
		@click="expand = !expand"
		class="expand-button"
		:class="expand ? 'expand' : ''"
	>
		<i class="fas fa-bars"></i>
	</div>
</template>

<style lang="scss" scoped>
.nav-link-group {
	display: flex;
}

.nav-link-group[collapse="true"] {
	flex-direction: column;
	position: fixed;
	top: var(--header-height);
	right: 0;
	width: 65vw;
	bottom: 0;
	z-index: 1000;
	-webkit-backdrop-filter: blur(10px);
	backdrop-filter: blur(10px);

	html.light & {
		background-color: hsla(0, 0%, 100%, 0.5);
	}

	html.dark & {
		background-color: hsl(215, 30%, 12%, 0.5);
	}

	box-shadow: 0 8px 10px 0 #0008;
	&.side-slide-enter-from,
	&.side-slide-leave-to {
		transform: translateX(65vw);
		opacity: 0.5;
	  box-shadow: 0 8px 10px 0 #0000;
	}
  
	& > :not(:first-child) {
		border-top: 1px solid var(--cb-gray-light);
	}
}

[sidebar-collapse-area] {
	position: fixed;
	top: var(--header-height);
	left: 0;
	bottom: 0;
	width: 100%;
	z-index: 999;
	-webkit-backdrop-filter: blur(2px) saturate(0.5);
	backdrop-filter: blur(2px) saturate(0.5);
}

.page-title {
	font-weight: bold;
	color: var(--ct-gray-dark);
}

.expand-button {
	font-size: 1.2em;
	padding: 0.3em 0.6em;
	border-radius: 5px;
	margin-left: 0.5em !important;
	margin-right: -0.5em !important;

	&.expand {
		color: var(--c-brand-contrast);
		background-color: var(--c-brand-dark);
	}
}

.fade-enter-active,
.fade-leave-active,
.side-slide-enter-active,
.side-slide-leave-active {
	transition-duration: .3s;
}

.side-slide-leave-active {
	transition-delay: 0.1s;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>