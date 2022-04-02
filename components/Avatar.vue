<script setup>
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
	scheme = ['red', 'green', 'blue', 'yellow'],
	color = computed(() => props.userID
		? scheme[props.userID.charCodeAt(0) % scheme.length]
		: 'gray'
	),
	hasAvatar = ref(false),
	dataURL = ref(undefined),
	transition = ref('')
watch(() => props.userID, checkAvatarImage)
onMounted(() => checkAvatarImage(props.userID))
function checkAvatarImage(userID) {
	const PROMISE = getAvatar(userID)
	PROMISE.hasAvatar.then(val => hasAvatar.value = val)
	PROMISE.dataURL.then(val => dataURL.value = val)
	setTimeout(() => {
		transition.value = 'fade'
	}, 100);
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
		style="border-radius: 0.5em"
	>
		<transition-group :name="transition">
			<img avatar-image v-if="hasAvatar && dataURL" :src="dataURL" />
			<chasing-circle :scale="0.5" v-else-if="hasAvatar" />
			<div v-else avatar-char>{{ userID[0]?.toUpperCase() || "?" }}</div>
		</transition-group>
	</div>
</template>

<script>
const avatarCache = {}
function getAvatar(userID) {
	if (userID in avatarCache) {
		return avatarCache[userID]
	} else {
		const request = fetch(`/user/${userID}/avatar`)
		return avatarCache[userID] = {
			hasAvatar: request.then(res => res.ok).catch(() => {}),
			dataURL: request.then(async res => {
				if (!res.ok) return undefined
				else return URL.createObjectURL(await res.blob())
			}).catch(() => {})
		}
	}
}
</script>


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
		position: absolute !important;
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
	[avatar-image] {
		width: 1em;
		height: 1em;
	}
}
.fade {
	&-enter-from,
	&-leave-to {
		opacity: 0;
	}
}
</style>