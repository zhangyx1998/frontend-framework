<template>
	<div frame-prompt v-if="content">{{ content }}</div>
	<div btn-group>
		<btn :type="`solid ${color || 'green'}`" @click="RETURN(true)">{{
			text || "confirm"
		}}</btn>
		<btn type="solid gray" @click="RETURN(false)">Cancel</btn>
	</div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
	setup(content, { color, text } = {}) {
		return { content, color, text }
	}
})
</script>