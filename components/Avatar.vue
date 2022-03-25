<script setup>
import ChasingCircle from './spinners/ChasingCircle.vue';
import { computed, onMounted, ref, watch } from 'vue'
const props = defineProps({
		userID: {
			type: String,
			default: ''
		},
		size: {
			type: Number,
			default: 1
		}
	}),
	url = computed(() => props.userID && `/user/${props.userID}/avatar`),
	scheme = ['red', 'green', 'blue', 'yellow'],
	color = computed(() => props.userID
		? scheme[props.userID.charCodeAt(0) % scheme.length]
		: 'gray'
	),
	hasAvatar = ref(false),
	avatarLoaded = ref(false)
watch(url, checkAvatarImage)
onMounted(() => checkAvatarImage(url.value))
function checkAvatarImage(url) {
	if (url) {
		avatarLoaded.value = false
		fetch(url).then(res => {
			const isValidImage =
				res.ok &&
				res.headers?.['content-type']?.startsWith('image') &&
				true || false
			hasAvatar.value = isValidImage
			if (isValidImage) {
				res.on('end', () => avatarLoaded.value = true)
			}
		})
	}
	else
		hasAvatar.value = false
}
</script>

<template>
	<div
		avatar
		:style="{
			background: `var(--ct-${color})`,
			color: `var(--cb-${color})`,
			'font-size': `${size}em`,
		}"
	>
		<img avatar-image v-if="hasAvatar && avatarLoaded" :src="url" />
		<chasing-circle :scale="0.5" v-else-if="hasAvatar" />
		<div v-else avatar-char>{{ userID[0]?.toUpperCase() || "?" }}</div>
	</div>
</template>

<style lang="scss" scoped>
[avatar] {
	width: 1em;
	height: 1em;
	border-radius: 0.5em;
	overflow: hidden;
	position: relative;
	*:hover > &,
	&:hover {
		box-shadow: 0 0 5px 0 var(--c-brand-light);
	}
	& > * {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
	[avatar-char] {
		// font-family: 'Cascadia Code', 'Courier New', Courier, monospace;
		font-size: 0.8em;
		text-align: center;
		height: 1em;
		width: 1em;
		// padding: 0.125em;
		line-height: 1em;
		// font-weight: 200;
	}
	[avatar-img] {
		width: 1em;
		height: 1em;
	}
}
</style>