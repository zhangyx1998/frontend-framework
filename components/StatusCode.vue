<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
const LUT = {
		401: '您当前身份无法访问此服务, 建议您登录后重试',
		403: '您的没有访问此服务的权限',
		404: '无法找到页面',
		500: '应用内部错误',
	},
	route = useRoute(),
	code = computed(() =>
		/^\d+$/g.test(route.params.code) && route.params.code
		|| 404
	)
</script>

<template>
	<container
		style="
			display: flex;
			flex-grow: 1;
			justify-content: center;
			align-items: center;
		"
		w1280
	>
		<div style="display: flex; align-items: left; flex-direction: column">
			<h1>{{ code }}</h1>
			<h2 v-if="code in LUT">
				{{ LUT[code] }}
			</h2>
			<span
				style="
					display: flex;
					flex-direction: row;
					justify-content: flex-start;
					margin: 1em 0;
				"
			>
				<btn style="font-size: 1.2rem" type="gray brand" to="/"
					>← 返回主页</btn
				>
			</span>
		</div>
	</container>
</template>

<style scoped>
* {
	display: block;
	color: var(--ct-gray-light);
}
h1 {
	font-size: 8rem;
}
h2 {
	font-size: 2rem;
}
</style>