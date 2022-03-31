<script setup>
import { ref } from 'vue'
import NavLink from './NavLink.vue'
import UserBadge from './UserBadge.vue'
import useUserStore from '@CS/user'
import { watch } from 'vue'
import { useRoute } from 'vue-router'
const collapse = ref(window.innerWidth < 720),
	title = ref(''),
	expand = ref(false),
	user = useUserStore(),
	redirecting = ref(false),
	route = useRoute(),
	domain = location.host
window.addEventListener('resize', () => {
	collapse.value = window.innerWidth < 720
})
function activeTitle(val) {
	title.value = val || 'Untitled'
	expand.value = false
}
watch(() => route.path, path => redirecting.value = path.startsWith('/redirect/'))
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
			<nav-link
				:disabled="redirecting"
				@active="activeTitle"
				to="/"
				title="主页"
				>主页</nav-link
			>
			<nav-link
				:disabled="redirecting"
				@active="activeTitle"
				:to="`/redirect/to/docs.${domain}/`"
				title="项目资料"
				>项目资料</nav-link
			>
			<nav-link
				:disabled="redirecting"
				@active="activeTitle"
				:to="`/redirect/to/forum.${domain}/`"
				title="讨论区"
				>讨论区</nav-link
			>
			<nav-link
				:disabled="redirecting"
				@active="activeTitle"
				v-if="!user.loginState"
				to="/register"
				title="注册"
				>注册</nav-link
			>
			<nav-link
				:disabled="redirecting"
				@active="activeTitle"
				v-if="!user.loginState"
				to="/login"
				title="登录"
				>登录</nav-link
			>
			<nav-link
				:disabled="redirecting"
				@active="activeTitle"
				v-if="user.loginState"
				to="/space"
				title="个人空间"
				>个人空间</nav-link
			>
			<user-badge
				:disabled="redirecting"
				@active="activeTitle"
				v-if="user.loginState"
			/>
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
	box-shadow: 0 8px 10px 0 #0008;
	-webkit-backdrop-filter: blur(10px);
	backdrop-filter: blur(10px);
	html.light & {
		background-color: hsla(0, 0%, 100%, 0.5);
	}
	html.dark & {
		background-color: hsl(215, 30%, 12%, 0.5);
	}
	/* border-radius: 10px; */
	// box-shadow: 0 0 10px 2px hsla(0, 0%, 0%, 0.15);
	// overflow: hidden;
	// border: 1px solid var(--cb-gray);
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
	transition-duration: 0.5s;
}
.side-slide-leave-active {
	transition-delay: 0.1s;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.side-slide-enter-from,
.side-slide-leave-to {
	transform: translateX(60vw);
	opacity: 0.5;
}
</style>