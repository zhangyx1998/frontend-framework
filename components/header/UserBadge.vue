<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import NavLink from './NavLink.vue'
import useUserStore from '@CS/user'
import { router } from '@/router'
const user = useUserStore(),
	// Component definition
	emit = defineEmits(['active']),
	props = defineProps({
		disabled: Boolean
	}),
	route = useRoute()
// Active title route match
watch(() => route.path, checkPath)
function checkPath(path) {
	active.value = path.startsWith('/settings') || (
		path.startsWith('/user') && route.params?.userID == user.userID
	)
}
// Active title state maintenance
const active = ref(false)
watch(active, () => {
	const { path } = route
	if (path.startsWith('/settings'))
		emit('active', '账号设置')
	else if (path.startsWith(`/user/${user.userID}`))
		emit('active', '我的主页')
})
checkPath(route.path)
function gotoHomePage() {
	router.push(router.resolve(`/user/${user.userID}/`))
}
</script>

<template>
	<span mobile-placeholder></span>
	<div user-badge-wrapper>
		<nav-link user-hover-link :disabled="disabled" :active="active">
			<avatar :userID="user.userID || ''" :size="1.6" />
			<span style="margin-left: 0.5em; height: 100%">{{
				user.name
			}}</span>
		</nav-link>
		<div user-info-wrapper>
			<div user-info-pane>
				<responsive @click="gotoHomePage" avatar-id-name>
					<avatar :userID="user.userID || ''" :size="3" />
					<div id-name>
						<div name>{{ user.name }}</div>
						<div id>{{ user.userID }}</div>
					</div>
				</responsive>
				<div user-action-links>
					<btn
						to="/settings/"
						:type="
							route.path == '/settings/'
								? 'solid brand'
								: 'seamless'
						"
						>账号设置</btn
					>
					<btn
						to="/logout"
						:type="
							route.path == '/logout'
								? 'solid red'
								: 'seamless red'
						"
						>退出登录</btn
					>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
[collapse="false"] [mobile-placeholder],
[collapse="true"] [user-hover-link] {
	display: none;
}
[mobile-placeholder] {
	flex-grow: 1;
}
[collapse="false"] [user-badge-wrapper]:not(:hover) [user-info-wrapper] {
	// Hover animation
	transform-origin: 100% 0%;
	opacity: 0;
	transform: scale(0.8);
	pointer-events: none;
	transition-delay: 0.3s;
}
[user-info-wrapper] {
	[collapse="false"] & {
		padding: 10px 0;
		position: fixed;
		top: calc(var(--header-height));
		right: calc(1.5rem);
		transition-duration: 0.5s;
		[user-info-pane] {
			padding: 5px;
			border-radius: 10px;
			background-color: var(--cf);
			box-shadow: 0 0 10px 0 var(--c-box-shadow);
		}
	}
	[user-info-pane] {
		* {
			display: flex;
		}
		[avatar-id-name] {
			border-bottom: 1px solid var(--cb-gray-light);
			flex-direction: row;
			margin: 0;
			justify-content: left;
			[id-name] {
				padding-left: 1em;
				flex-direction: column;
				justify-content: space-evenly;
				[id] {
					font-family: "Cascadia Code", "Courier New", Courier,
						monospace;
					font-size: 0.8em;
					color: var(--ct-gray);
				}
			}
			[collapse="true"] & {
				padding: 1.2rem 1rem;
			}
			[collapse="false"] & {
				padding: 0.6rem;
				padding-bottom: 1rem;
			}
		}
		[user-action-links] {
			flex-direction: row;
			margin: 0;
			justify-content: space-evenly;
			[collapse="true"] & {
				padding: 0.5rem 0 0.8rem 0;
			}
			[collapse="false"] & {
				padding-top: 0.2rem;
			}
		}
	}
}
</style>