<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Avatar from 'vue-avatar/src/Avatar.vue'
import Responsive from '../Responsive.vue'
import NavLink from './NavLink.vue'
import btn from '@CC/Button.vue'
import useUserStore from '@CS/user'
const user = useUserStore(),
// Component definition
	emit = defineEmits(['active'])
// Active title route match
const route = useRoute()
watch(() => route.path, checkPath)
function checkPath(path) {
	active.value = path == '/settings' ||
		(path == '/user' && route.params?.user == user.userID)
}
// Active title state maintenance
const active = ref(false)
watch(active, (active) => {
	if (active)
		if (route.path == '/settings')
			emit('active', '账号设置')
		else
			emit('active', '我的主页')
})
checkPath(route.path)
</script>

<template>
	<div avatar>
		
	</div>
</template>